import { Router } from "express";
import * as conversationController from "./controller/conversation.controller.js";
import { guard } from "../../lib/auth/guard.js";

const conversationRouter = Router();

conversationRouter.post("/", guard, conversationController.createConversation);
conversationRouter.post(
  "/:conversationId/messages",
  guard,
  conversationController.sendMessage
);
conversationRouter.get(
  "/:conversationId/messages",
  guard,
  conversationController.getMessages
);

export default conversationRouter;
