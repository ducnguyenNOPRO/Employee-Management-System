import { Router } from "express";
import { authMe } from "../controllers/user.controller";

const adminEmployeeRouter = Router();

adminEmployeeRouter.get("/me", authMe);

export default adminEmployeeRouter;
