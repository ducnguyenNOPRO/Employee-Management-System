import { Router } from "express";
import {
  signUp,
  userSignIn,
  signOut,
  refreshToken,
  inviteEmployee,
  adminSignIn,
} from "../controllers/auth.controller";

const authRouter = Router();

// admin signIn
authRouter.post("/admin/signin", adminSignIn);

// employee/manager signIn
authRouter.post("/signin", userSignIn);

authRouter.post("/signup", signUp);
authRouter.post("/signout", signOut);
authRouter.post("/refresh", refreshToken);

// Invite and activate after create a employee
authRouter.post("/invite", inviteEmployee);
authRouter.post("/activate", inviteEmployee);

export default authRouter;
