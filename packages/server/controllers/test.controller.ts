import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// ─── Leave ────────────────────────────────────────────────────────────────────
export async function deleteRequest(req: Request, res: Response) {
  let reason = req.query.reason as string | null;
  reason = reason === "null" ? null : reason;
  const requester_id = req.query.requester_id as string;
  try {
    const leaveRequest = await prisma.leave_request.findFirst({
      where: { reason, requester_id },
    });

    if (!leaveRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    await prisma.$transaction([
      prisma.leave_request.deleteMany({
        where: { reason, requester_id },
      }),
      prisma.leave_balance.update({
        where: {
          user_id_type: {
            user_id: leaveRequest.requester_id,
            type: leaveRequest.type,
          },
        },
        data: { used: { decrement: leaveRequest.hours } },
      }),
    ]);

    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function resetLeave(req: Request, res: Response) {
  try {
    await prisma.$transaction(async (tx) => {
      const re = await tx.leave_request.findUnique({
        where: { id: req.params.id as string },
      });

      if (!re) throw { status: 404, message: "Request not found" };

      // Rejection decrements used — re-increment it on reset
      if (re.status === "REJECTED") {
        await tx.leave_balance.update({
          where: {
            user_id_type: {
              user_id: re.requester_id,
              type: re.type,
            },
          },
          data: { used: { increment: re.hours } },
        });
      }

      await tx.leave_request.update({
        where: { id: req.params.id as string },
        data: {
          status: "PENDING",
          status_priority: 1,
          approver_id: null,
          reviewed_at: null,
        },
      });
    });

    return res.status(200).json({ message: "Reset successful" });
  } catch (error: any) {
    if (error?.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ─── Shift ────────────────────────────────────────────────────────────────────
export async function resetShift(req: Request, res: Response) {
  try {
    await prisma.shift.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    return res.status(200).json({ message: "Reset Successfull" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function seedShift(req: Request, res: Response) {
  try {
    await prisma.shift.create({
      data: req.body,
    });
    return res.status(200).json({ message: "Seed Successfull" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteShift(req: Request, res: Response) {
  const notes = req.query.notes as string;
  try {
    await prisma.shift.deleteMany({
      where: { notes },
    });
    return res.status(200).json({ message: "Deleted shift succesfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// ─── Time Entry ───────────────────────────────────────────────────────────────

// Delete a time entry by shift_id — used to clean up after clock in tests
export async function deleteTimeEntry(req: Request, res: Response) {
  const shift_id = req.query.shift_id as string;
  try {
    await prisma.time_entry.deleteMany({
      where: { shift_id },
    });
    return res.status(200).json({ message: "Time entry deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Reset a time entry back to seeded state by shift_id
// Body: { clock_in, clock_out, type }
export async function resetTimeEntry(req: Request, res: Response) {
  const shift_id = req.query.shift_id as string;
  try {
    await prisma.time_entry.updateMany({
      where: { shift_id },
      data: req.body,
    });
    return res.status(200).json({ message: "Time entry reset" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
