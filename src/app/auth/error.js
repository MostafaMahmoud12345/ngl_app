import { AppError }from "../../common/error.js";


export const otpExpired = new AppError("OTP is expired, please resend OTP", 404);
export const invalidVerificationCode = new AppError("Invalid verification code", 400);
