import { Router } from "express";
import { authMe } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", authMe);

export default userRouter;
