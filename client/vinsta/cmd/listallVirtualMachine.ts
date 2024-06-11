import { getServerConfig } from "../utils/config";
import ora from 'ora';
import axios from "axios";

export async function listallVirtualMachine() {
  const spinner = ora("Requesting all of the virtual machine available ...").start(); // Start spinner instance
  
  // Read environment variables from $HOME/.vinsta/env
  const serverConfig = getServerConfig();
  if (!serverConfig) {
    spinner.fail("Failed to load server configuration");
    return;
  }

  const { host, port } = serverConfig;
  const url = `http://${host}:${port}/api/listall`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.data.message === "Successfully listall the virtual machine") {
      spinner.succeed("Successfully listed all virtual machines");
      console.log(response.data.table); // Display the formatted table
    } else {
      spinner.fail("Failed to list virtual machines");
      console.error("Server response:", response.data);
    }
  } catch (error: any) {
    spinner.fail("Error sending request to the server");
    if (error.response) {
      console.error("Server responded with an error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error sending request to the server:", error.message);
    }
  }
}