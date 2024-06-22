import inquirer from "inquirer";
import axios from "axios";
import { spawn } from "child_process";
import type { SpawnOptions } from "child_process";
import { sendOTP } from "../utils/verification/telegram/sendOTP";
import { verifyOTP } from "../utils/verification/telegram/verifyOTP";
import mongoose from "mongoose";
import { userSchema } from "../../../models/userSchema";
import VMOptionsModel from "../../../models/vmOptionsSchema";
import { connectDB } from "../../../shells/connectDB";
import promptSync from "prompt-sync";
import ora from "ora";

const User = mongoose.model("User", userSchema);
const prompt = promptSync();

export async function sshVirtualMachine() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the virtual machine:",
        default: "koompi-vm-1",
      },
      {
        type: "input",
        name: "username",
        message: "Enter your account username:",
        default: "jiren",
      },
    ]);

    const spinner = createSpinner("Connecting to database...\n");

    await connectDB();

    // Retrieve VM details
    const vmDetails = await VMOptionsModel.findOne({ name: answers.name });
    if (!vmDetails) {
      spinner.fail("Virtual machine not found.");
      mongoose.disconnect();
      return;
    }

    // Retrieve User details
    const userDetails = await User.findOne({ username: answers.username });
    if (!userDetails) {
      spinner.fail("User not found.");
      mongoose.disconnect();
      return;
    }

    const chatId = userDetails.telegramChatID;
    if (!chatId) {
      spinner.fail("User does not have a Telegram chat ID.");
      mongoose.disconnect();
      return;
    }

    // Send OTP
    await sendOTP(chatId);

    // Prompt user to enter the OTP
    const userOtp = prompt("Enter the OTP you received: ");

    // Verify OTP
    const isValid = await verifyOTP(chatId, userOtp);
    if (!isValid) {
      spinner.fail("Invalid OTP.");
      mongoose.disconnect();
      return;
    }

    // // Form SSH command
    const { username, ipaddr, password } = vmDetails;
    const sshCommand = `sshpass -p '${password}' ssh ${username}@${ipaddr}`;

    // Start SSH process
    const options: SpawnOptions = {
      shell: true,
      stdio: "inherit",
    };

    const sshProcess = spawn(sshCommand, [], options);
    spinner.succeed("Successfully connected to VM");

    sshProcess.on("close", (code) => {
      if (code !== 0) {
        spinner.fail("Failed to connect to VM");
      }
      mongoose.disconnect();
      process.exit(); // Stop the CLI tool
    });
  } catch (error: any) {
    createSpinner().fail("An error occurred");
    if (error.response) {
      console.error("Server responded with an error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    mongoose.disconnect();
  }
}

function createSpinner(text: string = "") {
  return ora(text).start();
}
