import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { findInterfacesWithInternet } from '../../../../shells/findInterfaces'; // Adjust the import path as needed
import { executeCommand } from '../../../../shells/executeCommand';
import * as path from "path";
import { mkdir } from "../../../../shells/mkdir";

export async function setupHostbridge() {
    try {
        const interfacesWithInternet = await findInterfacesWithInternet();

        if (interfacesWithInternet.length === 0) {
            throw new Error('No interfaces with internet connectivity found.');
        }

        const selectedInterface = interfacesWithInternet[0];

        const netplanConfig = `
network:
  ethernets:
    ${selectedInterface}:
      dhcp4: false
  bridges:
    br0:
      interfaces: [${selectedInterface}]
      dhcp4: true
      mtu: 1500
      parameters:
        stp: true
        forward-delay: 15
`;
        const dirPath = path.join(__dirname, '/etc/netplan');
        mkdir(dirPath);
        // Write the Netplan configuration to /etc/netplan/01-kvmbridge.yaml
        await fs.writeFile('/etc/netplan/01-kvmbridge.yaml', netplanConfig);
        console.log('Netplan configuration file created successfully.');

        // Temporarily apply the Netplan configuration
        exec('netplan try', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error applying netplan configuration: ${error.message}`);
                // Restore the original configuration in case of error
                exec('netplan apply --debug');
                return;
            }
            if (stderr) {
                console.error(`Netplan try stderr: ${stderr}`);
                // Restore the original configuration in case of error
                exec('netplan apply --debug');
                return;
            }
            console.log(`Netplan try stdout: ${stdout}`);

            // If the temporary apply was successful, commit the changes
            exec('netplan apply', (applyError, applyStdout, applyStderr) => {
                if (applyError) {
                    console.error(`Error applying netplan configuration: ${applyError.message}`);
                    return;
                }
                if (applyStderr) {
                    console.error(`Netplan apply stderr: ${applyStderr}`);
                    return;
                }
                console.log(`Netplan apply stdout: ${applyStdout}`);
            });
        });
    } catch (error: any) {
        console.error(`Failed to setup host bridge: ${error.message}`);
    }
}


export async function setupKVMBridge() {
const kvmBridge = `
<network>
<name>br0</name>
<forward mode="bridge"/>
<bridge name="br0"/>
</network>
`;
    try {
        await fs.writeFile('kvmbridge.yml', kvmBridge);
        console.log('KVM Bridge file created successfully.');
        await enableKVMBridge();
    } catch (error) {
        console.error('Failed to enable KVM bridge:', error);
    }
}

async function enableKVMBridge() {
    try {
    await executeCommand("sudo virsh net-define kvmbridge.xml");
    await executeCommand("sudo virsh net-start host-bridge");
    await executeCommand("sudo virsh net-autostart host-bridge");
    console.log("KVM bridge enabled successfully.");
    
    }
    catch (error) {
        console.error('Failed to enable bridge:', error);
    }
}