import bcrypt from "bcrypt";
import { signUpSchema, signInSchema, activateSchema } from "../lib/zodSchema";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import z from "zod";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { consumeInvitation } from "../lib/helper";

const ACCESS_TOKEN_TTL = "10m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days in ms

// Local dev only
export async function signUpAdmin(req: Request, res: Response) {
  const result = signUpSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }

  try {
    const { first_name, last_name, email, password, role } = result.data;
    // Check if email exist
    const duplicate = await prisma.admin.findUnique({
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
    await prisma.admin.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password_hash: hashedPassword,
        role: role,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    console.log("Sign up error", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function signUpEmployee(req: Request, res: Response) {
  const result = signUpSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }

  try {
    const { first_name, last_name, email, password, role } = result.data;
    // Check if email exist
    const duplicate = await prisma.admin.findUnique({
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
        first_name: first_name,
        last_name: last_name,
        email: email,
        password_hash: hashedPassword,
        role: role,
        address: "123 Main St",
        position: "General Manager",
        status: "ACTIVE",
        phone: "+15556667766",
        location_id: "250387",
        hourly_rate: 50.0,
      },
    });

    return res.sendStatus(204);
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

    // Check if this is admin signIN
    let admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });
    const isAdmin = !!admin;
    const account =
      admin ?? (await prisma.user.findUnique({ where: { email } }));
    if (!account) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // Only user.password_hash is nullable (requires activation)
    if (!account.password_hash) {
      return res.status(401).json({
        message:
          "Account is not activated. Please activate your account using the link in email",
      });
    }

    // Check password
    const passwordCorrect = await bcrypt.compare(
      password,
      account.password_hash
    );
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // Create accessToken with JWT
    const accessToken = jwt.sign(
      { userId: account.id, userRole: account.role },
      secret,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      }
    );

    // Create and save refreshToken with JST
    const refreshToken = crypto.randomBytes(64).toString("hex");
    await prisma.session.create({
      data: {
        owner_type: isAdmin ? "ADMIN" : account.role, // ADMIN | MANAGER | EMPLOYEE
        admin_id: isAdmin ? account.id : null,
        user_id: isAdmin ? null : account.id,
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
      message: `User ${account.first_name} ${account.last_name} logged in!`,
      accessToken,
    });
  } catch (error) {
    console.log("Sign in error", error);
    return res.status(500).json({ message: error });
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

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token found" });
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    // Find session
    const session = await prisma.session.findUnique({
      where: { refresh_token: refreshToken },
    });

    if (!session) {
      return res.status(403).json({ message: "No session found" });
    }

    if (session.expires_at < new Date()) {
      return res.status(403).json({ message: "Refresh token is expired" });
    }

    const id =
      session.owner_type === "ADMIN" ? session.admin_id : session.user_id;
    // Create accessToken with JWT
    const accessToken = jwt.sign(
      { userId: id, userRole: session.owner_type },
      secret,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function validateInvitaion(req: Request, res: Response) {
  try {
    const token = req.query.token as string;
    if (!token) {
      return res.status(400).json({ message: "Invalid invitation" });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const invitation = await prisma.invitation.findFirst({
      where: {
        token_hash: tokenHash,
        accepted_at: null,
        revoked_at: null,
        expires_at: { gt: new Date() },
      },
    });
    if (!invitation) {
      return res.status(200).json({
        valid: false,
        message:
          "Invalid, expired, used or revoked invitation. Please contact your manager for a new invitation",
      });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function activateEmployee(req: Request, res: Response) {
  const result = activateSchema.safeParse(req.body);
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res
      .status(400)
      .json({ message: z.treeifyError(result.error).properties });
  }
  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(result.data.token)
      .digest("hex");
    const passwordHash = await bcrypt.hash(result.data.password, 10);
    await prisma.$transaction(async (tx) => {
      // Atomic UPDATE...SET
      const query = await consumeInvitation(tx, tokenHash);

      if (query.length === 0) {
        throw {
          status: 400,
          message: "Invalid, expired, revoked or used invitation",
        };
      }

      await tx.user.update({
        where: {
          id: query[0]?.user_id,
          status: "IN_ACTIVE",
        },
        data: {
          password_hash: passwordHash,
          status: "ACTIVE",
        },
      });
    });

    return res
      .status(200)
      .json({ message: "Password created successfully. Please log in" });
  } catch (error: any) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
