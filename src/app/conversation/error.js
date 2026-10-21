import { AppError } from "../../lib/error/error.js";

export const identityRequestNotFound = new AppError(
  "Identity request not found",
  404
);
export const identityRequestNotAccepted = new AppError(
  "Identity request is not accepted",
  400
);
export const notAParticipant = new AppError(
  "You are not a participant in this request",
  403
);
export const conversationAlreadyExists = new AppError(
  "Conversation already exists",
  409
);
export const conversationNotFound = new AppError(
  "Conversation not found",
  404
);
export const notAuthorized = new AppError(
  "You are not authorized to access this conversation",
  403
);
