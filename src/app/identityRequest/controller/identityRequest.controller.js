import * as identityRequestService from "../service/identityRequest.service.js";
import { validateBody } from "../../../lib/validation/validation.js";
import {
  createIdentityRequestSchema,
  respondIdentityRequestSchema,
} from "../dto/identityRequest.dto.js";

export async function requestSenderIdentity(req, res, next) {
  try {
    const data = await validateBody(createIdentityRequestSchema, req.body);
    const { messageId } = data;
    const requesterId = req.user?.id;
    const newRequest = await identityRequestService.requestSenderIdentity(messageId, requesterId);
    res.status(201).json({
      message: "Identity request sent successfully",
      success: true,
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyRequests(req, res, next) {
  try {
    const targetSenderId = req.user?.id;
    const requests = await identityRequestService.getMyRequests(targetSenderId);
    res.status(200).json({
      message: "Identity requests retrieved successfully",
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
}

export async function respondToRequest(req, res, next) {
  try {
    const data = await validateBody(respondIdentityRequestSchema, req.body);
    const { action } = data;
    const requestId = req.params.id;
    const currentUserId = req.user?.id;
    const result = await identityRequestService.respondToRequest(requestId, currentUserId, action);
    res.status(200).json({
      message: `Request ${action === "accept" ? "accepted" : "rejected"} successfully`,
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
