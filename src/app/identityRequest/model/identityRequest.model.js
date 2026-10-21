import { Schema, model } from "mongoose";

const identityRequestSchema = new Schema(
  {
    message: { type: Schema.Types.ObjectId, ref: "Message", required: true },
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetSender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const IdentityRequest = model("IdentityRequest", identityRequestSchema);
export default IdentityRequest;
