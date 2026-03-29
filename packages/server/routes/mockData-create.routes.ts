import { Router } from "express";
import {
  createMockDepartments,
  createMockEmployees,
  createMockRequests,
} from "../controllers/mockData-create.controller";

const mockDataRouter = Router();

mockDataRouter.post("/employees", createMockEmployees);
mockDataRouter.post("/departments", createMockDepartments);
mockDataRouter.post("/leaves", createMockRequests);

export default mockDataRouter;
