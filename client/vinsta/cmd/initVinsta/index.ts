import inquirer from "inquirer";
import { initializeServer } from "./server";
import { initializeClient } from "./client";
import { spawnSync } from "child_process";
import chalk from "chalk";

// Function to check for sudo privileges
function hasSudo(): boolean {
  const result = spawnSync("sudo", ["-n", "true"]);
  return result.status === 0;
}

export async function initVinsta() {
  if (!hasSudo()) {
    console.error(chalk.red("Error: To initialize requires sudo privileges to proceed."));
    console.log("Please rerun program using:");
    console.log(chalk.green("sudo vinsta --init"));
    console.log("Alternatively, you can also run with:");
    console.log(chalk.green("sudo !!"));
    process.exit(1); // Exit with an error code
  }

  const { initOption } = await inquirer.prompt([
    {
      type: "list",
      name: "initOption",
      message: "Select an option to initialize:",
      choices: ["Server", "Client"],
    },
  ]);

  if (initOption === "Server") {
    await initializeServer();
  } else if (initOption === "Client") {
    await initializeClient();
  }
}
