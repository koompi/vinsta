import inquirer from "inquirer";
import ora from "ora";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDB } from "../../../shells/connectDB";
import VMOptionsModel from "../../../models/vmOptionsSchema";
import { serverSchema } from "../../../models/serverSchema";
import { retrieveServer } from "../utils/retrieveServer";
import { userSchema } from "../../../models/userSchema";
import crypto from "crypto";
import axios from "axios";

const Server = mongoose.model("Server", serverSchema);
const User = mongoose.model("User", userSchema);

export async function createVirtualMachine() {
  const serverChoices = await retrieveServer();

  // Prompt user to select a server
  const { selectedServer } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedServer",
      message: "Select a Vinsta server to list all virtual machines:",
      choices: serverChoices,
    },
  ]);

  const loginaccount = await inquirer.prompt([
    {
      type: "input",
      name: "account_username",
      message: "Enter your account username:",
      default: "jiren",
    },
    {
      type: "password",
      name: "account_password",
      message: "Enter your account password:",
      mask: "*",
    },
  ]);

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the virtual machine:",
      default: "koompi-vm-1",
    },
    {
      type: "input",
      name: "iso",
      message: "Enter the ISO of the virtual machine:",
      default: "koompi",
    },
    {
      type: "input",
      name: "ram",
      message: "Enter the RAM size (in MB) of the virtual machine:",
      default: "4096",
    },
    {
      type: "input",
      name: "disk",
      message: "Enter the disk size (in GB) of the virtual machine:",
      default: "15G",
    },
    {
      type: "input",
      name: "cpu",
      message: "Enter the number of CPUs of the virtual machine:",
      default: "2",
    },
    {
      type: "input",
      name: "network",
      message: "Enter the network of the virtual machine:",
      default: "host-bridge",
    },
    {
      type: "input",
      name: "bootOption",
      message: "Enter the boot option of the virtual machine:",
      default: "uefi",
    },
    {
      type: "input",
      name: "arch",
      message: "Enter the architecture of the virtual machine:",
      default: "x64",
    },
    {
      type: "input",
      name: "vmusername",
      message: "Enter username of the virtual machine:",
      default: "admin",
    },
    {
      type: "password",
      name: "vmpassword",
      message: "Enter password of the virtual machine:",
      mask: "*",
    },
  ]);

  const spinner = ora("Creating virtual machine... Please wait. This process may take up to 1 minute.").start();

  try {
    // Connect to MongoDB
    await connectDB();

    // Authenticate user
    const user = await User.findOne({ username: loginaccount.account_username });
    if (!user) {
      spinner.fail(`User "${loginaccount.account_username}" not found.`);
      mongoose.disconnect();
      return;
    }

    const isPasswordValid = await bcrypt.compare(loginaccount.account_password, user.password || '');
    if (!isPasswordValid) {
      spinner.fail("Invalid account password.");
      mongoose.disconnect();
      return;
    }

    // Send create request to server
    const { ip, port } = selectedServer;
    const url = `http://${ip}:${port}/api/create`;

    const response = await axios.post(url, answers, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    // Check if the virtual machine was successfully created
    if (response.data.message === "VM created successfully") {
      spinner.succeed("Virtual machine created successfully"); // Stop spinner on success
      console.log(response.data);
    } else {
      spinner.fail("Failed to create virtual machine");
      console.error("Error:", response.data.error); // Assuming the API returns an error message
    }


    // Retrieve user-specific encryption information
    const encryptionInfo = user.encryptionInfo;
    if (!encryptionInfo || !encryptionInfo.salt || !encryptionInfo.iv) {
      spinner.fail("Encryption information not found or incomplete.");
      mongoose.disconnect();
      return;
    }

    // Encrypt vmpassword using the derived encryption key and iv
    const key = crypto.pbkdf2Sync(loginaccount.account_password, Buffer.from(encryptionInfo.salt, 'hex'), 100000, 32, 'sha512');
    const newCipher = crypto.createCipheriv("aes-256-cbc", key, Buffer.from(encryptionInfo.iv, 'hex'));
    let newEncryptedMasterkey = newCipher.update(answers.vmpassword, "utf8", "hex");
    newEncryptedMasterkey += newCipher.final("hex");

    // Store newEncryptedMasterkey along with other VM options
    const vmOptions = new VMOptionsModel({
      name: answers.name,
      iso: answers.iso,
      ram: answers.ram,
      disk: answers.disk,
      cpu: answers.cpu,
      network: answers.network,
      bootOption: answers.bootOption,
      arch: answers.arch,
      vmusername: answers.vmusername,
      vmpassword: `${encryptionInfo.salt}:${encryptionInfo.iv}:${newEncryptedMasterkey}`,
      ipaddr: response.data.vm.ipAddr,
    });
    await vmOptions.save();
    spinner.succeed("Virtual machine created successfully");
    console.log('Successfully inserted the VM data into the database collection');
  } catch (error) {
    spinner.fail("Error creating virtual machine");
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}
