import mongoose from "mongoose";
import ora from "ora";
import axios from "axios";
import inquirer from "inquirer";
import { retrieveServer } from "../utils/retrieveServer";


// Function to list all Vinsta servers and virtual machines
export async function statusALLVirtualMachine() {
  try {

    const serverChoices = await retrieveServer();
    // Prompt user to select a server
    const { selectedServer } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedServer",
        message: "Select a Vinsta server to list all status of virtual machines:",
        choices: serverChoices,
      },
    ]);
    const spinner = ora("Requesting all available Vinsta servers...").start();
    const { ip, port } = selectedServer;
    const url = `http://${ip}:${port}/api/status`;

    // Request to list all virtual machines from the selected server
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.message === "Successfully listall status of the virtual machine") {
      spinner.succeed("Successfully listed all virtual machines");
      console.log(response.data.table); // Display the formatted table
      mongoose.disconnect();
    } else {
      spinner.fail("Failed to list status all virtual machines");
      console.error("Server response:", response.data);
      mongoose.disconnect();
    }
  } catch (error: any) {
    if (error.response) {
      console.error(
        "Server responded with an error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error during operation:", error.message);
    }

    mongoose.disconnect();
  }
}
