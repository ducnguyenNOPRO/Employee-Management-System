import { Router } from "express";
import {
  createMockDepartments,
  createMockEmployees,
} from "../controllers/mockData-create.controller";

const mockDataRouter = Router();

mockDataRouter.post("/employees", createMockEmployees);
mockDataRouter.post("/departments", createMockDepartments);

export default mockDataRouter;
