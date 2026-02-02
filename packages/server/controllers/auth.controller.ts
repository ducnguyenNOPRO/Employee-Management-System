import bcrypt from "bcrypt";
import { signUpSchema, signInSchema } from "../models/zodSchema";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import z from "zod";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in ms

export async function signUp(req: Request, res: Response) {
  const result = signUpSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }

  try {
    const { firstName, lastName, email, password, role } = result.data;
    // Check if email exist
    const duplicate = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (duplicate) {
      res.status(400).json({ message: "email is existed" });
    }

    // Hasing password
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

    // Create user
    await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password_hash: hashedPassword,
        role: role,
      },
    });

    res.sendStatus(204);
  } catch (error) {
    console.log("Sign up error", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function signIn(req: Request, res: Response) {
  const result = signInSchema.safeParse(req.body);
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({
      error: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    const { email, password } = result.data;

    // Check if email exist
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // Check password
    const passwordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // Create accessToken with JWT
    const accessToken = jwt.sign({ userId: user.id }, secret, {
      expiresIn: ACCESS_TOKEN_TTL,
    });

    // Create and save refreshToken with JST
    const refreshToken = crypto.randomBytes(64).toString("hex");
    await prisma.session.create({
      data: {
        userId: user.id,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL),
      },
    });

    // Return refresh token to cooki
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // FE, BE deployed seperately,
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      message: `User ${user.first_name} ${user.last_name} logged in!`,
      accessToken,
    });
  } catch (error) {
    console.log("Sign in error", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function signOut(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // Delete refresh token in cookie and db
    if (refreshToken) {
      await prisma.session.delete({
        where: {
          refresh_token: refreshToken,
        },
      });
      res.clearCookie("refreshToken");
    }

    return res.status(204);
  } catch (error) {
    console.log("Sign out error", error);
    res.status(500).json({ message: "Server error" });
  }
}
