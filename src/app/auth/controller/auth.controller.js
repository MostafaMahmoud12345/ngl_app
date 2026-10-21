import * as authService from "../service/auth.service.js";
import { toMs } from "../../../pkg/utils/time.js";
import { validateBody } from "../../../lib/validation/validation.js";
import {
  loginDto,
  registerDto,
  verifyOtpDto,
  sendOtpDto,
  resetPasswordDto,
  verify2faDto,
  loginConfirmDto,
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
    const result = await authService.login(email, password);

    if (result.twoFactorRequired) {
      return res.status(200).json({
        message: result.message,
        success: true,
        twoFactorRequired: true,
      });
    }

    res.cookie("access_token", result.token, {
      httpOnly: true,
      maxAge: toMs(1, "h"),
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginConfirm(req, res, next) {
  try {
    const data = validateBody(loginConfirmDto, req.body);
    const { email, code } = data;
    const token = await authService.loginConfirm(email, code);

    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: toMs(1, "h"),
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function requestEnable2fa(req, res, next) {
  try {
    const userId = req.user?.id;
    await authService.requestEnable2fa(userId);
    res.status(200).json({
      message: "Verification code sent to email to enable 2-step verification",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyAndEnable2fa(req, res, next) {
  try {
    const data = validateBody(verify2faDto, req.body);
    const { code } = data;
    const userId = req.user?.id;
    const updatedUser = await authService.verifyAndEnable2fa(userId, code);

    res.status(200).json({
      message: "2-step verification enabled successfully",
      success: true,
      user: updatedUser,
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
      message: "User login with Google successful",
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
}
