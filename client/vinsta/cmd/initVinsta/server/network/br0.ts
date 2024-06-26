import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { findInterfacesWithInternet } from '../../../../shells/findInterfaces'; // Adjust the import path as needed
import { executeCommand } from '../../../../shells/executeCommand';

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
        // Write the Netplan configuration to /etc/netplan/01-kvmbridge.yaml
        await fs.writeFile('/etc/netplan/01-kvmbridge.yaml', netplanConfig);
        console.log('Netplan configuration file created successfully.');
        await executeCommand('sudo netplan apply');
       
    
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
        await fs.writeFile('kvmbridge.xml', kvmBridge);
        console.log('KVM Bridge file created successfully.');
        await enableKVMBridge();
    } catch (error) {
        console.error('Failed to enable KVM bridge:', error);
    }
}

async function enableKVMBridge() {
    try {
    await executeCommand("sudo virsh net-define kvmbridge.xml");
    await executeCommand("sudo virsh net-start br0");
    await executeCommand("sudo virsh net-autostart br0");
    console.log("KVM bridge enabled successfully.");
    
    }
    catch (error) {
        console.error('Failed to enable bridge:', error);
    }
}