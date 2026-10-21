import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import { idempotency } from "../../lib/idEmpotency/idEmpotency.js";
import { guard } from "../../lib/auth/guard.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.patch("/verify-account", authController.verifyAccount);
authRouter.post("/login", authController.login);
authRouter.post("/login-confirm", authController.loginConfirm);

// 2-Step Verification Endpoints
authRouter.post("/enable-2fa", guard, authController.requestEnable2fa);
authRouter.patch("/verify-2fa", guard, authController.verifyAndEnable2fa);

authRouter.post("/resend-otp", authController.resendOtp);
authRouter.patch(
  "/reset-password",
  idempotency(),
  authController.resetPassword,
);
authRouter.post("/login-with-google", authController.loginWithGoogle);

export default authRouter;
