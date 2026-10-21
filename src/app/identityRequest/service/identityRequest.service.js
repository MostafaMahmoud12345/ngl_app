import * as messageRepository from "../../massege/repository/massege.repository.js";
import * as identityRequestRepository from "../repository/identityRequest.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import {
  identityRequestNotFound,
  requestAlreadyExists,
  requestAlreadyProcessed,
  notMessageReceiver,
  messageSenderAnonymous,
  notRequestTarget,
} from "../error.js";
import { AppError } from "../../../lib/error/error.js";

export async function requestSenderIdentity(messageId, requesterId) {
  const message = await messageRepository.findMessageById(messageId);
  if (!message) throw new AppError("Message not found", 404);

  if (message.receiver.toString() !== requesterId.toString()) throw notMessageReceiver;

  if (!message.sender) throw messageSenderAnonymous;

  const existingRequest = await identityRequestRepository.findRequestByMessage(messageId);
  if (existingRequest) throw requestAlreadyExists;

  return await identityRequestRepository.createIdentityRequest(
    messageId,
    requesterId,
    message.sender
  );
}

export async function getMyRequests(targetSenderId) {
  return await identityRequestRepository.getRequestsByTargetSender(targetSenderId);
}

export async function respondToRequest(requestId, currentUserId, action) {
  const request = await identityRequestRepository.findRequestById(requestId);
  if (!request) throw identityRequestNotFound;

  if (request.targetSender.toString() !== currentUserId.toString()) throw notRequestTarget;

  if (request.status !== "pending") throw requestAlreadyProcessed;

  if (action === "accept") {
    const updatedRequest = await identityRequestRepository.updateRequestStatus(requestId, "accepted");
    const sender = await userRepository.findUserById(request.targetSender);
    return {
      request: updatedRequest,
      senderInfo: sender ? { name: sender.name, email: sender.email } : null,
    };
  }

  return await identityRequestRepository.updateRequestStatus(requestId, "rejected");
}
