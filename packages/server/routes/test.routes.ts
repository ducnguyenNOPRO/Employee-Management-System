import { Router } from "express";
import { deleteRequest, resetLeave } from "../controllers/test.controller";

const testRouter = Router();

testRouter.delete("/leaves", deleteRequest);

testRouter.patch("/reset-leave/:id", resetLeave);

export default testRouter;
