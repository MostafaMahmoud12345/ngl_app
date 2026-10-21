import { z } from "zod";
import { Types } from "mongoose";

export const createConversationSchema = z.object({
  identityRequestId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid identityRequestId",
    }),
});

export const sendConversationMessageSchema = z.object({
  content: z.string().min(1).max(1000),
});
