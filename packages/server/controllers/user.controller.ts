import type { Request, Response } from "express";

export function authMe(req: Request, res: Response) {
  try {
    const {
      id,
      first_name,
      last_name,
      role,
      phone,
      salary,
      department_id,
      email,
    } = req.user!;
    return res.status(200).json({
      user: {
        id,
        firstName: first_name,
        lastName: last_name,
        role,
        phone,
        salary,
        departmentId: department_id,
        email,
      },
    });
  } catch (error) {
    console.log("Error calling auth me", error);
    return res.status(500).json({ message: "System error" });
  }
}
