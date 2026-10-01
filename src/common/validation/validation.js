import { z } from "zod";
import { AppError } from "../error.js";
export function validateBody(dto, body) {
  const result = z.safeParse(dto,body);
  if (result.success === false) {
    const errorMessage = result.error.issues.map(
      (issue) => `${issue.path[0]}:${issue.message}`,
    );
    throw new AppError(errorMessage.join(","), 400);
  }
  return result.data;
}
