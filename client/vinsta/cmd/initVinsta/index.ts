import inquirer from "inquirer";
import { initializeServer } from "./server";
import { initializeClient } from "./client";



export async function initVinsta() {
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


