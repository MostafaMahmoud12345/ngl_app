import * as conversationService from "../service/conversation.service.js";
import { validateBody } from "../../../lib/validation/validation.js";
import {
  createConversationSchema,
  sendConversationMessageSchema,
} from "../dto/conversation.dto.js";

export async function createConversation(req, res, next) {
  try {
    const data = await validateBody(createConversationSchema, req.body);
    const { identityRequestId } = data;
    const currentUserId = req.user?.id;

    const newConversation = await conversationService.createConversation(
      identityRequestId,
      currentUserId,
    );

    res.status(201).json({
      message: "Conversation created successfully",
      success: true,
      data: newConversation,
    });
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const data = await validateBody(sendConversationMessageSchema, req.body);
    const { content } = data;
    const { conversationId } = req.params;
    const senderId = req.user?.id;

    const newMessage = await conversationService.sendMessage(
      conversationId,
      senderId,
      content,
    );

    res.status(201).json({
      message: "Message sent successfully",
      success: true,
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req, res, next) {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user?.id;

    const messages = await conversationService.getMessages(
      conversationId,
      currentUserId,
    );

    res.status(200).json({
      message: "Messages retrieved successfully",
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}
