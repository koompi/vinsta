#!/usr/bin/env bun

import { Command } from "commander";
import inquirer from "inquirer";
import { createVirtualMachine, stopVirtualMachine, startVirtualMachine,
   removeVirtualMachine, checkInfoVirtualMachine, sshVirtualMachine,
   listallVirtualMachine, initVinsta, updateVinsta, backupVirtualMachine,
   cloneVirtualMachine, restoreVirtualMachine, runServer, statusALLVirtualMachine} from "./cmd";

const figlet = require("figlet");

const program = new Command();

// console.log(figlet.textSync("Vinsta"));

program
  .version("1.0.8")
  .description("Vinsta for managing your virtual machine")
  .option("-i, --init", "initialize Vinsta server")
  .option("  , --server", "start Vinsta server")
  .option("-c, --create", "create a new virtual machine")
  .option("  , --clone", "clone a new virtual machine instead of install a fresh one")
  .option("-s, --start", "start a virtual machine")
  .option("-o, --stop", "stop a virtual machine")
  .option("-b, --backup", "backup a virtual machine")
  .option("  , --restore", "restore a a backup virtual machine")
  .option("-r, --remove", "remove a virtual machine")
  .option("-k, --check", "check information of a virtual machine")
  .option("-l, --listall", "list all of the available virtual machine")
  .option("  , --status", "list status of all of the available virtual machine")
  .option("-u, --update", "Update Vinsta to the latest version")
  .parse(process.argv);

const options = program.opts();

// Define the actions
const actions = {
  "1. Create a new virtual machine": createVirtualMachine,
  "2. Clone a new virtual machine instead of install a fresh one": cloneVirtualMachine,
  "3. Start a virtual machine": startVirtualMachine,
  "4. Stop a virtual machine": stopVirtualMachine,
  "5. Remove a virtual machine": removeVirtualMachine,
  "6. List all of the available virtual machines": listallVirtualMachine,
  "7. Check information of a virtual machine": checkInfoVirtualMachine,
  "8. SSH into virtual machine": sshVirtualMachine,
  "8. Backup a virtual machine": backupVirtualMachine,
  "9. Restore a virtual machine from backup": restoreVirtualMachine,
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
    initVinsta();
  }
  if (options.server) {
    runServer();
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
  if (options.status) {
    statusALLVirtualMachine();
  }
  if (options.update) {
    updateVinsta();
  }
  if (options.config) {
    listallVirtualMachine();
  }
  if (options.backup) {
    backupVirtualMachine();
  }
  if (options.restore) {
    restoreVirtualMachine();
  }
}
