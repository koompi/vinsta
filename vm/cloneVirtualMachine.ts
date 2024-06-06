import { exec } from 'child_process'; // Assuming child_process for execution

import type { VMOptionsV2 } from '../types/VMOptionsV2';
import { delay } from '../utils/delay';


export const cloneVirtualMachine = async (options: VMOptionsV2): Promise<void> => {
  const { image = "koompi", name, cpu, ram, disk } = options; // Destructure options
  try {
    // Use virt-clone to create a new VM from the copied image
    // try to find a way to clone from one destination to another destination
    // like from pre-images to images
    console.log(`Creating new VM "${name}" using virt-clone...`);
    await exec(`virt-clone --original ${image} --name ${name} --auto-clone`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error cloning VM with virt-clone: ${error.message}`);
        return;
      }
      console.log(stdout); // Optional: Log virt-clone output for debugging
    });

    delay(1000);
    // Set the Maximum CPU before set it
    await exec(`virsh setvcpu ${name} ${cpu} --config --maximum`)
    await exec(`virsh setvcpu ${name} ${cpu} --config`)

    // Set the Maximum RAM before set it
    await exec(`virsh setmaxmem ${name} ${ram} --config --maximum`)
    await exec(`virsh setmem ${name} ${ram} --config`)

    // TODO: Update Storage

    // Configure the new VM properties (implementation depends on your tool)
    console.log(`Configuring new VM with options:`);
    // ... Implement logic to configure the new VM using newVmOptions ...

    // Start the new VM (implementation depends on your tool)
    console.log(`Starting the new VM: "${name}"`);
    // ... Implement logic to start the VM using your VM management tool ...

  } catch (error) {
    console.error(`Error cloning virtual machine "${name}":`, (error as Error).message);
    // Handle potential errors (e.g., file not found, permission issues)
  }
};
