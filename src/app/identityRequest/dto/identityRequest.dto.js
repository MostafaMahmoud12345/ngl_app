import { z } from "zod";
import { Types } from "mongoose";

export const createIdentityRequestSchema = z.object({
  messageId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid messageId",
    }),
});

export const respondIdentityRequestSchema = z.object({
  action: z.enum(["accept", "reject"]),
});
