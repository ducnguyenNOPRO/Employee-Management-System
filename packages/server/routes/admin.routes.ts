import { Router } from "express";
import {
  getEmployees,
  getEmployee,
  addEmployee,
  partialUpdateEmployee,
  getDepartments,
  getDepartment,
  partialUpdateDepartment,
  createDepartment,
  getRequests,
  createRequest,
  updateRequest,
  getRequestStats,
  getEmployeeBalance,
} from "../controllers/admin.controller";

const adminRouter = Router();

// employee
adminRouter.get("/employees", getEmployees); // Get all employees or by role
adminRouter.get("/employees/:id", getEmployee); // Get 1 employee
adminRouter.get("/employees/:id/balances", getEmployeeBalance); // Get all leave balances
adminRouter.post("/employee", addEmployee); // Create new employee
adminRouter.patch("/employees/:id", partialUpdateEmployee); // Partially update employee mostly updating role
// adminRouter.delete("/api/employees/:id", deleteEmployee)

// department
adminRouter.get("/departments", getDepartments); // Get all departments paginated
adminRouter.get("/departments/:id", getDepartment); // Get 1 department
adminRouter.post("/departments", createDepartment); // Create a new department
adminRouter.patch("/departments/:id", partialUpdateDepartment); // Partially update department, dynamically handle field changes in FE

// leave request
adminRouter.get("/leaves", getRequests); // Get all leave request paginated
adminRouter.get("/leaves/stats", getRequestStats); // Get request count per status
adminRouter.post("/leaves", createRequest); // Create a new request
adminRouter.patch("/leaves/:id", updateRequest); // Update the status Approved or Rejected

export default adminRouter;
