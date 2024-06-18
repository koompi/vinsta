import inquirer from "inquirer";
import ora from "ora";
import axios from "axios";
import response from "express";
import { retrieveServer } from "../utils/retrieveServer";

export async function removeVirtualMachine() {
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

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the virtual machine:",
      default: "koompi-vm-1",
    },
  ]);
  const spinner = ora("Sending request...").start(); // Start spinner instance

  const { ip, port } = selectedServer;
  const url = `http://${ip}:${port}/api/remove`;

  try {
    const response = await axios.post(url, answers, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the virtual machine was successfully removed
    if (response.data.message === "VM successfully removed") {
      spinner.succeed("Virtual machine removed successfully"); // Stop spinner on success
    } else {
      spinner.fail("Failed to remove virtual machine"); // Stop spinner on error
      console.error("Server response:", response.data);
    }
  } catch (error: any) {
    spinner.fail("Error sending request to the server"); // Stop spinner on error
    if (error.response === 500) {
      spinner.fail("Failed to remove virtual machine"); // Stop spinner on error
      console.error("Server response:", response);
    }
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error(
        "Server responded with an error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // No response received
      console.error("No response received from the server:", error.request);
    } else {
      // Something else caused the error
      console.error("Error sending request to the server:", error.message);
    }
  }
}
