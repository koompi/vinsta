import axios from 'axios';
import { execSync } from 'child_process';
import ora from 'ora';
import semver from 'semver';

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


async function getLocalVersion(): Promise<string> {
  try {
    const version = execSync('vinsta -V').toString().trim();
    return version;
  } catch (error) {
    throw new Error('Failed to get local Vinsta version');
  }
}

async function getRemoteVersion(): Promise<string> {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/koompi/vinsta/main/client/vinsta/package.json');
    const remotePackageJson = response.data;
    return remotePackageJson.version;
  } catch (error) {
    throw new Error('Failed to get remote Vinsta version');
  }
}

export async function updateVinsta() {
  try {
    if (!hasSudo()) {
      console.error('Error: This function requires sudo privileges to proceed.');
      console.log("Try running: 'sudo !!'")
      process.exit(1); // Exit with an error code
    }
    const spinner = ora('Checking for updates...').start();

    const localVersion = await getLocalVersion();
    const remoteVersion = await getRemoteVersion();


    console.log(remoteVersion);

    spinner.succeed(`Local version: ${localVersion}, Remote version: ${remoteVersion}`);

    if (semver.lt(localVersion, remoteVersion)) {
      spinner.start('Updating Vinsta...');

      execSync('wget https://github.com/koompi/vinsta/raw/main/client/vinsta/out/index.js -O /usr/bin/vinsta && sudo chmod +x /usr/bin/vinsta');

      spinner.succeed('Vinsta has been updated successfully.');
    } else {
      spinner.succeed('Vinsta is already up to date.');
    }
  } catch (error: any) {
    ora().fail('An error occurred while updating Vinsta');
    console.error('Error:', error.message);
  }
}
