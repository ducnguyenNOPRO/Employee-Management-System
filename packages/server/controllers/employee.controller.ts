import type { Request, Response } from "express";
import { addDays, startOfDay } from "date-fns";
import { prisma } from "../lib/prisma";
import { editableProfileSchema, leaveSchema } from "../lib/zodSchema";
import z from "zod";
import type { leave_balance } from "../generated/prisma/client";

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

export async function getLeaveBalances(req: Request, res: Response) {
  try {
    const balances = await prisma.leave_balance.findMany({
      where: { user_id: req.user!.id },
      select: {
        type: true,
        total: true,
        used: true,
      },
    });

    const formatted = balances.map((balance) => ({
      type: balance.type,
      remaining: parseFloat((balance.total - balance.used).toFixed(2)),
    }));

    return res.status(200).json({ balances: formatted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createLeaveRequest(req: Request, res: Response) {
  const result = leaveSchema.safeParse({
    ...req.body,
    requester_id: req.user!.id, // Lock to the authenticated user
  });
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    const location_id = req.location_id as string;
    await prisma.$transaction(async (tx) => {
      // Lock the row to prevent race conditions
      const balances = await tx.$queryRaw<leave_balance[]>`
        SELECT *
        FROM "leave_balance"
        WHERE "user_id" = ${result.data.requester_id} AND "type" = ${result.data.type}
        LIMIT 1
        FOR UPDATE
      `;

      if (!balances.length) {
        throw {
          status: 404,
          message: `Leave balance record not found`,
        };
      }

      const balance = balances[0];
      const total = balance?.total ?? 0;
      const used = balance?.used ?? 0;

      if (total - used < result.data.hours) {
        throw {
          status: 422,
          message: "Requested leave exceeds available balance",
        };
      }

      await tx.leave_request.create({
        data: {
          ...result.data,
          location_id,
        },
      });

      await tx.leave_balance.update({
        where: {
          user_id_type: {
            user_id: result.data.requester_id,
            type: result.data.type,
          },
        },
        data: { used: { increment: result.data.hours } },
      });
    });

    return res.status(201).json({ message: "Request created successfully" });
  } catch (error: any) {
    if (error?.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLeaves(req: Request, res: Response) {
  try {
    const leaves = await prisma.leave_request.findMany({
      where: { requester_id: req.user!.id },
      select: {
        id: true,
        type: true,
        status: true,
        start_date: true,
        end_date: true,
        hours: true,
      },
    });

    return res.status(200).json({ leaves });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
