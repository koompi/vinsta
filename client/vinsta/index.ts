#!/usr/bin/env bun

import { Command } from "commander";
import inquirer from "inquirer";
import { createVirtualMachine, stopVirtualMachine, startVirtualMachine,
   removeVirtualMachine, checkInfoVirtualMachine, sshVirtualMachine,
   listallVirtualMachine, initVinsta, updateVinsta, 
   cloneVirtualMachine} from "./cmd";

const figlet = require("figlet");

const program = new Command();

// console.log(figlet.textSync("Vinsta"));

program
  .version("1.0.8")
  .description("Vinsta for managing your virtual machine")
  .option("-i, --init", "Connect to the Vinsta server")
  .option("-c, --create", "Create a new virtual machine")
  .option("-s, --start", "Start a virtual machine")
  .option("-o, --stop", "Stop a virtual machine")
  .option("-r, --remove", "Remove a virtual machine")
  .option("-k, --check", "Check information of a virtual machine")
  .option("-l, --listall", "List all of the available virtual machine")
  .option("-u, --update", "Update Vinsta to the latest version")
  .parse(process.argv);

const options = program.opts();

// Define the actions
const actions = {
  "1. Connect to your Vinsta server": initVinsta,
  "2. Create a new virtual machine": createVirtualMachine,
  "3. Clone a new virtual machine instead of install a fresh one": cloneVirtualMachine,
  "4. Start a virtual machine": startVirtualMachine,
  "5. Stop a virtual machine": stopVirtualMachine,
  "6. SSH into virtual machine": sshVirtualMachine,
  "7. Remove a virtual machine": removeVirtualMachine,
  "8. Check information of a virtual machine": checkInfoVirtualMachine,
  "9. List all of the available virtual machines": listallVirtualMachine,
};

// Define the type for the actions keys
type ActionKey = keyof typeof actions;

// If no options are provided, display the interactive menu
if (process.argv.length <= 2) {
  inquirer.prompt<{ action: ActionKey }>([
    {
      type: "list",
      name: "action",
      message: "Choose an action",
      choices: Object.keys(actions) as ActionKey[],
    },
  ]).then((answers) => {
    const action = answers.action;
    actions[action]().catch((error: any) => {
      console.error(`Error during ${action.toLowerCase()}:`, error);
    });
  }).catch((error) => {
    console.error("Error during prompting:", error);
  });
} else {
  if (options.init) {
    initVinsta().catch((error) => {
      console.error("Error during initialization:", error);
    });
  }
  if (options.create) {
    createVirtualMachine();
  }
  if (options.clone) {
    cloneVirtualMachine();
  }
  if (options.start) {
    startVirtualMachine();
  }
  if (options.stop) {
    stopVirtualMachine();
  }
  if (options.remove) {
    removeVirtualMachine();
  }
  if (options.check) {
    checkInfoVirtualMachine();
  }
  if (options.listall) {
    listallVirtualMachine();
  }
  if (options.update) {
    updateVinsta();
  }
  if (options.config) {
    listallVirtualMachine();
  }
}
