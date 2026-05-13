type Role = "ADMIN" | "EMPLOYEE" | "MANAGER";

interface BaseAuth {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
}

export interface UserAuth extends BaseAuth {
  role: "EMPLOYEE" | "MANAGER";
  phone: string;
  email: string;
  hourly_rate: number;
  location_id: string;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
}
interface AdminAuth extends BaseAuth {
  role: "ADMIN";
}

export type AuthUser = AdminAuth | UserAuth;

export type MutableUserFields = Pick<
  UserAuth,
  "email" | "phone" | "emergency_contact" | "emergency_phone"
>;
