import { AppError } from "../../lib/error/error.js";

export const otpExpired = new AppError(
  "OTP is expired, please resend OTP",
  404,
);
export const invalidVerificationCode = new AppError(
  "Invalid verification code",
  400,
);
export const accountTemporarilyBanned = new AppError(
  "Account temporarily banned, try again in 5 minutes",
  403
);
export const twoFactorAlreadyEnabled = new AppError(
  "Two-factor authentication is already enabled",
  400
);
export const twoFactorNotEnabled = new AppError(
  "Two-factor authentication is not enabled for this account",
  400
);
