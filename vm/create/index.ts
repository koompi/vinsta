import { executeCommand } from '../../shells/executeCommand';
import { getIpAddressFromMac } from '../../client/vinsta/shells/getIpAddressFromMac';

import { VMOptions } from '../../types/VMOptionsType';



// Define the type of the object being returned
interface VMCreationResponse {
  sshcmd?: string;
  sshPassword?: string;
}

// Function to create virtual machine
export const createVirtualMachine = async (
  options: VMOptions
): Promise<{ sshcmd?: string; sshUsername?: string; sshPassword?: string }> => {
  const {
    name,
    iso = 'koompi',
    ram = '1024',
    disk = '20G',
    cpu = '1',
    network = 'default',
    osVariant = 'archlinux',
    bootOption = 'uefi',
    arch = 'x64',
    username = 'admin',
    password = '123',
  } = options;

  try {
    // Check if VM exists
    const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
    if (vmExistsOutput.includes('Name:')) {
      throw new Error(`Virtual machine "${name}" already created`);
    }
  } catch (error) {
    console.log(`Virtual machine "${name}" not exists`); // Log error message with VM name
  }

  try {
    // Validate RAM size format
    if (!ram.match(/^\d+$/)) {
      throw new Error('Invalid RAM size format. Use a numeric value for RAM.');
    }

    // Validate disk size format
    if (!disk.match(/^\d+[GM]$/)) {
      throw new Error(
        "Invalid disk size format. Use a number followed by 'G' or 'M' for disk."
      );
    }

    // Create virtual disk
    const diskFile: string = `images/${name}.qcow2`;
    await executeCommand(`qemu-img create -f qcow2 "${diskFile}" "${disk}"`);

    // Determine firmware paths based on architecture
    const firmwarePath =
      arch === 'x86' ? '/usr/share/OVMF/ia32' : '/usr/share/OVMF/x64';
    const loaderFile = `${firmwarePath}/OVMF_CODE.fd`;
    const nvramTemplateFile = `${firmwarePath}/OVMF_VARS.fd`;

    // Build virt-install command
    let command: string = `virt-install --name ${name} --ram ${ram} --vcpus ${cpu} --disk path=${diskFile},format=qcow2 --network network=${network},model=virtio --os-variant=${osVariant} --features acpi=on,apic=on --noautoconsole`;

    if (bootOption === 'uefi') {
      // Add UEFI firmware option
      command += ` --boot loader=${loaderFile},loader.readonly=yes,loader.type=pflash,nvram.template=${nvramTemplateFile}`;
    } else {
      // Add MBR option
      command += ` --boot hd`;
    }

    if (iso && iso !== '' && iso !== ' ') {
      command += ` --cdrom iso/${iso}*.iso`;
    } else {
      command += ' --import';
    }

    await executeCommand(command);

    // Delay for 60 seconds to allow the VM to start up
    await new Promise(resolve => setTimeout(resolve, 60000));

    // Ensure the VM autostarts
    await executeCommand(`virsh autostart ${name}`);

    // Get the IP address of the VM
    const ipAddress = await getIpAddressFromMac(name);

    const sshCommand = ipAddress && iso.startsWith('koompi')
      ? `ssh koompilive@${ipAddress}`
      : undefined;

    // Return an object containing success message, IP address (if found), and SSH command (if applicable)
    return {
      sshcmd: sshCommand,
      sshUsername: 'koompilive',
      sshPassword: '123',
    };

  } catch (error) {
    console.error('An error occurred:', (error as Error).message);
    throw error;
  }
};
