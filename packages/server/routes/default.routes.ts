import { Router } from "express";
import type { Request, Response } from "express";

const defaultRouter = Router();

defaultRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

defaultRouter.get("/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

export default defaultRouter;
