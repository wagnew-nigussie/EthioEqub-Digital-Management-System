import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = (req.headers["x-request-id"] as string) || `req_${Math.random().toString(36).substring(2, 9)}`;

  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError || err.name === "ZodError" || (err as any).issues) {
    const issues = (err as any).errors || (err as any).issues || [];
    const formattedErrors = issues.map((e: any) => ({
      field: Array.isArray(e.path) ? e.path.join(".") : String(e.path),
      issue: e.message,
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input payload",
        details: formattedErrors,
        requestId,
      },
    });
  }

  // Handle Explicit App Domain Errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details,
        requestId,
      },
    });
  }

  // Handle Unhandled Internal Exceptions (Do not leak stack trace in production)
  console.error(`[Unhandled Server Error] [${requestId}]:`, err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred. Please try again later.",
      requestId,
    },
  });
}
