import IdentityRequest from "../model/identityRequest.model.js";

export async function createIdentityRequest(messageId, requester, targetSender) {
  return await IdentityRequest.create({
    message: messageId,
    requester,
    targetSender,
  });
}

export async function findRequestByMessage(messageId) {
  return await IdentityRequest.findOne({ message: messageId });
}

export async function getRequestsByTargetSender(targetSenderId) {
  return await IdentityRequest.find({ targetSender: targetSenderId })
    .populate({ path: "requester", select: "name" })
    .populate({ path: "message", select: "content" });
}

export async function findRequestById(id) {
  return await IdentityRequest.findById(id);
}

export async function updateRequestStatus(id, status) {
  return await IdentityRequest.findByIdAndUpdate(id, { status }, { new: true });
}
