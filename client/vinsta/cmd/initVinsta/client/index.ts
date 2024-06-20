import inquirer from "inquirer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { writeClientEnvFile } from "../../../shells/writeEnvFile";
import { userSchema } from "../../models/userSchema";
import { serverSchema } from "../../models/serverSchema";

// Model for User Account
const User = mongoose.model("User", userSchema);
const Server = mongoose.model("Server", serverSchema);


export async function initializeClient() {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Create your own nickname:",
        default: "jiren",
      },
      {
        type: "input",
        name: "number",
        message: "Enter your mobile phone number:",
        default: "85515780491",
      },
      {
        type: "input",
        name: "databaseip",
        message: "Enter the IP Address of the MongoDB:",
        default: "127.0.0.1",
      },
      {
        type: "input",
        name: "databaseport",
        message: "Enter the Port of the MongoDB:",
        default: "27016",
      },
      {
        type: "input",
        name: "databasepassword",
        message: "Enter the Password of the MongoDB:",
        default: "zxcvahsdkjfqwer",
      },
      {
        type: "password",
        name: "masterkey",
        message:
          "Enter the master key that is used for accessing the Vinsta Server:",
        mask: "*", // Mask input for security
      },
    ]);
  
    try {
      // Connect to MongoDB
      await mongoose.connect(
        `mongodb://admin:${answers.databasepassword}@${answers.databaseip}:${answers.databaseport}/admin`);

  
      // Retrieve server details from MongoDB
      const serverDetails = await Server.findOne({});
  
      if (!serverDetails) {
        console.error("Server details not found in MongoDB.");
        mongoose.disconnect();
        return;
      }
  
      // Compare provided master key with stored hashed key
      const isMatch = await bcrypt.compare(
        answers.masterkey,
        serverDetails.masterKey || ""
      );
      if (!isMatch) {
        console.error("Invalid master key.");
        mongoose.disconnect();
        return;
      }
  
      // Proceed with account creation or login
      console.log("Master key verified. Creating account or logging in...");
  
      // Check if the user already exists
      let user = await User.findOne({ name: answers.name });
  
      if (!user) {
        // Create a new user account if it doesn't exist
        user = new User({
          name: answers.name,
          number: answers.number,
          // Add more fields as needed
        });
  
        await user.save();
        console.log(`New account created for ${answers.name}`);
      // Write to .env file
      writeClientEnvFile(answers.databaseip, answers.databaseport, answers.databasepassword);
      } else {
        console.log(`Username already existed: ${answers.name}`);
      }
  
      mongoose.disconnect(); // Disconnect from MongoDB
    } catch (error) {
      console.error("Error during initialization:", error);
      mongoose.disconnect();
    }
  }
  