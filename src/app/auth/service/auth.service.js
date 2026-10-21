import * as authRepository from "../repository/auth.repository.js";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import * as time from "../../../pkg/utils/time.js";
import * as generatOtp from "../../../lib/utils/generateOtp.js";
import {
  otpExpired,
  invalidVerificationCode,
  accountTemporarilyBanned,
  twoFactorAlreadyEnabled,
  twoFactorNotEnabled,
} from "../error.js";
import {
  userAlreadyExists,
  userNotFound,
  invalidCredentials,
  userAlreadyVerified,
} from "../../user/error.js";
import { sendEmail } from "../../../lib/mail/email.js";
import { generateToken } from "../utilis/token.js";
import { hashPassword, comparePassword } from "../utilis/hash.js";
import { OAuth2Client } from "google-auth-library";
import { verifyGoogleToken } from "../../../lib/utils/google.auth.js";
import { mailjetProvider } from "../../../lib/mail/init.js";
import { cacheProvider } from "../../../lib/cache/init.js";

export async function registerUser(userData) {
  const existingUser = await authRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw userAlreadyExists;
  }
  userData.password = await hashPassword(userData.password);
  const newUser = await authRepository.createUser(userData);
  const codeOtp = await generatOtp.generateCodeOtp();
  await cacheProvider.set(
    `otp:${newUser._id.toString()}`,
    codeOtp,
    time.toSeconds(5, "m")
  );
  await sendEmail(
    userData.email,
    " Verification Code",
    `<h2>Your verification code is: ${codeOtp}</h2>`
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
  await cacheProvider.del(`otp:${user._id.toString()}`);
  return updatedUser;
}

export async function login(email, password) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw invalidCredentials;
  }

  const userId = user._id.toString();

  // 1) فحص ما إذا كان الحساب محظوراً مؤقتاً
  const isBanned = await cacheProvider.get(`login_banned:${userId}`);
  if (isBanned) {
    throw accountTemporarilyBanned;
  }

  // 2) مقارنة كلمة المرور
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const attemptsStr = await cacheProvider.get(`login_attempts:${userId}`);
    let attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
    attempts += 1;

    if (attempts >= 5) {
      // حظر المستخدم لمدة 5 دقائق
      await cacheProvider.set(
        `login_banned:${userId}`,
        "true",
        time.toSeconds(5, "m")
      );
      await cacheProvider.del(`login_attempts:${userId}`);
      throw accountTemporarilyBanned;
    } else {
      await cacheProvider.set(
        `login_attempts:${userId}`,
        attempts.toString(),
        time.toSeconds(5, "m")
      );
    }
    throw invalidCredentials;
  }

  // نجاح إدخال كلمة المرور -> تصفير محاولات تسجيل الدخول الخاطئة
  await cacheProvider.del(`login_attempts:${userId}`);

  // 3) التحقق من تفعيل 2-Step Verification
  if (user.twoFactorEnabled) {
    const otp = await generatOtp.generateCodeOtp();
    await cacheProvider.set(
      `2fa_login_otp:${userId}`,
      otp,
      time.toSeconds(5, "m")
    );
    await sendEmail(
      user.email,
      "Two-Factor Authentication Code",
      `<h2>Your 2FA login verification code is: ${otp}</h2>`
    );
    return {
      twoFactorRequired: true,
      message: "OTP sent to email, please verify",
    };
  }

  const token = generateToken({ id: user._id, name: user.name });
  return {
    twoFactorRequired: false,
    token,
  };
}

export async function loginConfirm(email, code) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw userNotFound;
  }

  if (!user.twoFactorEnabled) {
    throw twoFactorNotEnabled;
  }

  const userId = user._id.toString();
  const cachedOtp = await cacheProvider.get(`2fa_login_otp:${userId}`);
  if (!cachedOtp) {
    throw otpExpired;
  }

  if (cachedOtp !== code) {
    throw invalidVerificationCode;
  }

  await cacheProvider.del(`2fa_login_otp:${userId}`);
  const token = generateToken({ id: user._id, name: user.name });
  return token;
}

export async function requestEnable2fa(userId) {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw userNotFound;
  }

  if (user.twoFactorEnabled) {
    throw twoFactorAlreadyEnabled;
  }

  const otp = await generatOtp.generateCodeOtp();
  await cacheProvider.set(
    `2fa_setup_otp:${userId}`,
    otp,
    time.toSeconds(5, "m")
  );

  await sendEmail(
    user.email,
    "Enable Two-Factor Authentication",
    `<h2>Your verification code to enable 2-step verification is: ${otp}</h2>`
  );

  return true;
}

export async function verifyAndEnable2fa(userId, code) {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw userNotFound;
  }

  if (user.twoFactorEnabled) {
    throw twoFactorAlreadyEnabled;
  }

  const cachedOtp = await cacheProvider.get(`2fa_setup_otp:${userId}`);
  if (!cachedOtp) {
    throw otpExpired;
  }

  if (cachedOtp !== code) {
    throw invalidVerificationCode;
  }

  const updatedUser = await userRepository.UpdateUserByEmail(user.email, {
    twoFactorEnabled: true,
  });

  await cacheProvider.del(`2fa_setup_otp:${userId}`);
  return updatedUser;
}

export async function sendOtp(email) {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw userNotFound;
  }
  await otpRepository.deleteOtpByEmail(email);
  const codeOtp = await generatOtp.generateCodeOtp();
  await cacheProvider.set(
    `otp:${user._id.toString()}`,
    codeOtp,
    time.toSeconds(5, "m")
  );
  await sendEmail(
    email,
    " New Verification Code",
    `<h2>Your verification code is: ${codeOtp}</h2>`
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
    password: hashedPassword,
    returnDocument: "after",
  });
  await cacheProvider.del(`otp:${user._id.toString()}`);
  return updatedUser;
}

export async function loginWithGoogle(idToken) {
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
