import { execSync } from "child_process";
import { cmdwithprogress, executeCommand } from "../shells/executeCommand";

// Function to check for sudo privileges
function hasSudo(): boolean {
  try {
    // Attempt to run a simple command with sudo
    execSync("sudo true");
    return true;
  } catch (error) {
    return false;
  }
}

export async function runServer() {
  try {
    if (!hasSudo()) {
      console.error(
        "Error: This function requires sudo privileges to proceed."
      );
      console.log("Try running: 'sudo !!'");
      process.exit(1); // Exit with an error code
    }

    process.chdir("/opt/vinsta/");
    cmdwithprogress("node out/index.js");

  } catch (error: any) {
    console.error("Error:", error.message);
  }
}
