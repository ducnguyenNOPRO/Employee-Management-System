import type { Request, Response } from "express";
import { startOfDay, endOfDay } from "date-fns";
import { prisma } from "../lib/prisma";
import {
  addDepartmentSchema,
  editDepartmentSchema,
  editEmployeeSchema,
  editLeaveSchema,
  employeeSchema,
  idSchmena,
  leaveSchema,
} from "../lib/zodSchema";
import z from "zod";
import {
  removeManager,
  transferManagerFromAnotherDepartment,
  transferManagerAndAssign,
  updateDepartment,
  getInvitationStatus,
  getAttendanceStatus,
  getLateBy,
} from "../lib/helper";
import type { leave_balance } from "../generated/prisma/client";
import crypto from "crypto";
import { getFrontendBaseUrl } from "../lib/normalizeURL";
import { sendInviteEmail } from "./email.controller";

const STATUS_PRIORITY = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
};

export async function inviteEmployee(req: Request, res: Response) {
  const result = idSchmena.safeParse({ id: req.params.id });
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({ message: "Missing or Invalid ID format" });
  }

  try {
    const id = result.data.id;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res
        .status(404)
        .json({ messsage: `User with ID: ${id} not found` });
    }

    if (user.status !== "IN_ACTIVE") {
      return res
        .status(400)
        .json({ message: "User is already active. Refresh page for update" });
    }

    const invitation = await prisma.$transaction(async (tx) => {
      const THIRTY_SECONDS_AGO = new Date(Date.now() - 30 * 1000);
      // Simple rate limit check at DB level
      const recentInvite = await tx.invitation.findFirst({
        where: {
          user_id: id,
          created_at: { gte: THIRTY_SECONDS_AGO },
          revoked_at: null,
        },
      });

      if (recentInvite) {
        throw {
          status: 429,
          message:
            "Invitation is already sent recently. Please wait and try again later",
        };
      }

      // Revoke existing
      await tx.invitation.updateMany({
        where: {
          user_id: id,
          accepted_at: null,
          revoked_at: null,
          expires_at: { gt: new Date() },
        },
        data: { revoked_at: new Date() },
      });

      // Create new
      const rawToken = crypto.randomBytes(32).toString("base64url");
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      await tx.invitation.create({
        data: {
          user_id: id,
          token_hash: tokenHash,
          expires_at: new Date(Date.now() + 1000 * 60 * 60),
        },
      });

      return { rawToken };
    });

    const baseUrl = getFrontendBaseUrl();
    const inviteLink = `${baseUrl}/create-password?token=${invitation.rawToken}`;

    await sendInviteEmail({
      to: user.email,
      link: inviteLink,
    });

    return res.status(201).json({ message: "Invitations sent" });
  } catch (error: any) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

// With invitation status
export async function getEmployees(req: Request, res: Response) {
  try {
    const { role } = req.query;
    const where: any = {};

    if (role == "MANAGER") {
      where.role = role;
    }
    const employees = await prisma.user.findMany({
      where,
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
        phone: true,
        department: {
          select: {
            manager_id: true,
            id: true,
            name: true,
          },
        },
        invitation: {
          orderBy: { created_at: "desc" },
          take: 1, // recent one == active one
          select: {
            expires_at: true,
          },
        },
      },
    });

    const format = employees.map((e) => {
      const invitation = e.invitation[0] || null;

      return {
        ...e,
        invitation: {
          expires_at: invitation?.expires_at || null,
          invitation_status: getInvitationStatus(e, invitation || null),
        },
      };
    });

    return res.status(200).json({ employees: format });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getEmployee(req: Request, res: Response) {
  const result = idSchmena.safeParse({ id: req.params.id });
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({ message: "Missing or Invalid ID format" });
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
        invitation: {
          orderBy: { created_at: "desc" },
          take: 1,
          select: {
            expires_at: true,
          },
        },
      },
    });

    if (!employee) {
      return res
        .status(404)
        .json({ message: `Employee with id: ${result.data?.id} not found` });
    }

    const invitation = employee.invitation[0] || null;

    const format = {
      ...employee,
      invitation: {
        expires_at: invitation?.expires_at,
        invitation_status: getInvitationStatus(employee, invitation),
      },
    };

    return res.status(200).json({ employee: format });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getEmployeeBalance(req: Request, res: Response) {
  const result = idSchmena.safeParse({ id: req.params.id }); // schema expect a object
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({ message: "Missing or Invalid ID format" });
  }
  try {
    const balances = await prisma.leave_balance.findMany({
      where: { user_id: result.data?.id },
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
    console.log("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function addEmployee(req: Request, res: Response) {
  const result = employeeSchema.safeParse(req.body);
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    const location_id = req.user?.location_id || "250387";
    await prisma.user.create({
      data: {
        ...result.data,
        location_id,
      },
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    console.log(error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "Email or phone number is already existed" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function partialUpdateEmployee(req: Request, res: Response) {
  const idCheck = idSchmena.safeParse({ id: req.params.id });
  if (!idCheck.success) {
    return res.status(400).json({
      message: `Missing or Invalid ID format`,
    });
  }
  const result = editEmployeeSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    await prisma.user.update({
      where: { id: idCheck.data.id },
      data: result.data,
    });

    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
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
  const result = idSchmena.safeParse({ id: req.params.id });
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
  const idCheck = idSchmena.safeParse({ id: req.params.id });
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

// Using FOR UPDATE to lock row to prevent race condition
// Update 'used' column when creating a new request
export async function createRequest(req: Request, res: Response) {
  const result = leaveSchema.safeParse(req.body);
  if (!result.success) {
    console.log(z.treeifyError(result.error).properties);
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    const location_id = req.user?.location_id || "250387";
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
          location_id,
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

// Update status, status_priority, approver_id and reviewed_at columns
// 'used' column in leave_balance is already incremented when request created
// Only neeed to deduct from 'used' if REJECTED
export async function updateRequest(req: Request, res: Response) {
  const idCheck = idSchmena.safeParse({ id: req.params.id });
  if (!idCheck.success) {
    return res.status(400).json({
      message: `Missing or Invalid ID format`,
    });
  }
  const result = editLeaveSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: `Error validation ${z.treeifyError(result.error).properties}`,
    });
  }
  try {
    await prisma.$transaction(async (tx) => {
      const request = await tx.leave_request.findUnique({
        where: { id: idCheck.data.id },
      });

      if (!request) throw { status: 404, message: "Request not found" };
      if (request.status !== "PENDING")
        throw { status: 409, message: "Request is no longer pending" };

      // Deduct hours from used if REJECTED
      if (result.data.status === "REJECTED") {
        await tx.leave_balance.update({
          where: {
            user_id_type: {
              user_id: request.requester_id,
              type: request.type,
            },
          },
          data: {
            used: { decrement: request.hours },
          },
        });
      }

      await tx.leave_request.update({
        where: { id: request.id },
        data: {
          status: result.data.status,
          status_priority: STATUS_PRIORITY[result.data.status],
          approver_id: result.data.approver_id,
          reviewed_at: new Date(),
        },
      });
    });

    return res.status(200).json({ message: "Decision updated successfully" });
  } catch (error: any) {
    console.log(error);
    if (error?.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAttendanceStats(req: Request, res: Response) {
  const location_id = req.user?.location_id || "250387";
  try {
    const now = new Date();
    const [working, late, absent, onLeave] = await prisma.$transaction([
      // Working - clock_in in the past and clock_out is null
      prisma.time_entry.count({
        where: {
          clock_out: null,
          clock_in: { lte: now },
          shift: {
            location_id,
          },
        },
      }),

      // Late - Shift started but no time_entry recorded for that shift
      prisma.shift.count({
        where: {
          location_id,
          start_time: { lte: now },
          end_time: { gte: now },
          time_entries: { none: {} },
        },
      }),

      // Absent -  Shift ended but no clock_in (no time_entry recorded)
      prisma.shift.count({
        where: {
          location_id,
          end_time: { lte: now },
          time_entries: { none: {} },
        },
      }),

      // On leave
      prisma.leave_request.count({
        where: {
          location_id,
          status: "APPROVED",
          start_date: { lte: now },
          end_date: { gte: now },
        },
      }),
    ]);
    return res.status(200).json({ working, late, absent, onLeave });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAttendanceLive(req: Request, res: Response) {
  const location_id = req.user?.location_id || "250387";
  const now = new Date();

  try {
    const shifts = await prisma.shift.findMany({
      where: {
        location_id,
        start_time: { lte: endOfDay(now) }, // include shift winthin next 24 hours
        end_time: { gte: startOfDay(now) }, // exlude too old shifts
      },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        time_entries: {
          orderBy: { clock_in: "desc" },
          take: 1, // only latest entry
          select: {
            clock_in: true,
            clock_out: true,
          },
        },
      },
    });

    const rows = shifts.map((shift) => {
      const entry = shift.time_entries[0] ?? null;

      const status = getAttendanceStatus(shift, entry, now);
      const lateBy = getLateBy(shift, entry, now);

      return {
        employee: {
          id: shift.user_id,
          name: `${shift.user.first_name} ${shift.user.last_name}`,
        },
        shift: {
          start_time: shift.start_time,
          end_time: shift.end_time,
        },
        clock_in: entry?.clock_in ?? null,
        clock_out: entry?.clock_out ?? null,
        late_by: lateBy,
        status,
      };
    });
    return res.status(200).json({ rows });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// export function deleteEmployee(req: Request, res: Response) {};
