import { executeCommand } from "../../shells/executeCommand";
import type { VMOptions } from "../../types/VMOptionsType";
import { delay } from "../../utils/delay";

export const stopVirtualMachine = async (options: VMOptions): Promise<void> => {
  const { name = "koompi" } = options;
  try {
   // Check if VM exists
   const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
   if (!vmExistsOutput.includes("Name:")) {
     throw new Error(`Virtual machine "${name}" not found`);
   }
    // Attempt graceful shutdown first
    await executeCommand(`virsh shutdown ${name}`);
    console.log(`Attempting graceful shutdown of virtual machine "${name}"`);

    // Wait for a short period to allow graceful shutdown
    await delay(5000);

    // Check if VM is still running after the wait period
    const vmStatusOutput = await executeCommand(`virsh domstate ${name}`);
    if (vmStatusOutput.includes("running")) {
      console.log(`Graceful shutdown failed. Forcing shutdown...`);
      await executeCommand(`virsh destroy ${name} --graceful`); // Attempt forced shutdown with grace period
      if (!vmStatusOutput.includes("shut off")) {
        console.warn(`Forced shutdown with grace period might not have worked. Using virsh destroy without grace.`);
        await executeCommand(`virsh destroy ${name}`); // Final forced shutdown
      }
    } else {
      console.log(`Virtual machine "${name}" stopped successfully.`);
    }
  } catch (error: any) {
    // Log error message with VM name
    console.log(`Failed to stopped virtual machine "${name}": ${error.message}`);
    // Throw error to stop execution
    throw error;
  } finally {
    // Optional: Additional actions regardless of success or failure (e.g., logging)
  }
};