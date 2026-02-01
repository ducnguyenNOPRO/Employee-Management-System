import express, { type Request, type Response } from "express";
import { authRouter, defaultRouter, userRouter } from "./routes";
import cookieParser from "cookie-parser";
import { adminRoute } from "./middlewares/auth.middlewares";

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(defaultRouter);

// Public routes
app.use("/api/auth", authRouter);

// Private routes
app.use(adminRoute);
app.use("/api/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App run on port http://localhost:${port}`);
});
