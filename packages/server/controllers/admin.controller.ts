import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  addDepartmentSchema,
  editDepartmentSchema,
  getDepartmentSchema,
  getEmployeeSchema,
  leaveSchema,
} from "../lib/zodSchema";
import z from "zod";
import {
  removeManager,
  transferManagerFromAnotherDepartment,
  transferManagerAndAssign,
  updateDepartment,
} from "../lib/helper";
import type { leave_balance } from "../generated/prisma/client";

export async function getEmployees(req: Request, res: Response) {
  const { role } = req.query;
  try {
    if (role == "MANAGER") {
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
  const result = getEmployeeSchema.safeParse(req.params.id);
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    res.status(400).json({ message: "Missing or Invalid ID format" });
  }
  try {
    const employee = await prisma.user.findUnique({
      where: {
        id: result.data?.id,
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
        .json({ message: `Employee with id: ${result.data?.id} not found` });
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
  const result = getDepartmentSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    res.status(400).json({ message: "Missing or Invalid ID format" });
  }

  try {
    const department = await prisma.department.findUnique({
      omit: {
        updated_at: true,
      },
      where: {
        id: result.data?.id,
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
      res
        .status(404)
        .json({ message: `Department with ${result.data?.id} not found` });
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

export async function createDepartment(req: Request, res: Response) {
  const result = addDepartmentSchema.safeParse(req.body);
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    const manager_id = result.data.manager_id;
    // Perform transfering manager if a manager is choosen during department creation
    if (manager_id !== null) {
      await prisma.$transaction(async (tx) => {
        const existingManagerDept = await tx.department.findUnique({
          where: {
            manager_id,
          },
        });
        // Remove manager from this if this manager is managing another department
        if (existingManagerDept) {
          await tx.department.update({
            where: { id: existingManagerDept.id },
            data: { manager_id: null },
          });
        }

        const newDepartment = await tx.department.create({
          data: result.data,
        });

        // Update manager dept id
        await tx.user.update({
          where: { id: manager_id },
          data: { department_id: newDepartment.id },
        });
      });
    } else {
      await prisma.department.create({
        data: result.data,
      });
    }
    return res.status(201).json({ message: "Department created successfully" });
  } catch (error: any) {
    console.log(error);
    // Unique Constraint on name or manager_id but manager_id will be transfered so no need to check
    if (error.code === "P2002") {
      res.status(400).json({ message: "Department name is already existed" });
    }
    if (error.code === "P2003") {
      res.status(400).json({
        message: `Manager with id ${result.data.manager_id} not found`,
      });
    }
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function partialUpdateDepartment(req: Request, res: Response) {
  const idCheck = getDepartmentSchema.safeParse({ id: req.params.id });
  if (!idCheck.success) {
    return res.status(400).json({
      message: `Missing or Invalid ID format`,
    });
  }
  const result = editDepartmentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  const id = idCheck.data.id;
  try {
    const manager_id = result.data.manager_id;
    // Handle updating department if manager changes
    if (manager_id !== undefined) {
      // Case 1: Removing manager (got set to null in FE)
      if (manager_id === null) {
        await removeManager(id, result.data);
        console.log("Case 1");
      }
      // Case 2: Assigning a new manager
      else {
        // Find and check if the new manager is existing and managing a department
        const newManager = await prisma.user.findUnique({
          where: { id: manager_id },
          include: {
            managed_department: true,
          },
        });

        if (!newManager) {
          return res.status(400).json({
            message: `Manager with id ${manager_id} not found`,
          });
        }

        // Get current department info
        const currentDepartment = await prisma.department.findUnique({
          where: { id },
          select: { manager_id: true },
        });

        if (!currentDepartment) {
          return res.status(404).json({
            message: `Department with id ${id} not found`,
          });
        }

        // Case 2.1: Manager is already managing a different department
        if (
          newManager.managed_department &&
          newManager.managed_department.id !== id
        ) {
          // Perform transfer
          await transferManagerFromAnotherDepartment(
            newManager.id,
            result.data,
            id
          );
          console.log("Case 2.1");
        }
        // Case 2.2: New manager is not managing any department and not belong to this department
        else if (newManager.department_id !== id) {
          await transferManagerAndAssign(newManager.id, result.data, id);
          console.log("Case 2.2");
        }
        // Case 2.3: New manager is not managing any department but belong to this department
        else if (newManager.department_id === id) {
          await updateDepartment(result.data, id);
          console.log("Case 2.3");
        }
      }
    }
    // Case 3: No manager_id change, just regular department update
    else {
      await updateDepartment(result.data, id);
      console.log("Case 3");
    }

    return res.status(200).json({ message: "Department Updated successfully" });
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

export async function getRequestStats(req: Request, res: Response) {
  try {
    const rawStats = await prisma.leave_request.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });

    const totalRequests = rawStats.reduce((sum, item) => {
      return sum + item._count._all;
    }, 0);
    const stats = {
      total: totalRequests,
      byStatus: rawStats.reduce(
        (acc, item) => {
          // ex: { PENDING: 12, APPROVED: 34, REJECTED: 5, CANCELLED: 2 }
          acc[item.status] = item._count._all;
          return acc;
        },
        {} as Record<string, number>
      ),
    };

    return res.status(200).json({ stats });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRequests(req: Request, res: Response) {
  try {
    const requests = await prisma.leave_request.findMany({
      orderBy: [
        { status_priority: "asc" },
        { start_date: "asc" },
        { created_at: "desc" },
      ],
      select: {
        id: true,
        type: true,
        hours: true,
        start_date: true,
        end_date: true,
        reason: true,
        status: true,
        requester: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        approver: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return res.status(200).json({ requests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createRequest(req: Request, res: Response) {
  const result = leaveSchema.safeParse(req.body);
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    await prisma.$transaction(async (tx) => {
      // Lock the row
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
          message: `Balances record for user ${result.data.requester_id} not found`,
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
          start_date: new Date(result.data.start_date),
          end_date: new Date(result.data.end_date),
        },
      });

      await tx.leave_balance.update({
        where: {
          user_id_type: {
            // compound unique key
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
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updateRequest(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

// export function deleteEmployee(req: Request, res: Response) {};
