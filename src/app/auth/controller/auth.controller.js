import * as authService from "../service/auth.service.js";
import { toMs } from "../../../common/utlities/time.js";
import { validateBody } from "../../../common/validation/validation.js";
import {
  loginDto,
  registerDto,
  verifyOtpDto,
  sendOtpDto,
  resetPasswordDto,
} from "../dto/auth.dto.js";

export async function register(req, res, next) {
  try {
    const data = validateBody(registerDto, req.body);
    const newUser = await authService.registerUser(data);
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}
export async function verifyAccount(req, res, next) {
  try {
    const data = validateBody(verifyOtpDto, req.body);
    const { email, code } = data;
    const updatedUser = await authService.verifyAccount(email, code);
    res.status(200).json({
      message: "Account verified successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}
export async function login(req, res, next) {
  try {
    const data = validateBody(loginDto, req.body);

    const { email, password } = data;
    const token = await authService.login(email, password);
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: toMs(1, "h"),
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
export async function resendOtp(req, res, next) {
  try {
    const data = validateBody(sendOtpDto, req.body);

    const { email } = data;
    await authService.sendOtp(email);
    res.status(200).json({
      message: "Verification code resent successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const data = validateBody(resetPasswordDto, req.body);

    const { email, newPassword, code } = data;
    await authService.resetPassword(email, code, newPassword);
    res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginWithGoogle(req, res, next) {
  try {
    const { idToken } = req.body;
    const token = await authService.loginWithGoogle(idToken);
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: toMs(1, "h"),
    });
    res.status(200).json({
      message: " user Login with Google successful",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
