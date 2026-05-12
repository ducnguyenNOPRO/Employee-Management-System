import type { Request, Response } from "express";
import { addDays, startOfDay } from "date-fns";
import { prisma } from "../lib/prisma";

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
