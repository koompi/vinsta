import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as path from 'path';

// Dynamically form the path to your .env file
const envPath = path.resolve(__dirname, '/opt/vinsta/.env');
dotenv.config({ path: envPath });

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    // Form the MongoDB connection string using environment variables
    const { DATABASE_IP, DATABASE_PORT, DATABASE_PASSWORD } = process.env;
    const connectionString = `mongodb://admin:${DATABASE_PASSWORD}@${DATABASE_IP}:${DATABASE_PORT}/admin`;

    // Connect to MongoDB
    await mongoose.connect(connectionString, {
    });

    isConnected = true;
    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Propagate the error for handling in the calling function
  }
}
