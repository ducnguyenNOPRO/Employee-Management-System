import express from "express";
import {
  authRouter,
  defaultRouter,
  adminEmployeeRouter,
  userRouter,
} from "./routes";
import cookieParser from "cookie-parser";
import { AuthenticatedRoute } from "./middlewares/auth.middlewares";
import cors from "cors";

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(defaultRouter);

// Public routes
app.use("/api/auth", authRouter);

// Authuticated routes
// app.use(AuthenticatedRoute);
app.use("/api/users", userRouter);
app.use("/api/admin/", adminEmployeeRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App run on port http://localhost:${port}`);
});
