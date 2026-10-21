import { Router } from "express";
import * as identityRequestController from "./controller/identityRequest.controller.js";
import { guard } from "../../lib/auth/guard.js";

const identityRequestRouter = Router();

identityRequestRouter.post("/", guard, identityRequestController.requestSenderIdentity);
identityRequestRouter.get("/", guard, identityRequestController.getMyRequests);
identityRequestRouter.patch("/:id/respond", guard, identityRequestController.respondToRequest);

export default identityRequestRouter;
