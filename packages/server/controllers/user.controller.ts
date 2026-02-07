import type { Request, Response } from "express";

export function authMe(req: Request, res: Response) {
  try {
    return res.status(200).json({
      user: req.user!,
    });
  } catch (error) {
    console.log("Error calling admin auth me", error);
    return res.status(500).json({ message: "System error" });
  }
}
