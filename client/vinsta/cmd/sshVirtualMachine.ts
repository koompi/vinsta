import mongoose from "mongoose";
import ora from "ora";
import inquirer from "inquirer";
import bcrypt from "bcrypt";
import { spawn } from "child_process"; // Correct import for SpawnOptions
import type { SpawnOptions } from "child_process";
import { decryptVMPassword } from "../utils/decryption";
import VMOptionsModel from "../../../models/vmOptionsSchema";
import { connectDB } from "../../../shells/connectDB";
import { userSchema } from "../../../models/userSchema";
import { sendOTP } from "../utils/verification/telegram/sendOTP";
import { verifyOTP } from "../utils/verification/telegram/verifyOTP";

import promptSync from 'prompt-sync';
const prompt = promptSync();

export async function sshVirtualMachine() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "username",
        message: "Enter your account username:",
        default: "jiren",
      },
      {
        type: "password",
        name: "password",
        message: "Enter your account password:",
        mask: "*",
      },
      {
        type: "input",
        name: "name",
        message: "Enter the name of the virtual machine:",
        default: "koompi-vm-1",
      },
    ]);

    const spinner = ora("Authorizing user... \n").start();

    // Connect to MongoDB
    await connectDB();

    // Retrieve user details to get the encryption information
    const User = mongoose.model("User", userSchema);
    const user = await User.findOne({ username: answers.username });

    if (!user) {
      spinner.fail(`User "${answers.username}" not found.`);
      mongoose.disconnect();
      return;
    }

    // Authenticate user
    const isPasswordValid = await bcrypt.compare(answers.password, user.password || '');
    if (!isPasswordValid) {
      spinner.fail("Invalid account password.");
      mongoose.disconnect();
      return;
    }

    // Send OTP via Telegram bot
    const chatId = user.telegramChatID; // Assuming you have stored chatId in your user schema
    await sendOTP(chatId as string);

    // Wait for user to input the OTP they received
    const otpAnswer = prompt('Enter the OTP you received: ').trim(); // Ensure OTP input is trimmed

    try {
      // Verify OTP using the provided input
      const isValidOTP = await verifyOTP(chatId as string, otpAnswer);
      if (isValidOTP === "Invalid OTP") {
        spinner.fail("Failed to verify OTP. Access denied.");
        mongoose.disconnect();
        return;
      }
    } catch (error) {
      spinner.fail("Failed to verify OTP. Access denied.");
      mongoose.disconnect();
      return;
    }


    const vmDetails = await VMOptionsModel.findOne({ name: answers.name });
    if (!vmDetails) {
      spinner.fail("Virtual machine not found.");
      mongoose.disconnect();
      return;
    }

    // Decrypt vmpassword from vmDetails using user's login password
    const vmpassword = decryptVMPassword(vmDetails.vmpassword, answers.password);
    if (!vmpassword) {
      spinner.fail("Failed to decrypt VM password.");
      mongoose.disconnect();
      return;
    }

    const { vmusername, ipaddr } = vmDetails;
    const sshCommand = `sshpass -p '${vmpassword}' ssh ${vmusername}@${ipaddr}`;

    const options: SpawnOptions = {
      shell: true,
      stdio: "inherit",
    };

    const sshProcess = spawn(sshCommand, [], options);
    spinner.succeed("Authorized... \n Now ready to SSH into the VM");

    sshProcess.on("close", (code) => {
      if (code !== 0) {
        spinner.fail("Failed to connect to VM");
      }
      mongoose.disconnect();
      process.exit(); // Stop the CLI tool
    });
  } catch (error: any) {
    console.error("An error occurred:", error.message);
    mongoose.disconnect();
  }
}

