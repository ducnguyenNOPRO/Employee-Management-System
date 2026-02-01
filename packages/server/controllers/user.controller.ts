import type { Request, Response } from "express";

export function authMe(req: Request, res: Response) {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error calling auth me", error);
    return res.status(500).json({ message: "System error" });
  }
}
