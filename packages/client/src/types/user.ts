export interface User {
  id: string;
  email: string;
  role: "employee" | "admin";
  firstName: string;
  lastName: string;
  phone?: string;
  salary?: number;
  departmentId?: number;
  createdAt?: string;
  updatedAt?: string;
}
