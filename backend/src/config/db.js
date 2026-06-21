import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDb = async () => {
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
};
