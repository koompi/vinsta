import type { VMOptions } from '../../types/VMOptionsType';
import { getStatusFromOutput } from '../../shells/getStatusFromOutput';
import { executeCommand } from '../../shells/executeCommand';
import { delay } from '../../utils/delay';
import { getIpAddressFromMac } from '../../client/vinsta/shells/getIpAddressFromMac';
import Table from 'cli-table3';

export const checkInfoVirtualMachine = async (options: VMOptions): Promise<string> => {
    const { name = "koompi" } = options;

    try {
        // Check if VM exists
        const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
        if (!vmExistsOutput.includes("Name:")) {
            throw new Error(`Virtual machine "${name}" not found`);
        }

        // Check VM state
        const vmStateOutput = await executeCommand(`virsh domstate ${name}`);
        if (!vmStateOutput.includes("running")) {
            console.log(`Virtual machine "${name}" is not running. Starting...`);
            await executeCommand(`virsh start ${name}`);

            // Wait for a short period to allow VM to start
            console.log("Waiting for VM to start...");
            await delay(10000); // Wait 10 seconds (adjust as needed)
        }

        // Get the IP address of the VM (assuming successful start)
        const ipAddress = await getIpAddressFromMac(name);

        // Get VM details
        const vmInfoOutput = await executeCommand(`virsh dominfo ${name}`);

        // Extract relevant information
        const lines = vmInfoOutput.split('\n');
        let cpuCount: number | undefined;
        let usedMemory: number | undefined;

        for (const line of lines) {
            if (line.startsWith('CPU(s):')) {
                cpuCount = parseInt(line.split(':')[1].trim());
            } else if (line.startsWith('Used memory:')) {
                usedMemory = parseInt(line.split(':')[1].trim()) / (1024 * 1024); // Convert KiB to MB
            }
        }

        const vmStatus = getStatusFromOutput(vmInfoOutput);
        const memoryUsage = usedMemory?.toFixed(2) + "MB" || 'N/A';

        // Create a new table instance
        const table = new Table({
            head: ['VM Information', 'Details'],
            colWidths: [30, 50], // Adjust column widths as needed
        });

        // Add rows to the table
        table.push(
            ['VM Name', name],
            ['Status', vmStatus],
            ['Memory Usage', memoryUsage],
            ['CPU Cores', cpuCount?.toString() || 'N/A'],
            ['IP Address', ipAddress || 'N/A']
        );

        // Return the table as a string
        return table.toString();
    } catch (error) {
        console.error("An error occurred:", (error as Error).message);
        throw error;
    }
};
