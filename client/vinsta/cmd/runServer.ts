import { execSync } from 'child_process';
import { executeCommand } from '../shells/executeCommand';

// Function to check for sudo privileges
function hasSudo(): boolean {
    try {
        // Attempt to run a simple command with sudo
        execSync('sudo true');
        return true;
    } catch (error) {
        return false;
    }
}



export async function runServer() {
    try {
        if (!hasSudo()) {
            console.error('Error: This function requires sudo privileges to proceed.');
            console.log("Try running: 'sudo !!'")
            process.exit(1); // Exit with an error code
        }


        process.chdir("/opt/vinsta/")
        executeCommand("node /opt/vinsta/out/index.js")
        const HOST = '0.0.0.0'; // Replace with your actual host if necessary
        const PORT = 3333;

        console.log(`Vinsta server is running on http://${HOST}:${PORT}`);


    } catch (error: any) {
        ora().fail('An error occurred while updating Vinsta');
        console.error('Error:', error.message);
    }
}
