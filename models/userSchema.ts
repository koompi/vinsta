import mongoose from "mongoose";
// Define Schema for User Account
export const userSchema = new mongoose.Schema({
    name: String,
    number: String,
    // Add more fields as needed (e.g., email, address, etc.)
  });