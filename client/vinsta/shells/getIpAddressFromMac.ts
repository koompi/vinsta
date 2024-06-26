// getIpAddressFromMac.ts

import { executeCommand } from '../shells/executeCommand';
import { getIPFromCommandOutput } from '../../../shells/getIPFromCommandOutput';
// Function to get IP address from MAC address
export const getIpAddressFromMac = async (vmName: string): Promise<string | undefined> => {
    try {
        // Get interface name with type 'bridge'
        const interfaceNameOutput = await executeCommand(`virsh domiflist ${vmName} | awk '$2=="bridge" {print $1}'`);
        const interfaceName = interfaceNameOutput.trim();

        if (!interfaceName) {
            // throw new Error(`Bridge interface not found for VM "${vmName}"`);
            // When no bridge interface is found, it mean the interfaces should be br10 or default
            const commandOutput = await executeCommand(`virsh domifaddr ${vmName}`)
            const ipAddress = getIPFromCommandOutput(commandOutput);
            return ipAddress
        }

        // Get MAC address of the VM dynamically
        const getMacAddrVM = await executeCommand(`virsh domiflist ${vmName} | awk '$1=="${interfaceName}" {print $5}'`);

        // Get IP address from MAC address
        const getIPfromMacVM = `arp-scan --localnet --interface br0 | grep ${getMacAddrVM.trim()} | awk 'NR==2 {print $1 }'`;
        const ipAddress = (await executeCommand(getIPfromMacVM)).trim();

        return ipAddress;
    } catch (error) {
        console.error("An error occurred:", (error as Error).message);
        return undefined;
    }
};
