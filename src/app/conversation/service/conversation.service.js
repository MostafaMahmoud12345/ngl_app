import * as conversationRepository from "../repository/conversation.repository.js";
import * as identityRequestRepository from "../../identityRequest/repository/identityRequest.repository.js";
import {
  identityRequestNotFound,
  identityRequestNotAccepted,
  notAParticipant,
  conversationAlreadyExists,
  conversationNotFound,
  notAuthorized,
} from "../error.js";

export async function createConversation(identityRequestId, currentUserId) {
  const identityRequest = await identityRequestRepository.findRequestById(identityRequestId);
  if (!identityRequest) throw identityRequestNotFound;

  if (identityRequest.status !== "accepted") throw identityRequestNotAccepted;

  const isParticipant =
    identityRequest.requester.toString() === currentUserId.toString() ||
    identityRequest.targetSender.toString() === currentUserId.toString();
  if (!isParticipant) throw notAParticipant;

  const existingConversation = await conversationRepository.findConversationByIdentityRequest(identityRequestId);
  if (existingConversation) throw conversationAlreadyExists;

  return await conversationRepository.createConversation(
    [identityRequest.requester, identityRequest.targetSender],
    identityRequest.message,
    identityRequest._id
  );
}

export async function sendMessage(conversationId, senderId, content) {
  const conversation = await conversationRepository.findConversationById(conversationId);
  if (!conversation) throw conversationNotFound;

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === senderId.toString()
  );
  if (!isParticipant) throw notAuthorized;

  return await conversationRepository.createConversationMessage(
    conversationId,
    senderId,
    content
  );
}

export async function getMessages(conversationId, currentUserId) {
  const conversation = await conversationRepository.findConversationById(conversationId);
  if (!conversation) throw conversationNotFound;

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === currentUserId.toString()
  );
  if (!isParticipant) throw notAuthorized;

  return await conversationRepository.findMessagesByConversation(conversationId);
}
