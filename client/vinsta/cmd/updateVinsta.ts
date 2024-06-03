import axios from 'axios';
import { execSync } from 'child_process';
import ora from 'ora';
import semver from 'semver';

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
    const spinner = ora('Checking for updates...').start();
    
    const localVersion = await getLocalVersion();
    const remoteVersion = await getRemoteVersion();


    console.log(remoteVersion);
    
    spinner.succeed(`Local version: ${localVersion}, Remote version: ${remoteVersion}`);

    if (semver.lt(localVersion, remoteVersion)) {
      spinner.start('Updating Vinsta...');
      
      execSync('sudo wget https://github.com/koompi/vinsta/raw/main/client/vinsta/out/index.js -O /usr/bin/vinsta && sudo chmod +x /usr/bin/vinsta');  
      
      spinner.succeed('Vinsta has been updated successfully.');
    } else {
      spinner.succeed('Vinsta is already up to date.');
    }
  } catch (error: any) {
    ora().fail('An error occurred while updating Vinsta');
    console.error('Error:', error.message);
  }
}
