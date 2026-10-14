import nodemailer from "nodemailer";
import { env } from "../config/env.js";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.nodemailer.user,
    pass: env.nodemailer.password,
  },
});

export async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"ngl_app" <${env.nodemailer.user}>`,
    to: to,
    subject: subject,
    html: html,
  });
}
