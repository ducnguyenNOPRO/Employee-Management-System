import { Router } from "express";
import {
  deleteRequest,
  resetLeave,
  resetShift,
  seedShift,
  deleteShift,
  deleteTimeEntry,
  resetTimeEntry,
} from "../controllers/test.controller";

const testRouter = Router();

// ─── Leave ────────────────────────────────────────────────────────────────────
testRouter.delete("/leaves", deleteRequest);
testRouter.patch("/reset-leave/:id", resetLeave);

// ─── Shift ────────────────────────────────────────────────────────────────────
testRouter.patch("/reset-shift/:id", resetShift);
testRouter.post("/seed-shift", seedShift);
testRouter.delete("/shift", deleteShift);

// ─── Time Entry ───────────────────────────────────────────────────────────────
testRouter.delete("/time-entry", deleteTimeEntry); // DELETE /api/test/time-entry?shift_id=xxx
testRouter.patch("/time-entry", resetTimeEntry); // PATCH  /api/test/time-entry?shift_id=xxx

export default testRouter;
