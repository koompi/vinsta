import inquirer from "inquirer";
import fs from "fs";
import { execSync } from 'child_process';


export async function initVinsta() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the Vinsta server name you want to create:",
      default: "Vinsta-Server-1",
    },
    {
      type: "input",
      name: "databaseip",
      message: "Enter the IP Address of the MongoDB:",
      default: "localhost",
    },
    {
      type: "input",
      name: "databaseport",
      message: "Enter the Port of the MongoDB:",
      default: "27015",
    },
    {
      type: "input",
      name: "databasepassword",
      message: "Enter the Password of the MongoDB:",
      default: "zxcvahsdkjfqwer",
    },
    {
      type: "input",
      name: "masterkey",
      message: "Create a master key that is used for accessing the Vinsta Server:",
      default: "zxcvbnmasdfgqewruioasdfq123@@",
    },
  ]);

  const envFileContent = `
NAME=${answers.name}
DATABASE_IP=${answers.databaseip}
DATABASE_PORT=${answers.databaseport}
DATABASE_PASSWORD=${answers.databasepassword}
MASTER_KEY=${answers.masterkey}
`;

  // Define the directory and filename for the .env file
  const envFilePath = '/opt/vinsta/.env';

  // Write the content to the specified .env file
  try {
    fs.writeFileSync(envFilePath, envFileContent.trim());
    console.log('Successfully initialized the server, all that left is running `vinsta --server`');
  } catch (error: any) {
    console.error('Error writing to .env file:', error.message);
  }
}
