import { Router } from "express";
import {
  createMockDepartments,
  createMockEmployees,
  createMockRequests,
  createShifts,
  createTimeEntries,
  createLocations,
} from "../controllers/mockData-create.controller";

const mockDataRouter = Router();

mockDataRouter.post("/employees", createMockEmployees);
mockDataRouter.post("/departments", createMockDepartments);
mockDataRouter.post("/leaves", createMockRequests);
mockDataRouter.post("/shifts", createShifts);
mockDataRouter.post("/time_entries", createTimeEntries);
mockDataRouter.post("/locations", createLocations);

export default mockDataRouter;
