import mongoose from "mongoose";

// Define Schema for Server Configuration
export const serverSchema = new mongoose.Schema({
    name: String,
    ip: String,
    port: Number,
    masterKey: String, // Store the hashed master key here
  });