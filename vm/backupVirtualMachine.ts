import type { VMOptions } from '../types/VMOptionsType';
import { executeCommand } from '../shells/executeCommand';
import { promises as fs } from 'fs';
import path from 'path';
import { stopVirtualMachine } from './stopVirtualMachine';
import { startVirtualMachine } from './startVirtualMachine';

export const backupVirtualMachine = async (
  options: VMOptions
): Promise<{ message?: string }> => {
  const { name = "koompi-vm-1" } = options; // Destructure options
  const currentPath = `images/${name}.qcow2`;
  const backupDir = path.resolve('backup');
  const backupPath = path.join(backupDir, `${name}.qcow2`);

  try {
    // Stop the VM
    await stopVirtualMachine({ name });

    // Check if source file exists
    await fs.access(currentPath);
    
    // Ensure the backup directory exists
    await fs.mkdir(backupDir, { recursive: true });

    // Copy the current VM state to the backup directory
    await executeCommand(`cp ${currentPath} ${backupPath}`);

    // Start the VM again
    await startVirtualMachine({ name });

    return {
      message: "Successfully backed up the virtual machine",
    };
  } catch (error) {
    console.error(`Error backing up the virtual machine "${name}":`, (error as Error).message);

    // Handle specific errors
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Source file "${currentPath}" not found`);
    } else if ((error as NodeJS.ErrnoException).code === 'EACCES') {
      throw new Error(`Permission denied when accessing "${currentPath}" or "${backupDir}"`);
    } else {
      // Re-throw the error to propagate it upwards
      throw error;
    }
  }
};