import { prisma } from "../lib/prisma";

/**
 * Case 2.1: Transfer a manager (already managing another dept) from their current department to a new department
 * - Remove them as manager from old department
 * - Transfer them to new department
 * - Update department and assign this new manager
 */
export async function transferManagerFromAnotherDepartment(
  newManagerId: number,
  departmentData: any,
  newDepartmentId: number
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
  newManagerId: number,
  departmentData: any,
  departmentId: number
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
  newDepartmentId: number
) {
  await prisma.department.update({
    where: { id: newDepartmentId },
    data: departmentData,
  });
}

// Update department and removing the manager from that department
export async function removeManager(departmentId: number, departmentData: any) {
  await prisma.department.update({
    where: { id: departmentId },
    data: { ...departmentData, manager_id: null },
  });
}
