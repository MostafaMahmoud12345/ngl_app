import { Router } from "express";
import authRouter from "./app/auth/auth.route.js";
import messagerRouter from "./app/massege/massege.route.js";
import userRouter from "./app/user/user.route.js";
import identityRequestRouter from "./app/identityRequest/identityRequest.route.js";
import conversationRouter from "./app/conversation/conversation.route.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/message", messagerRouter);
router.use("/user", userRouter);
router.use("/identity-requests", identityRequestRouter);
router.use("/conversations", conversationRouter);
