import mongoose from "mongoose";
import ora from "ora";
import inquirer from "inquirer";
import Table from 'cli-table3';
import { retrieveServer } from "../utils/retrieveServer";
import { connectDB } from '../../../shells/connectDB';
import VMOptionsModel from '../../../models/vmOptionsSchema';

// Function to list all Vinsta servers and virtual machines
export async function listallVirtualMachine() {
  try {

    const spinner = ora("Requesting all available Vinsta servers...\n").start();

    // Connect to MongoDB
    await connectDB();

    // Retrieve all virtual machines from the database
    const vmList = await VMOptionsModel.find();

    // Define column widths to prevent truncation
    const nameWidth = 30; // Increased name column width
    const isoWidth = 20;
    const ramWidth = 10;
    const diskWidth = 10;
    const cpuWidth = 5;
    const networkWidth = 15;
    const osVariantWidth = 15;
    const bootOptionWidth = 10;
    const archWidth = 10;
    const usernameWidth = 15;
    const ipWidth = 20; // Increased IP address column width

    // Create a new table instance
    const table = new Table({
      head: ['Name', 'ISO', 'RAM', 'Disk', 'CPU', 'Network', 'OS Variant', 'Boot Option', 'Arch', 'Username', 'IP Address'],
      colWidths: [nameWidth, isoWidth, ramWidth, diskWidth, cpuWidth, networkWidth, osVariantWidth, bootOptionWidth, archWidth, usernameWidth, ipWidth],
    });

    // Process each VM and add to the table
    vmList.forEach(vm => {
      table.push([vm.name, vm.iso, vm.ram, vm.disk, vm.cpu, vm.network, vm.osVariant, vm.bootOption, vm.arch, vm.vmusername, vm.ipaddr]);
    });

    spinner.succeed("Successfully listed all virtual machines");
    console.log(table.toString()); // Display the formatted table

    // Close the MongoDB connection
    mongoose.disconnect();
  } catch (error: any) {
    if (error.response) {
      console.error("Server responded with an error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error during operation:", error.message);
    }

    mongoose.disconnect();
  }
}
