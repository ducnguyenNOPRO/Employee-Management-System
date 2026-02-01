import bcryp from "bcrypt";
import { userSchema } from "../models/zodSchema";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function signUp(req: Request, res: Response) {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: `Error validation ${result.error.format()}` });
  }

  try {
    // Check if username exist
  } catch (error) {}
}
