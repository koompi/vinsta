import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getNetworkInterfaces(): Promise<string[]> {
    try {
        const { stdout } = await execAsync('ip -o link show | awk -F\': \' \'{print $2}\'');
        return stdout.split('\n').filter((iface) => iface && iface !== 'lo');
    } catch (error) {
        console.error('Error getting network interfaces:', error);
        return [];
    }
}

async function getInterfaceIPAddress(id: string): Promise<string | null> {
    try {
        const { stdout } = await execAsync(`ip -o -4 addr list ${id} | awk '{print $4}'`);
        return stdout ? stdout.split('/')[0].trim() : null;
    } catch (error) {
        console.error(`Error getting IP address for interface ${id}:`, error);
        return null;
    }
}

async function checkInternetConnectivity(id: string): Promise<boolean> {
    try {
        const { stdout } = await execAsync(`ping -I ${id} -c 4 google.com`);
        return stdout.includes('4 packets transmitted, 4 received');
    } catch (error) {
        return false;
    }
}

export async function findInterfacesWithInternet(): Promise<string[]> {
    const interfaces = await getNetworkInterfaces();
    const interfacesWithInternet: string[] = [];

    for (const iface of interfaces) {
        const ipAddress = await getInterfaceIPAddress(iface);
        if (ipAddress) {
            const hasInternet = await checkInternetConnectivity(iface);
            if (hasInternet) {
                interfacesWithInternet.push(iface);
            }
        }
    }

    return interfacesWithInternet;
}
