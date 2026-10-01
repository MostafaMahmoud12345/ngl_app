import { z } from 'zod';

export const registerDto = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email().lowercase().trim(),
  password: z.string().min(5).max(20).trim(),
});

export const loginDto = z.object({
  email: z.string().email().lowercase().trim(),
  password: z.string().min(5).max(20).trim(),
});

export const sendOtpDto = z.object({
  email: z.string().email().lowercase().trim(),
});

export const verifyOtpDto = z.object({
  email: z.string().email().lowercase().trim(),
  code: z.string().length(4).trim(),
});

export const resetPasswordDto = z.object({
  email: z.string().email().lowercase().trim(),
  code: z.string().length(4).trim(),
  newPassword: z.string().min(5).max(20).trim(),
});