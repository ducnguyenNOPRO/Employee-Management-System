type Role = "admin" | "employee" | "manager";

interface BaseAuth {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

interface UserAuth extends BaseAuth {
  role: "employee" | "manager";
  phone?: string;
  salary?: number;
  departmentId?: number;
  createdAt?: string;
  updatedAt?: string;
}
interface AdminAuth {
  id: string;
  email: string;
  role: "admin";
}

export type AuthUser = AdminAuth | UserAuth;
