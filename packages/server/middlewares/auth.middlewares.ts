import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import type { AdminSelect, UserSelect } from "../types/express";

type Role = "ADMIN" | "EMPLOYEE" | "MANAGER";

interface DecodedUser extends JwtPayload {
  userId: string;
  userRole: Role;
  // add other properties from your token payload
}

// authorization
export function AuthenticatedRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    // Authorization: Bearer  <accessToken>--string
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "Access token undefined" });
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
      async (err, decoded) => {
        if (err) {
          console.log(err);
          return res
            .status(403)
            .json({ message: "Access Token is expired or incorrect" });
        }

        // jwt payload
        const decodedUser = decoded as DecodedUser;

        let user;

        if (decodedUser.userRole === "ADMIN") {
          user = await prisma.admin.findUnique({
            where: {
              id: decodedUser.userId,
            },
            select: {
              first_name: true,
              last_name: true,
              email: true,
              role: true,
              id: true,
            },
          });
        } else if (["EMPLOYEE", "MANAGER"].includes(decodedUser.userRole)) {
          user = await prisma.user.findUnique({
            where: {
              id: decodedUser.userId,
            },
            select: {
              id: true,
              role: true,
              emergency_contact: true,
              emergency_phone: true,
              email: true,
              hourly_rate: true,
              location_id: true,
              first_name: true,
              last_name: true,
              phone: true,
            },
          });
        }

        if (!user) {
          return res.status(404).json({ message: "User does not exist" });
        }

        // Case type since user is unknown here
        req.user = user as UserSelect | AdminSelect;
        req.location_id =
          "location_id" in req.user ? req.user.location_id : undefined;
        next();
      }
    );
  } catch (error) {
    console.log("Error validation JWT in auth middleware", error);
    return res.status(500).json({ message: "System error" });
  }
}

// Function to restrict access based on role
// Guarantee a user if went through Authenticated Routes
export function allowRoles(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      return res.status(403).send("Access denied");
    }
    next();
  };
}
