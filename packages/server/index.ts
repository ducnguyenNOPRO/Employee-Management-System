import express, { type Request, type Response } from "express";
import { authRouter, defaultRouter } from "./routes";
import { prisma } from "./lib/prisma";

const app = express();

// middleware
app.use(express.json());

// Public routes
app.use("/api/auth", authRouter);

// Private routes
app.use("/api", defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App run on port http://localhost:${port}`);
});
