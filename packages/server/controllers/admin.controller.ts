import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getEmployees(req: Request, res: Response) {
  try {
    const employees = await prisma.user.findMany({
      orderBy: {
        start_date: "asc",
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        position: true,
        employment_type: true,
        status: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ employees });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getEmployee(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    if (!id) {
      return res.status(400).json({ message: "Employee Id is missing" });
    }

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const employee = await prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password_hash: true,
        updated_at: true,
        department_id: true,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!employee) {
      return res
        .status(404)
        .json({ message: `Employee with id: ${id} not found` });
    }

    return res.status(200).json({ employee });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export function addEmployee(req: Request, res: Response) {
  try {
  } catch (error) {}
}

export function updateEmployee(req: Request, res: Response) {
  try {
  } catch (error) {}
}

export function partialUpdateEmployee(req: Request, res: Response) {
  try {
  } catch (error) {}
}

// Department Management

export async function getDepartments(req: Request, res: Response) {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        budget: "desc",
      },
      select: {
        id: true,
        name: true,
        budget: true,
        employee_count: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
          where: {
            role: "manager",
          },
          take: 1,
        },
      },
    });
    // Map to get single object instead of array:
    const departmentsFormatted = departments.map((dept) => ({
      ...dept,
      user: dept.user[0] || undefined, // Extract first manager or undefined
    }));

    return res.status(200).json({ departments: departmentsFormatted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getDepartment(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id as string);
    if (!id) {
      return res.status(400).json({ message: "Department Id is missing" });
    }

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const department = await prisma.department.findUnique({
      omit: {
        updated_at: true,
      },
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
          where: {
            role: "manager",
          },
        },
      },
    });

    if (!department) {
      res.status(404).json({ message: `Department witjh ${id} not found` });
    }

    const departmentsFormatted = {
      ...department,
      budget: Number(department!.budget),
      user: department!.user[0] || undefined,
    };
    return res.status(200).json({ department: departmentsFormatted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// export function deleteEmployee(req: Request, res: Response) {};
