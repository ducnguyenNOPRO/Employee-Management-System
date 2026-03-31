import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function createMockEmployees(req: Request, res: Response) {
  try {
    const { data } = req.body;
    await prisma.user.createMany({
      data,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createMockDepartments(req: Request, res: Response) {
  try {
    const { data } = req.body;
    await prisma.department.createMany({
      data,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createMockRequests(req: Request, res: Response) {
  try {
    await prisma.leave_request.createMany({
      data: [
        {
          requester_id: "cmljy66xo0003tk7kynpf7bcn",
          approver_id: "cmljz7zho0000207kz1zurouy",
          type: "VACATION",
          start_date: new Date("2026-02-13T05:04:52.270Z"),
          end_date: new Date("2026-02-20T05:04:52.270Z"),
          hours: 56,
          reason: "Annual family vacation",
          status: "APPROVED",
          status_priority: 2,
          reviewed_at: new Date("2026-02-10T05:04:52.270Z"),
        },
        {
          requester_id: "cmljy66xp0005tk7kmo5k39np",
          type: "SICK_LEAVE",
          start_date: new Date("2026-02-14T05:04:52.270Z"),
          end_date: new Date("2026-02-15T05:04:52.270Z"),
          hours: 16,
          reason: "Feeling unwell, doctor's appointment",
          status: "PENDING",
          status_priority: 1,
        },
        {
          requester_id: "cmljy66xp0006tk7kb3r0mysc",
          approver_id: "cmljz7zho0000207kz1zurouy",
          type: "UNPAID",
          start_date: new Date("2026-02-17T05:04:52.270Z"),
          end_date: new Date("2026-02-19T05:04:52.270Z"),
          hours: 24,
          reason: "Personal matters",
          status: "APPROVED",
          status_priority: 2,
          reviewed_at: new Date("2026-02-12T05:04:52.270Z"),
        },
        {
          requester_id: "cmljy66xp0008tk7knmhkwg1h",
          approver_id: "cmljz7zho0000207kz1zurouy",
          type: "OTHER",
          start_date: new Date("2026-02-18T05:04:52.270Z"),
          end_date: new Date("2026-02-18T05:04:52.270Z"),
          hours: 8,
          reason: "Community service event",
          status: "REJECTED",
          status_priority: 3,
          reviewed_at: new Date("2026-02-11T05:04:52.270Z"),
        },
        {
          requester_id: "cmljy66xo0004tk7k91fqiyig",
          type: "VACATION",
          start_date: new Date("2026-02-24T05:04:52.270Z"),
          end_date: new Date("2026-02-27T05:04:52.270Z"),
          hours: 32,
          reason: "Short trip",
          status: "PENDING",
          status_priority: 1,
        },
      ],
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}
