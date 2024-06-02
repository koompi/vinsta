import inquirer from "inquirer";
import axios from "axios";
import ora from "ora"; // Import ora library
import { getServerConfig } from "../utils/config";

export async function createVirtualMachine() {
  

  const answers = await inquirer.prompt([
    // Prompt user for input
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
      default: "br10",
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
  ]);
  const spinner = ora("Sending request...").start(); // Create spinner instance

  // Read environment variables from $HOME/.vinsta/env
  const serverConfig = getServerConfig();
  if (!serverConfig) {
    return;
  }

  const { host, port } = serverConfig;
  const url = `http://${host}:${port}/api/create`;


  try {
    const response = await axios.post(url, answers, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    // Check if the virtual machine was successfully removed
    if (response.data.message === "VM created successfully") {
      spinner.succeed("Virtual machine created successfully"); // Stop spinner on success
      console.log(response.data);
    } else {
      spinner.fail("Failed to create virtual machine"); // Stop spinner on error
      console.error("Server response:", response.data);
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
  }
}
