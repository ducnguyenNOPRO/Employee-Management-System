import { user, admin } from "../generated/prisma/client";

type AdminSelect = Pick<
  admin,
  "id" | "email" | "first_name" | "last_name" | "role"
>;
type UserSelect = Pick<
  user,
  | "id"
  | "email"
  | "phone"
  | "first_name"
  | "last_name"
  | "role"
  | "location_id"
  | "hourly_rate"
  | "emergency_contact"
  | "emergency_phone"
>;

declare global {
  namespace Express {
    interface Request {
      user?: AdminSelect | UserSelect;
      location_id?: string;
    }
  }
}

export { AdminSelect, UserSelect };
