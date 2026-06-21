import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8080),
  mongoUri: process.env.MONGODB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || "7d",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
};

if (!env.mongoUri || !env.jwtAccessSecret) {
  throw new Error("Missing required environment variables.");
}
