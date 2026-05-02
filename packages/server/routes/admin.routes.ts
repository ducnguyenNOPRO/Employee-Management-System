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
  inviteEmployee,
  getAttendanceStats,
  getAttendanceLive,
  clockIn,
  clockOut,
  editTimeEntry,
  getSchedules,
  publishSchedules,
  getDashboardSummary,
} from "../controllers/admin.controller";

const adminRouter = Router();

// dashboard
adminRouter.get("/dashboard/summary", getDashboardSummary);

// employee
adminRouter.get("/employees", getEmployees); // Get all employees or by role
adminRouter.get("/employees/:id", getEmployee); // Get 1 employee
adminRouter.get("/employees/:id/balances", getEmployeeBalance); // Get all leave balances
adminRouter.post("/employee", addEmployee); // Create new employee
adminRouter.patch("/employees/:id", partialUpdateEmployee); // Partially update employee mostly updating role
// adminRouter.delete("/api/employees/:id", deleteEmployee)

// invitation
adminRouter.post("/employees/:id/invite", inviteEmployee); // Invite 1 employee

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

// attendance
adminRouter.get("/attendance/stats", getAttendanceStats); // Get count of working, late, absent
adminRouter.get("/attendance/live", getAttendanceLive); // Get data for live attendance table
adminRouter.post("/attendance/clock-in", clockIn); // Create
adminRouter.post("/attendance/clock-out", clockOut);
adminRouter.patch("/attendance/:id", editTimeEntry); // id = user_id

// schedule
adminRouter.get("/schedules", getSchedules);
adminRouter.post("/schedules", publishSchedules);

export default adminRouter;
