import { Router } from "express";
import {
  deleteRequest,
  deleteShift,
  resetLeave,
  resetShift,
  seedShift,
} from "../controllers/test.controller";

const testRouter = Router();

testRouter.delete("/leaves", deleteRequest);

testRouter.patch("/reset-leave/:id", resetLeave);

testRouter.patch("/reset-shift/:id", resetShift);

testRouter.post("/seed-shift", seedShift);

testRouter.delete("/shift", deleteShift);

export default testRouter;
