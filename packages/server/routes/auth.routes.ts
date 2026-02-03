import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.post("/refresh", refreshToken);

export default authRouter;
