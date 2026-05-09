import { Router } from "express";
import {
  signUpAdmin,
  signUpEmployee,
  signOut,
  refreshToken,
  signIn,
  activateEmployee,
  validateInvitaion,
} from "../controllers/auth.controller";

const authRouter = Router();

// signIn for both employee and admin
authRouter.post("/signin", signIn);

// No option to create accounts
// authRouter.post("/signup/admin", signUpAdmin);
// authRouter.post("/signup/employee", signUpEmployee);

authRouter.post("/signout", signOut);
authRouter.post("/refresh", refreshToken);
authRouter.get("/invitation/validate", validateInvitaion);

// Activate after create a employee
authRouter.post("/activate", activateEmployee);

export default authRouter;
