import * as userRepository from "../../user/repository/user.repository.js";
import { userNotFound } from "../../user/error.js";
import * as messageRepository from "../repository/massege.repository.js";
import { AppError } from "../../../lib/error/error.js";
export async function sendMessage(content, receiver, sender) {
  const user = await userRepository.findUserById(receiver);
  if (!user) throw userNotFound;
  return await messageRepository.createMessage(content, receiver, sender);
}

export async function getAllMessages(userId) {
  const messages = await messageRepository.getAllMessages(userId);
  if (messages.length === 0) throw new AppError("no messages", 404);
  return messages;
}
