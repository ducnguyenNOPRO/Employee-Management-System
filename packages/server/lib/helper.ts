import { prisma } from "../lib/prisma";

/**
 * Case 2.1: Transfer a manager (already managing another dept) from their current department to a new department
 * - Remove them as manager from old department
 * - Transfer them to new department
 * - Update department and assign this new manager
 */
export async function transferManagerFromAnotherDepartment(
  newManagerId: string,
  departmentData: any,
  newDepartmentId: string
) {
  await prisma.$transaction(async (tx) => {
    // 1. Find the old department this manager is currently managing
    const oldDepartment = await tx.department.findUnique({
      where: { manager_id: newManagerId },
    });

    // 2. Remove manager from their old department
    if (oldDepartment) {
      await tx.department.update({
        where: { id: oldDepartment.id },
        data: { manager_id: null },
      });
    }

    // 3. Transfer the manager to the new department
    await tx.user.update({
      where: { id: newManagerId },
      data: { department_id: newDepartmentId },
    });

    // 4. Update the new department with new manager_id and other data
    await tx.department.update({
      where: { id: newDepartmentId },
      data: departmentData,
    });
  });
}
/**
 * Case 2.2: Transfer a manager (not managing any dept) from their current department to a new department
 * - Transfer manager to this department
 * - Update department data and Assign as manager
 */
export async function transferManagerAndAssign(
  newManagerId: string,
  departmentData: any,
  departmentId: string
) {
  await prisma.$transaction(async (tx) => {
    // 1. Transfer to this department
    await tx.user.update({
      where: { id: newManagerId },
      data: { department_id: departmentId },
    });
    // 2. Update the department with new manager and other data
    const updatedDepartment = await tx.department.update({
      where: { id: departmentId },
      data: departmentData,
    });
  });
}

/**
 * Case 2.3: Update department and assign a manager (optional)
 * - Manager already belong to this deaprtment but not managing it
 * - Only 1 manager can manage per department
 */
export async function updateDepartment(
  departmentData: any,
  newDepartmentId: string
) {
  await prisma.department.update({
    where: { id: newDepartmentId },
    data: departmentData,
  });
}

// Update department and removing the manager from that department
export async function removeManager(departmentId: string, departmentData: any) {
  await prisma.department.update({
    where: { id: departmentId },
    data: { ...departmentData, manager_id: null },
  });
}

export function getInvitationStatus(
  user: any,
  invitation: {
    expires_at: Date;
  } | null
) {
  if (user.status === "ACTIVE" || user.status === "ON_LEAVE") return "ACCEPTED"; // use 'status' for source of truth instead of accepted_at
  if (!invitation) return "NOT_SENT";
  if (new Date(invitation.expires_at) < new Date()) return "EXPIRED";

  return "PENDING";
}

export async function consumeInvitation(
  tx: any,
  tokenHash: string
): Promise<{ user_id: string }[]> {
  const date = new Date();
  return await tx.$queryRaw<{ user_id: string }[]>`
    UPDATE "invitation"
    SET   "accepted_at" = ${date}
    WHERE "token_hash"  = ${tokenHash}
      AND "accepted_at" IS null
      AND "revoked_at"  IS null
      AND "expires_at"  > ${date}
    RETURNING "user_id"
  `;
}

type Status =
  | "ACTIVE"
  | "LATE"
  | "ABSENT"
  | "UPCOMING"
  | "COMPLETED"
  | "INCOMPLETE";

export function getAttendanceStatus(
  shift: { start_time: Date; end_time: Date },
  entry: { clock_in: Date | null; clock_out: Date | null } | null,
  now: Date
): Status {
  const shiftStarted = shift.start_time <= now;
  const shiftEnded = shift.end_time <= now;

  // Shift not started
  if (!shiftStarted) return "UPCOMING";

  // No entry at all
  if (!entry) {
    if (shiftEnded) return "ABSENT"; // never showed up
    return "INCOMPLETE"; // no clocked in yet
  }

  // Has entry but no clock_in (edge cases - absent/manager manual update / bad data)
  if (!entry.clock_in) {
    return shiftEnded ? "ABSENT" : "INCOMPLETE";
  }

  const isLate = entry.clock_in > shift.start_time;

  // Still working (no clock_out yet)
  if (!entry.clock_out) {
    return isLate ? "LATE" : "ACTIVE";
  }

  // Shift done
  if (shiftEnded) {
    return "COMPLETED";
  }

  // Clocked out early (before shift end)
  return "INCOMPLETE";
}

export function getLateBy(
  shift: { start_time: Date },
  entry: { clock_in: Date | null } | null,
  now: Date
): string | null {
  // Clocked in late
  if (entry && entry.clock_in && entry.clock_in > shift.start_time) {
    const diff = entry.clock_in.getTime() - shift.start_time.getTime();
    return formatDuration(diff);
  }

  // Shift started but no clock in
  if (!entry && shift.start_time <= now) {
    const diff = now.getTime() - shift.start_time.getTime();
    return formatDuration(diff);
  }

  return null;
}

function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `Late by ${hours}h ${minutes}m`;
  return `Late by ${minutes}m`;
}
