import { exec } from 'child_process';
import type { VMOptionsV2 } from '../types/VMOptionsV2';
import { delay } from '../utils/delay';
import { getIpAddressFromMac } from '../client/vinsta/shells/getIpAddressFromMac';

const executeCommand = (command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}\n${stderr}`);
        reject(new Error(`Error executing command: ${command}\n${stderr}`));
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
};

export const cloneVirtualMachine = async (
  options: VMOptionsV2
): Promise<{ sshcmd?: string; sshUsername?: string; sshPassword?: string }> => {
  const { image = "koompi-preinstalled-vm-1", name, cpu, ram, disk, os } = options; // Destructure options
  try {
    // Ensure the nvram directory exists
    const nvramDir = `/var/lib/libvirt/qemu/nvram/${name}`;
    await executeCommand(`mkdir -p ${nvramDir}`);

    // Use virt-install for clean install with increased storage
    console.log(`Creating new VM "${name}" with virt-install...`);
    await executeCommand(`virt-install \
      --name ${name} \
      --ram ${ram} \
      --vcpus ${cpu} \
      --os-variant ${os || 'archlinux'} \
      --disk pre-images/${image}.qcow2,bus=virtio, \
      --import \
      --network bridge=br0,model=virtio \
      --boot loader=/usr/share/OVMF/x64/OVMF_CODE.fd,loader.readonly=yes,loader.type=pflash,nvram.template=/usr/share/OVMF/x64/OVMF_VARS.fd \
      --noautoconsole \
      --noreboot`);

    await delay(10000);

    await executeCommand(`sudo mv pre-images/${image}.qcow2 images/${name}`);

    // sudo qemu-img resize  /var/lib/libvirt/images/debian11.qcow2 +20G
    await executeCommand(`qemu-img resize images/${name}.qcow2 +${disk}`);

    console.log(`Storage resized successfully for VM "${name}"`);

    // Start the new VM
    console.log(`Starting the new VM: "${name}"`);
    // Ensure the VM autostarts
    await executeCommand(`virsh autostart ${name}`);
    await executeCommand(`virsh start ${name}`);

    await delay(50000);

    // Get the IP address of the VM (assuming successful start)
    const ipAddress = await getIpAddressFromMac(`${name}`);

    const sshCommand = ipAddress && image.startsWith("koompi")
      ? `ssh admin@${ipAddress}`
      : undefined;

    // **Ensure return even if IP or SSH details are not available:**
    return {
      sshcmd: sshCommand,
      sshUsername: "admin",
      sshPassword: "123123123",
    };

  } catch (error) {
    console.error(`Error cloning virtual machine "${name}":`, (error as Error).message);
    // Handle potential errors (e.g., file not found, permission issues)
    throw error; // Re-throw the error to propagate it upwards
  }
};