import type { VMOptions } from '../types/VMOptionsType';
import { getStatusFromOutput } from '../shells/getStatusFromOutput';
import { executeCommand } from '../shells/executeCommand';
import { delay } from '../utils/delay';

export const checkInfoVirtualMachine = async (options: VMOptions): Promise<{ message: string; vmInfo?: { status?: string; memoryUsage?: string; cpuCores?: number; ipAddress?: string } }> => {
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

        // Get interface name with type 'bridge'
        const interfaceNameOutput = await executeCommand(`virsh domiflist ${name} | awk '$2=="bridge" {print $1}'`);
        const interfaceName = interfaceNameOutput.trim();

        if (!interfaceName) {
            throw new Error(`Bridge interface not found for VM "${name}"`);
        }

        // Get MAC address of the VM dynamically
        // const getMacAddrVM = await executeCommand(`sudo virsh domiflist ${name} | awk -v interface="${interfaceName}" '$1==interface {print $5}'`);

        const getMacAddrVM = await executeCommand(`virsh domiflist ${name} | awk '$1=="${interfaceName}"{print $5}'`)

        // TODO Later on allow change br0 to other things
        const getIPfromMacVM = `arp-scan --localnet --interface br0| grep ${getMacAddrVM.trim()} | awk 'NR==1 {print $1 }'`;
        const ipAddress = (await executeCommand(getIPfromMacVM)).trim();

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

        const vmDetails = {
            status: getStatusFromOutput(vmInfoOutput),
            memoryUsage: usedMemory?.toFixed(2) + "MB" || 'N/A',
            cpuCores: cpuCount,
            ipAddress,
        };

        // Return an object with a message and VM details
        return {
            message: "Information of the instance",
            vmInfo: vmDetails,
        };
    } catch (error) {
        console.error("An error occurred:", (error as Error).message);
        throw error;
    }
};
