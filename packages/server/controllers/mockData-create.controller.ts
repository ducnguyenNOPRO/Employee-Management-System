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
      data: req.body.data,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createLocations(req: Request, res: Response) {
  try {
    await prisma.location.createMany({
      data: req.body.data,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createShifts(req: Request, res: Response) {
  try {
    await prisma.shift.createMany({
      data: req.body.data,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createTimeEntries(req: Request, res: Response) {
  try {
    const { data } = req.body;
    await prisma.time_entry.createMany({
      data,
    });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}
