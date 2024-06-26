import { executeCommand } from '../../../../shells/executeCommand';


export async function enableDefaultInterface() {
    try {
    await executeCommand("sudo virsh net-start default");
    await executeCommand("sudo virsh net-autostart default");
    console.log("Nat enabled successfully.");
    
    }
    catch (error) {
        console.error('Failed to enable bridge:', error);
    }
}