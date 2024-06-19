import inquirer from "inquirer";
import mongoose from "mongoose";
import { serverSchema } from "../../models/serverSchema";
import { MongoDBInit } from "./mongodb-init";
import bcrypt from "bcrypt";
import { writeServerEnvFile } from "../../../shells/writeEnvFile";

const Server = mongoose.model("Server", serverSchema);
export async function initializeServer() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the Vinsta server name you want to create:",
            default: "Vinsta-Server-1",
        },
        {
            type: "input",
            name: "ip",
            message: "Enter the host ip address:",
            default: "192.168.18.9",
        },
        {
            type: "input",
            name: "port",
            message: "Enter the port:",
            default: "3333",
        },
        {
            type: "input",
            name: "databaseip",
            message: "Enter the IP Address of the MongoDB:",
            default: "127.0.0.1",
        },
        {
            type: "input",
            name: "os",
            message: "Enter Linux Distrobution: Arch or Ubuntu",
            default: "arch",
        },
        {
            type: "input",
            name: "databaseport",
            message: "Enter the Port of the MongoDB:",
            default: "27016",
        },
        {
            type: "password",
            name: "databasepassword",
            message: "Enter the Password of the MongoDB:",
            mask: "*", // Mask input for security
        },
        {
            type: "password",
            name: "masterkey",
            message:
                "Create a master key that is used for accessing the Vinsta Server:",
            mask: "*", // Mask input for security
        },
    ]);
    try {
        await MongoDBInit({ip: answers.databaseip, port: answers.databaseport, password: answers.databasepassword, os: answers.os});
        // Connect to MongoDB
        await mongoose.connect(
            `mongodb://admin:${answers.databasepassword}@${answers.databaseip}:${answers.databaseport}/admin`);
        // {
        //   user: "admin",
        //   pass: answers.databasepassword,
        console.log("MongoDB connected successfully");

        // Hash the master key
        const hashedKey = await bcrypt.hash(answers.masterkey, 10);

        // Store hashed master key and server configuration in MongoDB
        const newServer = new Server({
            name: answers.name,
            ip: answers.ip,
            port: answers.port,
            masterKey: hashedKey,
        });

        await newServer.save();

        console.log("Successfully initialized the Vinsta Server");
        mongoose.disconnect();

        // Write to .env file
        writeServerEnvFile(answers.databaseip, answers.databaseport);
    } catch (error: any) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
}
