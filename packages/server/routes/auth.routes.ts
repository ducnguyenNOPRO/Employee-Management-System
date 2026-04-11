import { Router } from "express";
import {
  signUp,
  signOut,
  refreshToken,
  signIn,
  activateEmployee,
  validateInvitaion,
} from "../controllers/auth.controller";

const authRouter = Router();

// signIn for both employee and admin
authRouter.post("/signin", signIn);

authRouter.post("/signup", signUp);
authRouter.post("/signout", signOut);
authRouter.post("/refresh", refreshToken);
authRouter.get("/invitation/validate", validateInvitaion);

// Activate after create a employee
authRouter.post("/activate", activateEmployee);

export default authRouter;
