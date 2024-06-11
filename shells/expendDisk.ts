import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import { delay } from '../utils/delay';

const execPromise = promisify(exec);

// Function to execute shell commands
const executeCommand = async (command: string): Promise<void> => {
    try {
        const { stdout, stderr } = await execPromise(command);
        if (stderr) {
            console.error(`Error executing command: ${command}\n${stderr}`);
            throw new Error(`Error executing command: ${command}\n${stderr}`);
        }
        console.log(stdout);
    } catch (error) {
        console.error(`Error executing command: ${command}\n${error}`);
        throw error;
    }
};

// Function to check if a command exists
const commandExists = async (command: string): Promise<boolean> => {
    try {
        await execPromise(`command -v ${command}`);
        return true;
    } catch {
        return false;
    }
};

// Function to resize the partition using expect script
const resizePartition = async () => {
    const expectScript = `
    spawn sudo parted /dev/nbd0 resizepart 2 100%
    expect {
      "Fix/Ignore?" {
        send "Fix\\r"
        exp_continue
      }
      "Partition number?" {
        send "2\\r"
        exp_continue
      }
      "End? " {
        send "\\r"
        exp_continue
      }
      eof
    }
  `;
    await executeCommand(`expect <<EOF\n${expectScript}\nEOF`);
};

// Function to resize the partition using expect script
const es2fsck_check = async () => {
    const expectScript = `
      spawn sudo e2fsck -f /dev/nbd0p2
      expect {
        "Pass 5: Checking group summary information" {
          exit
        }
        eof
      }
    `;
    await executeCommand(`expect <<EOF\n${expectScript}\nEOF`);
};

// Function to resize the partition using expect script
const resize2fs = async () => {
    const expectScript = `
    spawn sudo resize2fs /dev/nbd0p2
    expect {
      "nothing to do" { 
        exit
      }
      eof
    }
    `;
    await executeCommand(`expect <<EOF\n${expectScript}\nEOF`);
};
// Main function to perform the VM disk expansion
export const expandVMDisk = async (imageName: string): Promise<void> => {
    try {

        // Load the nbd module
        await executeCommand('sudo modprobe nbd max_part=63');

        // Connect to the VM disk image using nbd
        await executeCommand(`sudo qemu-nbd --connect=/dev/nbd0 "images/${imageName}"`);

        // Call the resizepart.expect script
        await resizePartition();
        delay(5000);
        // Check and resize the filesystem on the partition
        await es2fsck_check();
        delay(5000);
        await resize2fs();
        delay(5000);

        // Disconnect from the VM disk image
        await executeCommand('sudo qemu-nbd --disconnect /dev/nbd0');

        console.log('VM disk expansion completed!');
    } catch (error) {
        console.error(`Error during VM disk expansion: ${(error as Error).message}`);
        throw error;
    }
};

