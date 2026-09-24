import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import * as time from "../../../../utlities/time.js";
import * as generatOtp from "../../../../utlities/generateOtp.js";
import { otpExpired, invalidVerificationCode } from "../error.js";
import {
  userAlreadyExists,
  userNotFound,
  invalidCredentials,
  userAlreadyVerified,
} from "../../user/error.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../../common/email.js";
import jwt from "jsonwebtoken";






export async function registerUser(userData) {
 
  const existingUser = await authRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw userAlreadyExists;
  }
  userData.password = await bcrypt.hash(userData.password, 7);
  const newUser = await authRepository.createUser(userData);
  const codeOtp = await generatOtp.generateCodeOtp();
  await otpRepository.createOtp({
    code: codeOtp,
    email: userData.email,
    expiresIn: new Date(Date.now() + time.toMs(5, "m")),
  });
  await sendEmail(
    userData.email,
    " Verification Code",
    `<h2>Your verification code is: ${codeOtp}</h2>`,
  );
  return newUser;
}

export async function verifyAccount(email, code) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw userNotFound;
  }
  if (user.isVerified) {
    throw userAlreadyVerified;
  }
  const otp = await otpRepository.findOtpByEmail(email);
  if (!otp) {
    throw otpExpired;
  }
  if (otp.code !== code) {
    throw invalidVerificationCode;
  }

  const updatedUser = await userRepository.UpdateUserByEmail(email, {
    isVerified: true,
  });
  await otpRepository.deleteOtpByEmail(email);
  return updatedUser;
}

export async function login(email, password) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw invalidCredentials;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw invalidCredentials;
  }
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: time.toMs(1, "h"),
  });
}

export async function sendOtp(email) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw userNotFound;
  }
  await otpRepository.deleteOtpByEmail(email);
  const codeOtp = await generatOtp.generateCodeOtp();
  await otpRepository.createOtp({
    code: codeOtp,
    email: email,
    expiresIn: new Date(Date.now() + time.toMs(5, "m")),
  });
  await sendEmail(
    email,
    " New Verification Code",
    `<h2>Your verification code is: ${codeOtp}</h2>`,
  );
}
