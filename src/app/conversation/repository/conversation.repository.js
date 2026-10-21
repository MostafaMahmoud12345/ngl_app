import Conversation from "../model/conversation.model.js";
import ConversationMessage from "../model/conversationMessage.model.js";

export async function createConversation(
  participants,
  originalMessage,
  identityRequest
) {
  return await Conversation.create({
    participants,
    originalMessage,
    identityRequest,
  });
}

export async function findConversationByIdentityRequest(identityRequestId) {
  return await Conversation.findOne({ identityRequest: identityRequestId });
}

export async function findConversationById(conversationId) {
  return await Conversation.findById(conversationId);
}

export async function createConversationMessage(
  conversationId,
  senderId,
  content
) {
  return await ConversationMessage.create({
    conversation: conversationId,
    sender: senderId,
    content,
  });
}

export async function findMessagesByConversation(conversationId) {
  return await ConversationMessage.find({
    conversation: conversationId,
    isDeleted: false,
  })
    .populate("sender", "name")
    .sort({ createdAt: 1 });
}
