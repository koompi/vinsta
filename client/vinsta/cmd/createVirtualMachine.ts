import inquirer from "inquirer";
import axios from "axios";
import ora from "ora"; // Import ora library
import { retrieveServer } from "../utils/retrieveServer";
import { connectDB } from '../../../shells/connectDB';
import VMOptionsModel from '../../../models/vmOptionsSchema';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

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

  // Prompt user for input
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
      name: "username",
      message: "Enter username of the virtual machine:",
      default: "admin",
    },
    {
      type: "password",
      name: "password",
      message: "Enter password of the virtual machine:",
      mask: "*",
    },
  ]);

  const spinner = ora("Creating virtual machine... Please wait. This process may take up to 1 minute.\n").start(); // Create spinner instance

  try {
    // Connect to MongoDB
    await connectDB();

    // Check if VM already exists in the database
    const existingVM = await VMOptionsModel.findOne({ name: answers.name });
    if (existingVM) {
      spinner.fail(`Virtual machine "${answers.name}" already exists in the database.`);
      mongoose.disconnect();
      return;
    }

    const { ip, port } = selectedServer;
    const url = `http://${ip}:${port}/api/create`;

    // Send create request to server
    const response = await axios.post(url, answers, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Check if the virtual machine was successfully created
    if (response.data.message === "VM created successfully") {
      spinner.succeed("Virtual machine created successfully"); // Stop spinner on success
      console.log(response.data);

      // Hash the master key
      // const hashedPassword = await bcrypt.hash(answers.password, 10);

      // Create VM options document
      const vmOptions = new VMOptionsModel({
        name: answers.name,
        iso: answers.iso,
        ram: answers.ram,
        disk: answers.disk,
        cpu: answers.cpu,
        network: answers.network,
        osVariant: answers.osVariant,
        bootOption: answers.bootOption,
        arch: answers.arch,
        username: answers.username,
        // password: hashedPassword,
        password: answers.password,
        ipaddr: response.data.vm.ipAddr, 
      });

      // Save VM options to MongoDB
      await vmOptions.save();
      console.log('Successfully inserted the VM data into database collection');

      mongoose.disconnect();

    } else {
      spinner.fail("Failed to create virtual machine"); // Stop spinner on error
      console.error("Server response:", response.data);
      mongoose.disconnect();
    }
  } catch (error: any) {
    spinner.fail("Error sending request to the server"); // Stop spinner on error
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Server responded with an error:", error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error("No response received from the server:", error.request);
    } else {
      // Something else caused the error
      console.error("Error sending request to the server:", error.message);
    }
    mongoose.disconnect();
  }
}
