import * as fs from "fs";
import * as path from "path";
import os from "os";

export async function sshConfig() {
    const homeDir = os.homedir();
    const vinstaDir = path.join(homeDir, ".vinsta");
    const sshDir = path.join(homeDir, ".ssh");

    // Create the .vinsta directory if it doesn't exist
    if (!fs.existsSync(vinstaDir)) {
        fs.mkdirSync(vinstaDir, { recursive: true });
    }

    // Define the SSH directory path and configuration content
    const sshContent = `Host *\n    StrictHostKeyChecking no\n    UserKnownHostsFile=/dev/null`;

    // Define the path to the SSH configuration file
    const sshConfigPath = path.join(sshDir, "config");

    // Write the SSH configuration content to the SSH configuration file
    fs.writeFileSync(sshConfigPath, sshContent);

    console.log("SSH configuration updated successfully.");

}