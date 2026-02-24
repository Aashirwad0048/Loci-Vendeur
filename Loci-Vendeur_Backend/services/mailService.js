import nodemailer from "nodemailer";
import env from "../config/env.js";

const createTransporter = () => {
  if (!env.isMailerConfigured) {
    throw Object.assign(new Error("SMTP is not configured"), { statusCode: 500 });
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: env.mailFrom,
    to,
    subject: "Reset your Loci-Vendeur password",
    text: `Hi ${name || "User"},\n\nReset your password using this link:\n${resetUrl}\n\nThis link expires in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${name || "User"},</p>
        <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#111827;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;">
            Reset Password
          </a>
        </p>
        <p>If the button does not work, copy this URL:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `,
  });
};

