import { executeCommand } from "../../shells/executeCommand";
import type { VMOptions } from "../../types/VMOptionsType";

export const removeVirtualMachine = async (
  options: VMOptions
): Promise<void> => {
  const { name = "koompi" } = options;

  try {
    // Check if VM exists
    const vmExistsOutput = await executeCommand(`virsh dominfo ${name}`);
    if (!vmExistsOutput.includes("Name:")) {
      console.log("Virtual machine not found.");
      throw new Error(`Virtual machine "${name}" not found`);
    }

    // Shutdown request domain
    await executeCommand(`virsh destroy ${name}`);

    // undefine request domain
    await executeCommand(`virsh undefine --nvram ${name}`);

    // delete the image of the request domain
    await executeCommand(`rm -rf images/${name}.qcow2`);
    console.log("Virtual machine removed successfully.");
  } catch (error: any) {
    // Log error message with VM name
    console.log(`Failed to remove virtual machine "${name}": ${error.message}`);
    // Throw error to stop execution
    throw error;
  } finally {
    // Optional: Additional actions regardless of success or failure (e.g., logging)
  }
};