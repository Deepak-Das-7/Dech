import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const MONGO = process.env.MONGO_URI;
  if (!MONGO) {
    console.error("❌ MONGO_URI is not defined");
    return process.exit(1);
  }

  try {
    await mongoose.connect(MONGO);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
