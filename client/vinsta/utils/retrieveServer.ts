import mongoose from 'mongoose';
import { serverSchema } from "../cmd/models/serverSchema";
import dotenv from 'dotenv';
import * as path from 'path';


// Dynamically form the path to your .env file
const envPath = path.resolve(__dirname, '/opt/vinsta/client/vinsta/.env');
dotenv.config({ path: envPath });
// Model for Server
const Server = mongoose.model("Server", serverSchema);

export async function retrieveServer() {
  try {
    // Form the MongoDB connection string using environment variables
    const { DATABASE_IP, DATABASE_PORT, DATABASE_NAME } = process.env;
    // Connect to MongoDB
    await mongoose.connect(`mongodb://${DATABASE_IP}:${DATABASE_PORT}/vinstadb`);
    console.log("MongoDB connected successfully");

    // Retrieve all servers from the database
    const servers = await Server.find({});

    if (servers.length === 0) {
      console.log("No Vinsta servers found in the database");
      mongoose.disconnect();
      return [];
    }

    // Prepare server choices for inquirer
    const serverChoices = servers.map((server) => ({
      name: server.name,
      value: server,
    }));

    mongoose.disconnect();
    return serverChoices;
  } catch (error) {
    console.error("Error retrieving servers:", error);
    mongoose.disconnect();
    return [];
  }
}
