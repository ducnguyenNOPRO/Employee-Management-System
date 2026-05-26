import express from "express";
import {
  authRouter,
  defaultRouter,
  adminRouter,
  userRouter,
  employeeRouter,
} from "./routes";
import cookieParser from "cookie-parser";
import { allowRoles, AuthenticatedRoute } from "./middlewares/auth.middlewares";
import cors from "cors";
import mockDataRouter from "./routes/mockData-create.routes";
import testRouter from "./routes/test.routes";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Strict limit for auth
const authLimiter = rateLimit({
  skip: (req) => req.path === "/api/auth/refresh",
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: { message: "Too many request, please try again later" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Relaxed limit for authenticated API routes
const apiLimiter = rateLimit({
  skip: (req) => req.path === "/api/users/me",
  keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip ?? ""),
  windowMs: 10 * 60 * 1000,
  limit: 200,
  message: { message: "Too many auth request, please try again later" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(defaultRouter);

// Public routes
app.use("/api/auth", authLimiter, authRouter);

// Mock Data create routes
app.use("/api/mock", mockDataRouter);

app.use("/api/test", testRouter);

// Authuticated routes
app.use(AuthenticatedRoute);
app.use(apiLimiter);
app.use("/api/users", allowRoles(["EMPLOYEE", "MANAGER", "ADMIN"]), userRouter);
app.use("/api/admin", allowRoles(["MANAGER"]), adminRouter);
app.use("/api/employee", allowRoles(["EMPLOYEE"]), employeeRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App run on port http://localhost:${port}`);
});
