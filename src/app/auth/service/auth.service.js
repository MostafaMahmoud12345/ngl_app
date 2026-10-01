import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import * as time from "../../../common/utlities/time.js";
import * as generatOtp from "../../../common/utlities/generateOtp.js";
import { otpExpired, invalidVerificationCode } from "../error.js";
import {
  userAlreadyExists,
  userNotFound,
  invalidCredentials,
  userAlreadyVerified,
} from "../../user/error.js";
import { sendEmail } from "../../../common/email.js";
import { generateToken } from "../utilis/token.js";
import {hashPassword,comparePassword} from "../utilis/hash.js";
import { OAuth2Client } from "google-auth-library";
import {verifyGoogleToken} from "../../../common/google.auth.js";






export async function registerUser(userData) {
 
  const existingUser = await authRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw userAlreadyExists;
  }
  userData.password = await hashPassword(userData.password);
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
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw invalidCredentials;
  }
   return generateToken({ id: user._id, name: user.name });
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
export async function resetPassword(email, code, newPassword) {
  const otp = await otpRepository.findOtpByEmail(email);
  if (!otp) {
    throw otpExpired;
  }
  if (otp.code !== code) {
    throw invalidVerificationCode;
  }
  const hashedPassword = await hashPassword(newPassword);
  const updatedUser = await userRepository.UpdateUserByEmail(email, {
    password: hashedPassword,returnDocument: "after",
  });
  await otpRepository.deleteOtpByEmail(email);
  return updatedUser;
}

export async function loginWithGoogle(idToken){
   const payload = await verifyGoogleToken(idToken);
   let user = await authRepository.findUserByEmail(payload.email);
   if (!user) {
     user = await authRepository.createUser({
       name: payload.name,
       email: payload.email,
       provider: "google",
       isVerified: true,
     });
   }
   return generateToken({ id: user._id, name: user.name });
 }
