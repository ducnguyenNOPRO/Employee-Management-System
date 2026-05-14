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

export const createPasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(10, "Password legnth must be at least 10 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
export type CreatePassword = z.infer<typeof createPasswordSchema>;
export type ActivatePayload = CreatePassword & { token: string };

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
  hourly_rate: z.coerce.number().min(0, "Must be a positive value > 0"),
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
  end_date: z.preprocess(
    (val) => (val === "" ? null : val),
    z.iso.date().nullable()
  ),
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

// Attendance
export const clockSchema = z.object({
  shift_id: z.cuid("Shift ID is required"),
  user_id: z.cuid("Employee ID is required"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"),
});

export type ClockPayload = z.infer<typeof clockSchema>;

export const editAttendanceSchema = z
  .object({
    shift_id: z.cuid("Invalid ID format"),
    clock_in: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"),
    clock_out: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"),
    reason: z
      .string()
      .trim()
      .min(1, "Reason is required")
      .max(120, "Maximum 120 characters"),
  })
  .refine(
    (data) => {
      if (data.clock_in && data.clock_out) {
        return data.clock_in < data.clock_out;
      }
      return true; // skip check if either is missing
    },
    {
      message: "Clock out must be after clock in",
      path: ["clock_out"], // error appears on clock_out field
    }
  )
  .refine((data) => !(!data.clock_in && data.clock_out), {
    message: "Clock in is required when clock out is set",
    path: ["clock_in"],
  });

export type EditAttendancePayload = z.infer<typeof editAttendanceSchema>;

export const confirmShiftSchema = z.object({
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"),
  end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format (HH:MM)"),
  notes: z.string().trim().nullable(),
});

const publishShiftSchema = z.object({
  id: z.string(),
  start_time: z.iso.datetime(),
  end_time: z.iso.datetime(),
  notes: z.string().trim().nullable(),
  user_id: z.cuid(),
  isLocal: z.boolean().optional(), // just allow and ignore it
});

export const publishScheduleSchema = z.object({
  add: z.record(z.string(), publishShiftSchema),
  edit: z.record(z.string(), publishShiftSchema),
  delete: z.array(z.string()),
});

export const empLeaveRequestSchema = leaveRequestSchema.omit({
  requester_id: true,
});
export type EmpAddLeaveRequestPayload = z.infer<typeof empLeaveRequestSchema>;
