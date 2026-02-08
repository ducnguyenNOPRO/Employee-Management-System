import { Router } from "express";
import {
  getEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  partialUpdateEmployee,
  getDepartments,
  getDepartment,
  partialUpdateDepartment,
} from "../controllers/admin.controller";

const adminRouter = Router();

// employee
adminRouter.get("/employees", getEmployees); // Get all employees or by role
adminRouter.get("/employees/:id", getEmployee); // Get 1 employee
adminRouter.post("/employees", addEmployee); // Create new employee
adminRouter.put("/employees/:id", updateEmployee); // Fully update employe
adminRouter.patch("/employees/:id", partialUpdateEmployee); // Partially update employee mostly updating role
// adminRouter.delete("/api/employees/:id", deleteEmployee)

// department
adminRouter.get("/departments", getDepartments); // Get all departments paginated
adminRouter.get("/departments/:id", getDepartment); // Get 1 department
adminRouter.patch("/departments/:id", partialUpdateDepartment); // Partially update department, dynamically handle field changes in FE

export default adminRouter;
