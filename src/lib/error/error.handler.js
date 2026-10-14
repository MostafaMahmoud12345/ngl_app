import { logger } from "../../pkg/logger/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack ,  correlationId: req.correlationId });

  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  return res.status(500).json({ error: "something went wrong" });
}
