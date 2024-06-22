import mongoose from "mongoose";
import type { SpawnOptions } from "child_process";
import { spawn } from "child_process"
import ora from "ora";
import inquirer from "inquirer";
import crypto from "crypto";
import bcrypt from "bcrypt";

import VMOptionsModel from "../../../models/vmOptionsSchema";
import { connectDB } from "../../../shells/connectDB";
import { userSchema } from "../../../models/userSchema"; // Assuming userSchema is defined here

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

    const spinner = ora("Connecting to database...").start();

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
    spinner.succeed("Successfully connected to VM");

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

function decryptVMPassword(encryptedPassword: string, userPassword: string): string | null {
  try {
    const [salt, iv, encryptedMasterkey] = encryptedPassword.split(':');
    const key = crypto.pbkdf2Sync(userPassword, Buffer.from(salt, "hex"), 100000, 32, "sha512");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(Buffer.from(encryptedMasterkey, "hex"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
