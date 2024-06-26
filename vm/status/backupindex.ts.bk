import { executeCommand } from "../../shells/executeCommand";
import { getIpAddressFromMac } from "../../client/vinsta/shells/getIpAddressFromMac";
import Table from 'cli-table3';

interface VirtualMachine {
  id: string;
  name: string;
  state: string;
  ip: string;
}

export const listAllVirtualMachines = async (): Promise<string> => {
  try {
    // Use virsh list --all to list all virtual machines
    const vmListOutput = await executeCommand(`virsh list --all`);
    const rows = vmListOutput.trim().split('\n'); // Split output into rows

    // Define larger column widths to prevent truncation
    const idWidth = 5;
    const nameWidth = 30; // Increased name column width
    const stateWidth = 15; // Increased state column width
    const ipWidth = 20; // Increased IP address column width

    // Create a new table instance
    const table = new Table({
      head: ['ID', 'Name', 'Status', 'IP Address'],
      colWidths: [idWidth, nameWidth, stateWidth, ipWidth],
    });

    // Process each row starting from the second row (skipping header)
    for (let i = 2; i < rows.length; i++) {
      const columns = rows[i].trim().split(/\s+/); // Split row into columns
      const id = columns[0];
      const name = columns[1];
      const state = columns[2];
      let ip: string = 'undefined'; // Default value for IP address
      if (columns[2] === 'running') {
        const ipAddress = await getIpAddressFromMac(columns[1]); // Get IP address only if the machine is running
        if (ipAddress) {
          ip = ipAddress; // Assign IP address only if it's available
        }
      }
      // Push row data to the table
      table.push([id, name, state, ip]);
    }

    // Return the table as a string
    return table.toString();
  } catch (error) {
    console.error("An error occurred:", (error as Error).message);
    throw new Error("Failed to list all virtual machines");
  }
};