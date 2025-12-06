import mongoose from "mongoose";

export const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected!");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected host : " + conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
