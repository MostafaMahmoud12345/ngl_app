import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    originalMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    identityRequest: {
      type: Schema.Types.ObjectId,
      ref: "IdentityRequest",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Conversation = model("Conversation", conversationSchema);
export default Conversation;
