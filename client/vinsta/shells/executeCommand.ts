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

// executeCommand("sudo docker compose up -d", { cwd: "/var/...." });