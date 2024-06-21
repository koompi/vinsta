import inquirer from "inquirer";
import { getServerConfig } from "../../utils/config";
import ora from "ora";
import axios from "axios";
import { spawn } from "child_process";
import type { SpawnOptions } from "child_process";

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

    const spinner = ora("Sending request...").start();

    const serverConfig = getServerConfig();
    if (!serverConfig) {
      throw new Error("Failed to load server configuration.");
    }

    const { host, port } = serverConfig;
    const url = `http://${host}:${port}/api/checkinfo`;

    const response = await axios.post(url, { name: answers.name }, {
      headers: { "Content-Type": "application/json" }
    });

    if (response.data.message === "Checking info of the virtual machine") {
      spinner.succeed("Got IP Address of the domain");

      const ipAddress = response.data.vm.vmInfo.ipAddress;
      const sshCommand = `sshpass -p '${answers.password}' ssh ${answers.username}@${ipAddress}`;

      const options: SpawnOptions = {
        shell: true,
        stdio: "inherit",
      };

      const sshProcess = spawn(sshCommand, [], options);
      sshProcess.on('close', (code) => {
        if (code === 0) {
          spinner.succeed("Successfully connected to VM");
          process.exit(); // Stop the CLI tool
        } else {
          spinner.fail("Failed to connect to VM");
        }
      });
    } else {
      spinner.fail("Failed to ssh into virtual machine");
      console.error("Server response:", response.data);
    }
  } catch (error: any) {
    ora().fail("An error occurred");
    if (error.response) {
      console.error("Server responded with an error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
}
