import { Router } from "express";
import {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  partialUpdateEmployee,
} from "../controllers/admin-employee.controller";

const adminEmployeeRouter = Router();

adminEmployeeRouter.get("/employees", getEmployees); // Get all employees paginated
adminEmployeeRouter.get("/employees/:id", getEmployee); // Get 1 employee, rarely called in FE
adminEmployeeRouter.post("/employees", addEmployee); // Create new employee
adminEmployeeRouter.put("/employees/:id", updateEmployee); // Fully update employe
adminEmployeeRouter.patch("/employees/:id", partialUpdateEmployee); // Partially update employee mostly updating role
// adminEmployeeRouter.delete("/api/employees/:id", deleteEmployee)

export default adminEmployeeRouter;
