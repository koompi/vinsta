import * as path from 'path';
import * as fs from 'fs';
// Function to write database IP and port to .env file
export function writeEnvFile(dbIp: string, dbPort: string) {
    const envFilePath = path.join("/opt/vinsta", ".env");
    const envContent = `DATABASE_IP=${dbIp}\nDATABASE_PORT=${dbPort}\n`;
  
    try {
      fs.writeFileSync(envFilePath, envContent, { flag: "w" });
      console.log("Successfully wrote to .env file");
    } catch (error) {
      console.error("Error writing to .env file:", error);
    }
  }