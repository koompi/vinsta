import { executeCommand } from '../../../shells/executeCommand';
import { writeDatabaseEnvFile } from '../../../shells/writeEnvFile';
import { hasSudo } from '../../../../../utils/hasSudo';
import { delay } from '../../../../../utils/delay';
import { writeServerEnvFile } from '../../../shells/writeEnvFile';

export async function MongoDBInit({ip, port, password, os} : {ip: string, port: string, password: string, os: string }) { // ip: string, port: string, password: string, os: string, user: string) {
    if (ip === "127.0.0.1") {
        hasSudo();
        await checkDependencies(os);
        await dockerCompose({ password: password, port: port} );
    } 
}

export async function dockerCompose({ password, port } : {  password: string, port: string }) {

    try {
        console.log("Initializing database...");
        await writeDatabaseEnvFile({ dbPassword: password, dbPort: port} );
        
        await executeCommand("sudo docker compose up -d", { cwd: "/opt/vinsta/database"});
        delay(10000)
        await executeCommand("sudo docker restart vinstadb")
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

async function checkDependencies(os: string) {
    try {
        await executeCommand("docker --version");
        console.log("Docker is installed.");
    } catch (error) {
        console.error("Docker is not installed.");
        await installDependencies(os);
    }

    try {
        await executeCommand("docker-compose --version");
        console.log("Docker Compose is installed.");
    } catch (error) {
        console.error("Docker Compose is not installed.");
        await installDependencies(os);
    }

}

async function installDependencies(os: string) {
    if (os === "arch") {
        await executeCommand("sudo pacman -Sy docker docker-compose --noconfirm");
        await executeCommand("sudo systemctl enable --now docker.service");
    } else if (os === "ubuntu") {
        await executeCommand("sudo apt-get update");
        await executeCommand("sudo apt-get install docker docker-compose -y");
    } else {
        console.error(`Unsupported OS: ${os}`);
    }
}
