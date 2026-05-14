import { Router } from "express";
import {
  createLeaveRequest,
  editProfile,
  getLeaveBalances,
  getShifts,
  getLeaves,
} from "../controllers/employee.controller";

const employeeRouter = Router();

employeeRouter.get("/shifts", getShifts);
employeeRouter.patch("/profile", editProfile);
employeeRouter.get("/balances", getLeaveBalances);
employeeRouter.get("/leaves", getLeaves);
employeeRouter.post("/leaves", createLeaveRequest);

export default employeeRouter;
