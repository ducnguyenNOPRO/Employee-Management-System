import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

interface DecodedUser extends JwtPayload {
  id: number;
  // add other properties from your token payload
}

// authorization
export function adminRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    // Authorization: Bearer  <accessToken>--string
    const accessToken = authHeader && authHeader.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token found" });
    }

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

        // Case: accessToken is valid but refreshToken expired or null
        // Reject immediately withou retry (calling /refresh in axios interceptor)
        const session = await prisma.session.findUnique({
          where: {
            refresh_token: refreshToken,
          },
        });

        if (!session || session.expires_at < new Date()) {
          return res.status(403).json({
            code: "REFRESH_TOKEN_EXPIRED",
            message: "Refresh Token is expired or session not found",
          });
        }

        const userWithPassword = await prisma.user.findUnique({
          where: {
            id: decodedUser.userId,
          },
        });

        if (!userWithPassword) {
          return res.status(404).json({ message: "User does not exist" });
        }

        const { password_hash, ...user } = userWithPassword;
        // Now 'user' has everything except hashedPassword
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.log("Error validation JWT in auth middleware", error);
    return res.status(500).json({ message: "System error" });
  }
}
