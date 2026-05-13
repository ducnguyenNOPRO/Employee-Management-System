import { Router } from "express";
import { editProfile, getShifts } from "../controllers/employee.controller";

const employeeRouter = Router();

employeeRouter.get("/shifts", getShifts);
employeeRouter.patch("/profile", editProfile);

export default employeeRouter;
