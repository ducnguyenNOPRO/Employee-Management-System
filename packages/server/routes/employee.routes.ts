import { Router } from "express";
import { getShifts } from "../controllers/employee.controller";

const employeeRouter = Router();

employeeRouter.get("/shifts", getShifts);

export default employeeRouter;
