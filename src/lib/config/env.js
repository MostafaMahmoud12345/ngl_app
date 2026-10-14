import { z } from "zod";
import { config } from "dotenv";
config();
const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGODB_URL: z.string(),
  EMAIL_USER: z.string().toLowerCase().trim(),
  EMAIL_PASSWORD: z.string(),
  JWT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().default("6379"),
  REDIS_PASSWORD: z.string(),
  MAILJET_API_KEY: z.string(),
  MAILJET_API_SECRET: z.string(),
  MAILJET_FROM_EMAIL: z.string(),
  MAILJET_FROM_NAME: z.string(),
});

const parsed = envSchema.parse(process.env);

export const env = {
  port: parseInt(parsed.PORT, 10),
  db: {
    url: parsed.MONGODB_URL,
  },
  nodemailer: {
    user: parsed.EMAIL_USER,
    password: parsed.EMAIL_PASSWORD,
  },
  mailjet: {
    apiKey: parsed.MAILJET_API_KEY,
    apiSecret: parsed.MAILJET_API_SECRET,
    fromEmail: parsed.MAILJET_FROM_EMAIL,
    fromName: parsed.MAILJET_FROM_NAME,
  },
  jwt: {
    secret: parsed.JWT_SECRET,
  },
  redis: {
    host: parsed.REDIS_HOST,
    port: parseInt(parsed.REDIS_PORT, 10),
    password: parsed.REDIS_PASSWORD,
  },
  google: {
    clientId: parsed.GOOGLE_CLIENT_ID,
  },
};
