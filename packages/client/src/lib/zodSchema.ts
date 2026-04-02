import { z } from "zod";

/*** Authentication Schemas  ***/
// Register
export const registerSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(10, "Password legnth must be at least 10 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    password_confirm: z.string().trim(),
    role: z.enum(["admin", "employee"]),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"], // This sets which field gets the error
  });

export type RegisterPayload = z.infer<typeof registerSchema>;

// Log In
export const signInSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().trim().min(1, "Password is required"),
});
export type SignInPayload = z.infer<typeof signInSchema>;

/*** Authentication Schemas  ***/

/*** Employees Schemas  ***/
// Employee Schemas
export const employeeSchema = z.object({
  email: z.email(),
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  phone: z
    .string()
    .trim()
    .regex(/^\+1\d{10}$/),
  address: z
    .string()
    .trim()
    .min(1, "Must has a length between 1 and 255 characters")
    .max(255, "Must has a length between 1 and 255 characters"),
  position: z.string().trim().min(1, "Position is required"),
  employment_type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
  role: z.enum(["EMPLOYEE", "MANAGER"]),
  salary: z.coerce.number().min(0, "Must be a positive value > 0"),
  start_date: z.iso.date(),
  department_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.cuid("Invalid ID format").nullable()
  ),
  emergency_contact: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.string().trim().max(255, "Maximum 255 characters").nullable()
  ),
  emergency_phone: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.string().trim().max(255, "Maximum 255 characters").nullable()
  ),
});

export type AddEmployeePayload = z.infer<typeof employeeSchema>;

/*** Employees Schemas  ***/

/*** Department Schemas ***/

// Base schema with all fields
export const departmentSchema = z.object({
  manager_id: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.cuid("Invalid ID format").nullable()
  ),
  name: z
    .string()
    .trim()
    .min(1, "Name must has a length between 1 and 50 characters")
    .max(50, "Must has a length between 1 and 50 characters"),
  location: z
    .string()
    .trim()
    .min(1, "Must has a length between 1 and 100 characters")
    .max(100, "Must has a length between 1 and 100 characters"),
  budget: z.coerce.number().min(0, "Must be a positive value > 0"), // or z.string() if you're handling Decimal as string
  budget_utilization: z.coerce
    .number()
    .int("Must be a positive integer")
    .min(0, "Must be a number between 0 and 100")
    .max(100, "Must be a number between 0 and 100"),
  open_position: z.coerce
    .number()
    .int("Must be a positive integer")
    .min(0, "Must have a value > 0")
    .max(20, "Maximum value is 20 "),
  employee_count: z.coerce
    .number()
    .int("Must be a positive integer")
    .min(0, "Must have a value > 0")
    .max(50, "Maximum value is 50"),
  description: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.string().trim().max(255, "Maximum 255 characters").nullable()
  ),
  established: z.iso.date().nullable(), // Non-editable
});

// PATCH Department
export const editDepartmentSchema = departmentSchema.partial();
export const addDepartmentSchema = departmentSchema
  .omit({
    established: true,
  })
  .partial()
  .extend({
    location: z
      .string()
      .trim()
      .min(1, "Must has a length between 1 and 100 characters")
      .max(100, "Must has a length between 1 and 100 characters"),
    name: z
      .string()
      .trim()
      .min(1, "Name must has a length between 1 and 50 characters")
      .max(50, "Must has a length between 1 and 50 characters"),
  });
export type EditDepartmentPayload = z.infer<typeof editDepartmentSchema>;
export type AddDepartmentPayload = z.infer<typeof addDepartmentSchema>;

// Leave Request
export const leaveRequestSchema = z.object({
  requester_id: z.cuid("Employee is required"),
  type: z.enum(["VACATION", "SICK_LEAVE"]),
  start_date: z.iso.date(),
  end_date: z.iso.date(),
  reason: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.string().trim().max(255, "Maximum 255 characters").nullable()
  ),
  hours: z.coerce
    .number()
    .min(0.5, "Minimum of 0.5 hour requestable")
    .max(160, "Maximum of 160 hour requestable"),
});

export type AddLeaveRequestPayload = z.infer<typeof leaveRequestSchema>;
