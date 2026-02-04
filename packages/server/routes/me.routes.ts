import { Router } from "express";
import { authMe } from "../controllers/user.controller";

const userRouter = Router();

// Getting user info ignore role
// Put this in general auth middleware
userRouter.get("/me", authMe);

export default userRouter;
