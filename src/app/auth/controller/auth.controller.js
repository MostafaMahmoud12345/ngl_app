import e from "express";
import * as authService from "../service/auth.service.js";
import { toMs } from "../../../../utlities/time.js";

export async function register(req, res, next) {
  try {
    const newUser = await authService.registerUser(req.body);
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
    const { email, code } = req.body;
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
    const { email, password } = req.body;
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
    const { email } = req.body;
    await authService.sendOtp(email);
    res.status(200).json({
      message: "Verification code resent successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
