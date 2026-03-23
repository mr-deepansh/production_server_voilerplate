// src/middleware/error.middleware.js
import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const request = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  };
  // ApiError (known operational)
  if (err instanceof ApiError) {
    if (!err.isOperational) {
      logger.error("Non-operational ApiError", {
        ...request,
        message: err.message,
        code: err.code,
        stack: err.stack,
      });
    } else {
      logger.warn(`[${err.code}] ${err.message}`, request);
    }
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(err.details !== null && err.details !== undefined && { details: err.details }),
    });
  }
  //Mongoose ValidationError
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    logger.warn("Mongoose validation failed", { ...request, details });
    return res.status(422).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details,
    });
  }
  // Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    logger.warn("Mongoose cast error", { ...request, path: err.path, value: err.value });
    return res.status(400).json({
      success: false,
      code: "BAD_REQUEST",
      message: `Invalid value for field: ${err.path}`,
    });
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? err.keyValue ?? {})[0] ?? "field";
    logger.warn("Duplicate key error", { ...request, field });
    return res.status(409).json({
      success: false,
      code: "CONFLICT",
      message: `${field} already exists`,
      details: [{ field, message: `${field} is already taken` }],
    });
  }
  // JWT errors
  if (err.name === "JsonWebTokenError") {
    logger.warn("Invalid JWT token", request);
    return res.status(401).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "Invalid token",
    });
  }
  if (err.name === "TokenExpiredError") {
    logger.warn("JWT token expired", request);
    return res.status(401).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "Session expired, please login again",
    });
  }
  // Body parser errors (Express 5)
  if (err instanceof SyntaxError && "body" in err) {
    logger.warn("Invalid JSON body", request);
    return res.status(400).json({
      success: false,
      code: "BAD_REQUEST",
      message: "Invalid JSON format",
    });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      code: "PAYLOAD_TOO_LARGE",
      message: "Request body exceeds size limit",
    });
  }
  // Unknown / unexpected
  logger.error("Unhandled error", {
    ...request,
    message: err.message,
    name: err.name,
    stack: err.stack,
  });
  return res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again later."
        : err.message,
  });
};
