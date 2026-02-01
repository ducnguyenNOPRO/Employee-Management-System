import { z } from "zod";

// User (both admind and employee)
export const userSchema = z
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
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"], // This sets which field gets the error
  });

export type UserFormFields = z.infer<typeof userSchema>;

// Employee
export const employeeSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
  address: z.string().trim().min(1, "Address is required"),
  position: z.string().trim().min(1, "Position is required"),
  department: z.string().trim().min(1, "Department is required"),
  employmentType: z.enum(["Full-time", "Part-time", "Contract"]),
  startDate: z.string().trim().min(1, "Start date is required"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  emergencyContact: z.string().trim().optional(),
  emergencyPhone: z.string().trim().optional(),
});

export type EmployeeFormFields = z.infer<typeof employeeSchema>;

// Department
export const departmentSchema = z.object({
  departmentName: z.string().trim().min(1, "Department Name is required"),
  managerName: z.string().trim().optional(),
  budget: z.coerce.number().min(0, "Budget must be a positive number"),
  employeeCount: z.coerce
    .number()
    .min(0, "Employee Count must be a positive numebr"),
  description: z.string().trim().optional(),
});

export type DepartmentFormFields = z.infer<typeof departmentSchema>;

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
