import { exec } from "child_process";
import { promisify } from "node:util";
const execAsync = promisify(exec);

export const executeCommand = async (
  command: string,
  option?: any
): Promise<string> => {
  const { stdout, stderr } = await execAsync(command, option);

  if (stderr) {
    // throw new Error(stderr.toString());
    console.log(stderr.toString());
  }

  return stdout.toString();
};


export const cmdwithprogress = (command: any) => {
  return new Promise((resolve, reject) => {
    const process: any = exec(command);

    process.stdout.on('data', (data: any) => {
      console.log(data.toString());
    });

    process.stderr.on('data', (data: any) => {
      console.error(data.toString());
    });

    process.on('close', (code: any) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve(process);
      }
    });
  });
};
// executeCommand("sudo docker compose up -d", { cwd: "/var/...." });