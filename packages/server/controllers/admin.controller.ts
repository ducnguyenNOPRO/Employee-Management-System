import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { editDepartmentSchema } from "../lib/zodSchema";
import z from "zod";

export async function getEmployees(req: Request, res: Response) {
  const { role } = req.query;
  try {
    if (role == "manager") {
      const managers = await prisma.user.findMany({
        orderBy: {
          start_date: "desc",
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          department: {
            select: {
              manager_id: true,
              name: true,
              id: true,
            },
          },
        },
        where: {
          role,
        },
      });

      return res.status(200).json({ managers });
    }
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
        manager: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    const departmentsFormatted = departments.map((d) => ({
      ...d,
      budget: Number(d.budget),
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
        manager: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!department) {
      res.status(404).json({ message: `Department with ${id} not found` });
    }

    const departmentFormatted = {
      ...department,
      budget: Number(department?.budget),
    };

    return res.status(200).json({ department: departmentFormatted });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function partialUpdateDepartment(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  console.log(id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Department Id is missing" });
  }
  const result = editDepartmentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    const department = await prisma.department.update({
      where: {
        id,
      },
      data: result.data,
    });

    const departmentFormatted = {
      ...department,
      budget: Number(department.budget),
    };
    return res.status(200).json({ department: departmentFormatted });
  } catch (error: any) {
    console.log(error);
    // 4. Handle Prisma "not found" error
    if (error.code === "P2025") {
      return res.status(404).json({
        message: `Department with id ${id} not found`,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// export function deleteEmployee(req: Request, res: Response) {};
