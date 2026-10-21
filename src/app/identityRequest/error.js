import { AppError } from "../../lib/error/error.js";

export const identityRequestNotFound = new AppError("Identity request not found", 404);
export const requestAlreadyExists = new AppError("Request already exists", 409);
export const requestAlreadyProcessed = new AppError("Request already processed", 400);
export const notMessageReceiver = new AppError("You are not the receiver of this message", 403);
export const messageSenderAnonymous = new AppError("This message has no sender", 400);
export const notRequestTarget = new AppError("You are not authorized to respond to this request", 403);
