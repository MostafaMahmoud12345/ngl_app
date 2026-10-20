import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import * as time from "../../../pkg/utils/time.js";
import * as generatOtp from "../../../lib/utils/generateOtp.js";
import { otpExpired, invalidVerificationCode } from "../error.js";
import {
  userAlreadyExists,
  userNotFound,
  invalidCredentials,
  userAlreadyVerified,
} from "../../user/error.js";
import { sendEmail } from "../../../lib/mail/email.js";
import { generateToken } from "../utilis/token.js";
import {hashPassword,comparePassword} from "../utilis/hash.js";
import { OAuth2Client } from "google-auth-library";
import {verifyGoogleToken} from "../../../lib/utils/google.auth.js";
import {mailjetProvider} from "../../../lib/mail/init.js";
import {cacheProvider} from "../../../lib/cache/init.js"






export async function registerUser(userData) {
 
  const existingUser = await authRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw userAlreadyExists;
  }
  userData.password = await hashPassword(userData.password);
  const newUser = await authRepository.createUser(userData);
  const codeOtp = await generatOtp.generateCodeOtp();
  await cacheProvider.set(`otp:${newUser._id.toString()}`,codeOtp,time.toSeconds(5,"m"))
  //  otpRepository.createOtp({
  //   code: codeOtp,
  //   email: userData.email,
  //   expiresIn: new Date(Date.now() + time.toMs(5, "m")),
  // });
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
  const otp = await cacheProvider.get(`otp:${user._id.toString()}`);
  if (!otp) {
    throw otpExpired;
  }
  if (otp !== code) {
    throw invalidVerificationCode;
  }

  const updatedUser = await userRepository.UpdateUserByEmail(email, {
    isVerified: true,
  });
  await cacheProvider.del(`otp:${user._id.toString()}`)
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
  await cacheProvider.set(`otp:${user._id.toString()}`,codeOtp,time.toSeconds(5,"m"))
  await sendEmail(
    email,
    " New Verification Code",
    `<h2>Your verification code is: ${codeOtp}</h2>`,
  );
}
export async function resetPassword(email, code, newPassword) {
 const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw userNotFound;
  }
  const otp = await cacheProvider.get(`otp:${user._id.toString()}`);
  if (!otp) {
    throw otpExpired;
  }
  if (otp !== code) {
    throw invalidVerificationCode;
  }
  const hashedPassword = await hashPassword(newPassword);
  const updatedUser = await userRepository.UpdateUserByEmail(email, {
    password: hashedPassword,returnDocument: "after",
  });
  await cacheProvider.del(`otp:${user._id.toString()}`)
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
