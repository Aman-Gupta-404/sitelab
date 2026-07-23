import { InternalServerError } from "@/shared/errors/http-error.js";
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI as string;

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    process.exit(1);
    // throw new InternalServerError("DB failure");
  }
}
