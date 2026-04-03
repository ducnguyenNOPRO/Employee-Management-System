import z from "zod";

export const signUpSchema = z
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

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().trim(),
});

// Session
export const sessionSchema = z.object({
  user_id: z.cuid("Invalid "),
  refresh_token: z.string().trim(),
  expires_at: z.date(),
});

// Generic schema
export const idSchmena = z.object({
  id: z.cuid("Invalid ID format"),
});

// EMPLOYEE SCHEMAS
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
  salary: z.number().min(0),
  start_date: z.iso.date().transform((val) => new Date(val)),
  department_id: z.cuid().nullable(),
  emergency_contact: z.string().trim().nullable(),
  emergency_phone: z.string().trim().nullable(),
});

export const editEmployeeSchema = employeeSchema.partial().strict();

// DEPARTMENT SCHEMAS
const departmentSchema = z.object({
  id: z.cuid("Invalid ID format"),
  manager_id: z.cuid("Invalid ID format").nullable(),
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
    id: true,
  })
  .partial();
export const addDepartmentSchema = departmentSchema.omit({
  established: true,
  id: true,
});

// LEAVE REQUEST SCHEMAS
export const leaveSchema = z.object({
  requester_id: z.cuid("Invalid ID format"),
  type: z.enum(["VACATION", "SICK_LEAVE"]),
  hours: z
    .number()
    .min(0, "Must be a positive value > 0")
    .max(160, "Max 4 weeks or 160 hours"),
  start_date: z.iso.date().transform((val) => new Date(val)),
  end_date: z.iso.date(),
  reason: z.string().trim().max(40, "Maximum 40 characters").nullable(),
});

export const editLeaveSchema = z.object({
  approver_id: z.cuid("Invalid ID format"),
  status: z.enum(["APPROVED", "REJECTED"]),
});
