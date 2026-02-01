import z from "zod";
// User (both admind and employee)
export const userSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  hashedPassword: z.string().trim(),
  role: z.enum(["admin", "employee"]),
  phone: z.string().trim().min(1).max(20).optional(), // maybe required in future if no employee table
  salary: z.coerce.number("Salaray must be a number").optional(), // for admin
});
