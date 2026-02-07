import { Router } from "express";
import {
  signUp,
  signOut,
  refreshToken,
  inviteEmployee,
  signIn,
} from "../controllers/auth.controller";

const authRouter = Router();

// signIn for both employee and admin
authRouter.post("/signin", signIn);

authRouter.post("/signup", signUp);
authRouter.post("/signout", signOut);
authRouter.post("/refresh", refreshToken);

// Invite and activate after create a employee
authRouter.post("/invite", inviteEmployee);
authRouter.post("/activate", inviteEmployee);

export default authRouter;
