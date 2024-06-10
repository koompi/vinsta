import inquirer from "inquirer";
import axios from "axios";
import ora from "ora"; // Import ora library
import { getServerConfig } from "../utils/config";

export async function cloneVirtualMachine() {
  const answers = await inquirer.prompt([
    // Prompt user for input
    {
      type: "input",
      name: "sourceImage",
      message: "Enter the name of the source virtual machine to clone from:",
      default: "koompi-preinstalled-vm-1",
    },
    {
      type: "input",
      name: "name",
      message: "Enter the name of the new virtual machine:",
      default: "koompi-vm-1",
    },
    {
      type: "input",
      name: "cpu",
      message: "Enter the number of CPUs for the new virtual machine:",
      default: "2",
    },
    {
      type: "input",
      name: "ram",
      message: "Enter the RAM size (in MB) of the new virtual machine:",
      default: "4096",
    },
    {
      type: "input",
      name: "disk",
      message: "Enter the disk size (in GB) of the new virtual machine:",
      default: "20G",
    },
  ]);

  const spinner = ora("Cloning virtual machine... Please wait. This process may take up to a few minutes.").start(); // Create spinner instance

  // Read environment variables from $HOME/.vinsta/env
  const serverConfig = getServerConfig();
  if (!serverConfig) {
    spinner.fail("Failed to load server configuration.");
    return;
  }

  const { host, port } = serverConfig;
  const url = `http://${host}:${port}/api/clone`;

  try {
    const response = await axios.post(url, answers, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Check if the virtual machine was successfully cloned
    if (response.data.message === "VM cloned successfully") {
      spinner.succeed("Virtual machine cloned successfully"); // Stop spinner on success
      console.log(response.data);
    } else {
      spinner.fail("Failed to clone virtual machine"); // Stop spinner on error
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
