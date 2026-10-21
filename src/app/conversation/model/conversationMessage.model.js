import { Schema, model } from "mongoose";

const conversationMessageSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ConversationMessage = model(
  "ConversationMessage",
  conversationMessageSchema
);
export default ConversationMessage;
