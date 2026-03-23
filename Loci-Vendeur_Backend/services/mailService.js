import nodemailer from "nodemailer";
import env from "../config/env.js";

const createTransporter = () => {
  if (!env.isMailerConfigured) {
    throw Object.assign(new Error("SMTP is not configured"), { statusCode: 500 });
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
};

const parseMailFrom = (mailFrom) => {
  const match = String(mailFrom || "").match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    return {
      name: match[1].replace(/^"|"$/g, "").trim() || undefined,
      email: match[2].trim(),
    };
  }

  return {
    email: String(mailFrom || "").trim(),
  };
};

const sendViaBrevo = async ({ to, name, resetUrl }) => {
  const sender = parseMailFrom(env.mailFrom);
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": env.brevoApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender,
      to: [{ email: to, name: name || "User" }],
      subject: "Reset your Loci-Vendeur password",
      textContent: `Hi ${name || "User"},\n\nReset your password using this link:\n${resetUrl}\n\nThis link expires in 15 minutes.`,
      htmlContent: `
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
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw Object.assign(new Error(`Brevo API error (${response.status}): ${details}`), {
      statusCode: 502,
    });
  }
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  if (env.isBrevoConfigured) {
    await sendViaBrevo({ to, name, resetUrl });
    return;
  }

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
