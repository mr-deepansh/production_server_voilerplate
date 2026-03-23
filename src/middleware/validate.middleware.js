import ApiError from "../utils/apiError.js";
import { logger } from "../utils/logger.js";

export const validate = (DtoClass) => {
  return (req, res, next) => {
    const { errors, value } = DtoClass.validate(req.body);
    if (errors) {
      logger.warn(`Validation failed for ${req.method} ${req.path}`, { errors });
      return next(ApiError.badRequest(errors.join("; ")));
    }
    req.body = value;
    next();
  };
};
