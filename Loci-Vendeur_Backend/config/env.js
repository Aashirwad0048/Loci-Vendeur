import "dotenv/config";

const requiredKeys = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_EXPIRE",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "CLIENT_URL",
  "COMMISSION_RATE",
];

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "7d",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  clientUrl: process.env.CLIENT_URL,
  commissionRate: Number(process.env.COMMISSION_RATE || 0.03),
  escrowAutoReleaseEnabled: process.env.ESCROW_AUTO_RELEASE_ENABLED !== "false",
  escrowAutoReleaseHoldHours: Number(process.env.ESCROW_AUTO_RELEASE_HOLD_HOURS || 24),
  escrowAutoReleaseIntervalMs: Number(process.env.ESCROW_AUTO_RELEASE_INTERVAL_MS || 60000),
  escrowAutoReleaseBatchSize: Number(process.env.ESCROW_AUTO_RELEASE_BATCH_SIZE || 50),
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  mailFrom: process.env.MAIL_FROM || "noreply@loci-vendeur.local",
  orsApiKey: process.env.ORS_API_KEY || "",
  geocodeUserAgent: process.env.GEOCODE_USER_AGENT || "loci-vendeur-backend/1.0",
  mailFallbackToConsole: process.env.MAIL_FALLBACK_TO_CONSOLE === "true",
};

env.isMailerConfigured = Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

export default env;
