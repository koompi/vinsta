import inquirer from "inquirer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userSchema } from "../models/userSchema";
import { serverSchema } from "../models/serverSchema";
import express from "express";
import { initializeServer } from "./server";
import { initializeClient } from "./client";

// Model for User Account
const User = mongoose.model("User", userSchema);
const Server = mongoose.model("Server", serverSchema);

const app = express();

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


