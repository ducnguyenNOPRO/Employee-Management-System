import { user, admin } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<user, "password_hash">;
    }
  }
}

export {};
