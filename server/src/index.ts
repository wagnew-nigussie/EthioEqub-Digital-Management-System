import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// 1. Security Headers & CORS
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// 2. Cookie & Body Parsers
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// 3. Request Correlation ID
app.use((req, res, next) => {
  const reqId = (req.headers["x-request-id"] as string) || `req_${Math.random().toString(36).substring(2, 9)}`;
  req.headers["x-request-id"] = reqId;
  res.setHeader("X-Request-Id", reqId);
  next();
});

// 4. Rate Limiting (NFR-001)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later.",
    },
  },
});
app.use("/api/", generalLimiter);

// 5. System Health Check
app.get("/api/health", async (_req, res) => {
  try {
    // Ping PostgreSQL
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({
      status: "HEALTHY",
      service: "EthioEqub API Server",
      timestamp: new Date().toISOString(),
      database: "CONNECTED",
    });
  } catch (error) {
    return res.status(503).json({
      status: "UNHEALTHY",
      service: "EthioEqub API Server",
      timestamp: new Date().toISOString(),
      database: "DISCONNECTED",
    });
  }
});

// 6. Mount V1 Application Routes
app.use("/api/v1", routes);

// 7. Centralized Error Handling Middleware
app.use(errorHandler);

// 8. Server Initialization
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[EthioEqub Server] Running on http://localhost:${PORT}`);
    console.log(`[EthioEqub Server] Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

export default app;
