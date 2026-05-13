import type { Request, Response } from "express";
import { addDays, startOfDay } from "date-fns";
import { prisma } from "../lib/prisma";
import { editableProfileSchema } from "../lib/zodSchema";
import z from "zod";

export async function getShifts(req: Request, res: Response) {
  const userId = req.user!.id;

  const start = startOfDay(new Date());
  const end = addDays(start, 14);

  try {
    const shifts = await prisma.shift.findMany({
      where: {
        user_id: userId,
        start_time: { gte: start, lte: end },
      },
      select: {
        id: true,
        start_time: true,
        end_time: true,
        notes: true,
      },
      orderBy: { start_time: "asc" },
    });

    return res.status(200).json({ shifts });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function editProfile(req: Request, res: Response) {
  const result = editableProfileSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: z.treeifyError(result.error).properties });
  }
  try {
    await prisma.user.update({
      where: { id: req.user!.id },
      data: result.data,
    });
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email or phone already in use" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
