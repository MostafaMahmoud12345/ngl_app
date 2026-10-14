import * as messageService from "../service/massege.service.js";
import { validateBody } from "../../../lib/validation/validation.js";
import { sendMessageSchema } from "../dto/messageDto.js";
import { success } from "zod";

export async function sendMessage(req, res, next) {
  try {
    const data = await validateBody(sendMessageSchema, req.body);
    const { content, receiver } = data;
    const sender = req.user?.id;
    const newMessage = await messageService.sendMessage(
      content,
      receiver,
      sender,
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
export async function getAllMessages(req, res, next) {
  try {
    const messages = await messageService.getAllMessages(req.user.id);
    res.json({ message: "ok", success: true, data: messages });
  } catch (error) {
    next(error);
  }
}
