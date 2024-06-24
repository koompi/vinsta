import * as path from "path";
import * as fs from "fs";
import sudo from "sudo-prompt";

const options = {
  name: "Vinsta",
};

function writeFileWithSudo(filePath: string, content: string) {
  const command = `echo "${content.replace(/\n/g, '\\n')}" > ${filePath}`;
  sudo.exec(command, options, (error?: Error, stdout?: string | Buffer, stderr?: string | Buffer) => {
    if (error) {
      console.error("Error writing to .env file:", error);
    } else if (stderr) {
      console.error("stderr output:", stderr);
    } else {
      console.log("Successfully wrote to .env file");
    }
  });
}

// Function to write database IP and port to .env file
export async function writeServerEnvFile(dbIp: string, dbPort: string, dbPassword: string) {
  const envFilePath = path.join("/opt/vinsta", ".env");
  const envContent = `DATABASE_IP=${dbIp}\nDATABASE_PORT=${dbPort}\nDATABASE_PASSWORD=${dbPassword}\n`;
  writeFileWithSudo(envFilePath, envContent);
}

export async function writeClientEnvFile(dbIp: string, dbPort: string, dbPassword: string) {
  const envFilePath = path.join("/opt/vinsta/client/vinsta", ".env");
  const envContent = `DATABASE_IP=${dbIp}\nDATABASE_PORT=${dbPort}\nDATABASE_PASSWORD=${dbPassword}\n`;
  writeFileWithSudo(envFilePath, envContent);
}

export async function writeDatabaseEnvFile({ dbPassword, dbPort }: { dbPassword: string, dbPort: string }) { 
  const envFilePath = path.join("/opt/vinsta/database", ".env");
  const envContent = `
CONTAINER_NAME=vinstadb
admin_user=admin
admin_password=${dbPassword}
database_name=vinstadb
db_user=admin
db_password=${dbPassword}
db_port=${dbPort}`;
  writeFileWithSudo(envFilePath, envContent);
}
