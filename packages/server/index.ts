import express from "express";
import { authRouter, defaultRouter, adminRouter, userRouter } from "./routes";
import cookieParser from "cookie-parser";
import { allowRoles, AuthenticatedRoute } from "./middlewares/auth.middlewares";
import cors from "cors";
import mockDataRouter from "./routes/mockData-create.routes";
import testRouter from "./routes/test.routes";

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

app.use("/api/test", testRouter);

// Authuticated routes
// app.use(AuthenticatedRoute);  // Check for accessToken and refreshToken
app.use(
  "/api/users" /*, allowRoles(["employee", "manager", "admin"])*/,
  userRouter
);
app.use("/api/admin" /*, allowRoles(["admin"])*/, adminRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App run on port http://localhost:${port}`);
});
