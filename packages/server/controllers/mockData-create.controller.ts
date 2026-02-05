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
