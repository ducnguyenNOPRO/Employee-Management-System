import { z } from "zod";

// Register
export const registerSchema = z
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

export type RegisterFormFields = z.infer<typeof registerSchema>;

// Log In
export const signInSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().trim().min(1, "Password is required"),
});
export type SignInFormFields = z.infer<typeof signInSchema>;

// Employee
export const employeeSchema = z.object({
  id: z.coerce.number().optional(), // non-editable
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
  address: z.string().trim().min(1, "Address is required"),
  position: z.string().trim().min(1, "Position is required"),
  department: z.string().trim().min(1, "Department is required"),
  employmentType: z.enum(["full-time", "part-time", "contract"]),
  status: z.enum(["active", "on leave", "inactive"]).default("active"),
  startDate: z.string().trim().min(1, "Start date is required"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  emergencyContact: z.string().trim().optional(),
  emergencyPhone: z.string().trim().optional(),
});

export type EmployeeFormFields = z.infer<typeof employeeSchema>;

// Department
export const departmentSchema = z.object({
  id: z.coerce.number().optional(), // non-editable
  name: z.string().trim().min(1, "Department Name is required"),
  location: z.string().trim().min(1, "Location is required"),
  established: z.string().trim().min(1, "Start date is required"),
  budget: z.coerce
    .number()
    .min(0, "Budget must be a positive number")
    .default(0),
  budgetUtilization: z.coerce
    .number()
    .min(0, "Budget utilization must be a positive number")
    .default(0),
  openPositions: z.coerce.number().default(0),
  employeeCount: z.coerce
    .number()
    .min(0, "Employee Count must be a positive numebr")
    .default(0),
  managerId: z.string().trim().min(1).optional(), // reference employee (role = "manager") table
  managerName: z.string().trim().optional(), // remove after implement manager role
  managerEmail: z.string().trim().optional(), // remove after implement manager role
  managerPhone: z.string().trim().optional(), // remove after implement manager role
  description: z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
});

// Uncomment after implement manager role for employee table
// export type DepartmentFields = z.infer<typeof departmentSchema & {managerName: string, managerEmail: string, managerPhone: string}>;
export type DepartmentFields = z.infer<typeof departmentSchema>;

// Leave Request
export const leaveRequestSchema = z.object({
  employeeName: z.string().trim().min(1, "Employee Name is required"),
  type: z.enum(["Vacation", "Sick Leave", "Personal", "Other"]),
  startDate: z.string().trim().min(1, "Start date is required"),
  reason: z.string().trim().optional(),
  hour: z.coerce
    .number()
    .min(1, "Minimum of 1 hour requesteable")
    .max(40, "Maximum of 40 hour requestable"),
});

export type LeaveRequestFormFields = z.infer<typeof leaveRequestSchema>;
