import * as path from "path";
import * as fs from "fs";
// Function to write database IP and port to .env file
export function writeServerEnvFile(dbIp: string, dbPort: string) {
  const envFilePath = path.join("/opt/vinsta", ".env");
  const envContent = `DATABASE_IP=${dbIp}\nDATABASE_PORT=${dbPort}\n`;

  try {
    fs.writeFileSync(envFilePath, envContent, { flag: "w" });
    console.log("Successfully wrote to .env file");
  } catch (error) {
    console.error("Error writing to .env file:", error);
  }
}

export function writeClientEnvFile(dbIp: string, dbPort: string) {
  const envFilePath = path.join("/opt/vinsta/client/vinsta", ".env");
  const envContent = `DATABASE_IP=${dbIp}\nDATABASE_PORT=${dbPort}\n`;

  try {
    fs.writeFileSync(envFilePath, envContent, { flag: "w" });
    console.log("Successfully wrote to .env file");
  } catch (error) {
    console.error("Error writing to .env file:", error);
  }
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


  try {
    fs.writeFileSync(envFilePath, envContent, { flag: "w" });
    console.log("Successfully wrote to .env file");
  } catch (error) {
    console.error("Error writing to .env file:", error);
  }
}

