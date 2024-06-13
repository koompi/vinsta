import type { VMOptions } from '../types/VMOptionsType';
import { executeCommand } from '../shells/executeCommand';
import { promises as fs } from 'fs';
import path from 'path';
import { stopVirtualMachine } from './stopVirtualMachine';
import { startVirtualMachine } from './startVirtualMachine';

export const restoreVirtualMachine = async (
  options: VMOptions
): Promise<{ message?: string }> => {
  const { name = "koompi-vm-1" } = options; // Destructure options
  const currentPath = `images/${name}.qcow2`;
  const backupDir = path.resolve('backup');
  const backupPath = path.join(backupDir, `${name}.qcow2`);
  const tempPath = `images/temp_${name}.qcow2`;

  try {
    // Stop the VM
    await stopVirtualMachine({ name });

    // Check if backup file exists
    await fs.access(backupPath);
    
    // Rename current VM state to a temporary file
    await executeCommand(`mv ${currentPath} ${tempPath}`);

    // Copy the backup file to the VM images directory
    await executeCommand(`cp ${backupPath} ${currentPath}`);

    // Rename the temporary file to the backup file
    await executeCommand(`mv ${tempPath} ${backupPath}`);

    // Start the VM again
    await startVirtualMachine({ name });

    return {
      message: "Successfully restored the virtual machine from backup",
    };
  } catch (error) {
    console.error(`Error restoring the virtual machine "${name}":`, (error as Error).message);

    // Handle specific errors
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Backup file "${backupPath}" not found`);
    } else if ((error as NodeJS.ErrnoException).code === 'EACCES') {
      throw new Error(`Permission denied when accessing "${backupPath}" or "${currentPath}"`);
    } else {
      // Re-throw the error to propagate it upwards
      throw error;
    }
  }
};
