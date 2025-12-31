import { Request, Response, NextFunction } from "express";
import { handleError } from "../services/errors";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { statusCode, message } = handleError(error);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};
