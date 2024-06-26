import { execSync } from 'child_process';

// Function to check for sudo privileges
export function hasSudo(): boolean {
    try {
      // Attempt to run a simple command with sudo
      execSync('sudo true');
      return true;
    } catch (error) {
      return false;
    }
  }