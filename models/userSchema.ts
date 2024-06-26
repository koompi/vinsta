import mongoose, { Schema } from "mongoose";

// Define an embedded schema for encryption information
const encryptionSchema = new Schema({
  salt: String,
  iv: String,
});

// Define the main user schema
export const userSchema = new mongoose.Schema({
  username: String,
  number: String,
  password: String,
  masterkey: String,
  telegramChatID: String,
  encryptionInfo: encryptionSchema, // Embed the encryption schema here
});

// Define the User model based on userSchema
const User = mongoose.model("User", userSchema);

export default User;
