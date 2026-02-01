import z from "zod";
// User (both admind and employee)
export const userSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email(),
  password: z.string().trim(),
  role: z.enum(["admin", "employee"]),
  departmentId: z.coerce.number("Department ID must be a number").optional(),
  phone: z.string().trim().min(1).max(20).optional(), // maybe required in future if no employee table
  salary: z.coerce.number("Salaray must be a number").optional(), // for admin
});

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email(),
  password: z.string().trim(),
  role: z.enum(["admin", "employee"]),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().trim(),
});

// Session
export const sessionSchema = z.object({
  userId: z.number(),
  refreshToken: z.string().trim(),
  expiresAt: z.date(),
});
