import { promises as fs } from 'fs';

export async function mkdir(dirPath: string) {
    try {
        await fs.access(dirPath);
        console.log(`Directory already exists: ${dirPath}`);
    } catch (error) {
        // If the directory does not exist, an error will be thrown, so we create it
        console.log(`Directory does not exist, creating: ${dirPath}`);
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }
}