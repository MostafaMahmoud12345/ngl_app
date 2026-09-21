import crypto from "crypto";

export async function generateCodeOtp() {
  return crypto.randomInt(1000, 9999).toString();
}
