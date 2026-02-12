type Role = "ADMIN" | "EMPLOYEE" | "MANAGER";

interface BaseAuth {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
}

interface UserAuth extends BaseAuth {
  role: "EMPLOYEE" | "MANAGER";
  phone?: string;
  salary?: number;
  department_id?: String;
  created_at?: string;
  updated_at?: string;
}
interface AdminAuth {
  id: string;
  email: string;
  role: "ADMIN";
}

export type AuthUser = AdminAuth | UserAuth;
