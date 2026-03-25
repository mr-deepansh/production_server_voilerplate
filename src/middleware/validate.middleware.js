import ApiError from "../utils/apiError.js";
import { logger } from "../utils/logger.js";

const parseErrors = (rawErrors) =>
  rawErrors.map((err) => {
    const colonIdx = err.indexOf(": ");
    if (colonIdx === -1) return { field: null, message: err };
    return {
      field: err.slice(0, colonIdx),
      message: err.slice(colonIdx + 2),
    };
  });

export const validate = (DTOClass) => (req, res, next) => {
  try {
    if (!DTOClass || typeof DTOClass.validate !== "function") {
      logger.error("[validate] Middleware called with invalid DTO class", {
        received: String(DTOClass),
        path: req.path,
      });
      return next(ApiError.internal("Server misconfiguration: invalid DTO class"));
    }
    const { errors, value } = DTOClass.validate(req.body);
    if (errors) {
      const details = parseErrors(errors);
      logger.warn("[validate] Validation failed", {
        method: req.method,
        path: req.path,
        details,
      });
      return next(ApiError.validationError("Validation failed", details));
    }
    req.body = value;
    return next();
  } catch (err) {
    logger.error("[validate] Unexpected error in validate middleware", {
      error: err.message,
      stack: err.stack,
      path: req.path,
    });
    return next(ApiError.internal("Request validation error"));
  }
};
