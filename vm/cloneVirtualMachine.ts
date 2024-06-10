import { exec } from 'child_process'; // Assuming child_process for execution

import type { VMOptionsV2 } from '../types/VMOptionsV2';
import { delay } from '../utils/delay';

export const cloneVirtualMachine = async (options: VMOptionsV2): Promise<void> => {
  const { image = "koompi", name, cpu, ram, disk } = options; // Destructure options
  try {
    // Use virt-clone to create a new VM from the copied image
    console.log(`Creating new VM "${name}" using virt-clone...`);
    await exec(`virt-clone --original ${image} --name ${name} --auto-clone`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error cloning VM with virt-clone: ${error.message}`);
        return;
      }
      console.log(stdout); // Optional: Log virt-clone output for debugging
    });

    await delay(1000);

    // Set the Maximum CPU before setting it
    await exec(`virsh setvcpu ${name} ${cpu} --config --maximum`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error setting maximum CPU: ${error.message}`);
        return;
      }
    });
    await exec(`virsh setvcpu ${name} ${cpu} --config`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error setting CPU: ${error.message}`);
        return;
      }
    });

    // Set the Maximum RAM before setting it
    await exec(`virsh setmaxmem ${name} ${ram} --config --maximum`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error setting maximum RAM: ${error.message}`);
        return;
      }
    });
    await exec(`virsh setmem ${name} ${ram} --config`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error setting RAM: ${error.message}`);
        return;
      }
    });

    // Update Storage
    console.log(`Resizing storage for the VM "${name}"...`);
    const oldDisk = `${image}.qcow2`;
    const newDisk = `${name}.qcow2`;

    // Step 1: Create a new disk image with the new size
    await exec(`qemu-img create -f qcow2 -o preallocation=metadata ${newDisk} ${disk}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating new disk image: ${error.message}`);
        return;
      }
    });

    // Step 2: Perform the resizing from old disk image to the new disk image
    await exec(`virt-resize --expand /dev/sda2 ${oldDisk} ${newDisk}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error resizing disk: ${error.message}`);
        return;
      }
      console.log(stdout); // Optional: Log virt-resize output for debugging
    });

    console.log(`Storage resized successfully for VM "${name}"`);

    // Start the new VM
    console.log(`Starting the new VM: "${name}"`);
    await exec(`virsh start ${name}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting VM: ${error.message}`);
        return;
      }
      console.log(stdout); // Optional: Log VM start output for debugging
    });

  } catch (error) {
    console.error(`Error cloning virtual machine "${name}":`, (error as Error).message);
    // Handle potential errors (e.g., file not found, permission issues)
  }
};
