import { InternalServerError } from "@/shared/errors/http-error.js";
import mongoose from "mongoose";

export async function connectDB() {
  try {
    // const uri = process.env.MONGO_URI as string;
    const uri =
      "mongodb+srv://sitelabmanager:sitelabmanager5348@cluster0.uluvlcy.mongodb.net/sitelab?appName=Cluster0";

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    process.exit(1);
    // throw new InternalServerError("DB failure");
  }
}
