import { AppError } from "../../common/error.js";

export const userAlreadyExists = new AppError("User already exists", 409);
export const userNotFound = new AppError("User not found", 404);
export const invalidCredentials = new AppError("Invalid credentials", 401);
export const userAlreadyVerified = new AppError("User already verified", 400);