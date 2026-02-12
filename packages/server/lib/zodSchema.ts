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

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(10, "Password legnth must be at least 10 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    passwordConfirm: z.string().trim(),
    role: z.enum(["admin", "employee"]),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"], // This sets which field gets the error
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

// DEPARTMENT SCHEMAS
const departmentSchema = z.object({
  manager_id: z
    .number()
    .int()
    .positive("Must be a positive integer")
    .nullable(),
  name: z
    .string()
    .trim()
    .min(1, "Must has a length between 1 and 50 characters")
    .max(50, "Must has a length between 1 and 50 characters"),
  location: z
    .string()
    .trim()
    .min(1, "Must has a length between 1 and 100 characters")
    .max(100, "Must has a length between 1 and 100 characters"),
  budget: z.number().min(0, "Must be a positive value > 0"), // or z.string() if you're handling Decimal as string
  budget_utilization: z // percentage
    .number()
    .int("Must be a positive integer")
    .min(0, "Must be a number between 0 and 100")
    .max(100, "Must be a number between 0 and 100"),
  open_position: z.coerce
    .number()
    .int("Must be a positive integer")
    .min(0, "Must have a value > 0")
    .max(20, "Maximum value is 20 "),
  employee_count: z
    .number()
    .int("Must be a positive integer")
    .min(0, "Must have a value > 0")
    .max(50, "Maximum value is 50"),
  description: z.string().trim().max(255, "Maximum 255 characters").nullable(),
  established: z.iso.date().nullable(), // Non-editable
});

export const editDepartmentSchema = departmentSchema
  .omit({
    established: true,
  })
  .partial();
export const addDepartmentSchema = departmentSchema.omit({
  established: true,
});
