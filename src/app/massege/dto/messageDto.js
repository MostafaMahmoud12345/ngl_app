import z from "zod";
import { Types } from "mongoose";
export const sendMessageSchema = z.object({
  content: z.string().min(1).max(300),
  receiver: z.string().refine((val) => {
    return Types.ObjectId.isValid(val);
  })
});
