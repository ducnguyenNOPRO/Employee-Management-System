import express from "express";
import { authRouter, defaultRouter, adminRouter, userRouter } from "./routes";
import cookieParser from "cookie-parser";
import { AuthenticatedRoute } from "./middlewares/auth.middlewares";
import cors from "cors";
import mockDataRouter from "./routes/mockData-create.routes";

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(defaultRouter);

// Public routes
app.use("/api/auth", authRouter);

// Mock Data create routes
app.use("/api/mock", mockDataRouter);

// Authuticated routes
// app.use(AuthenticatedRoute);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App run on port http://localhost:${port}`);
});
