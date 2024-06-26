import { cmdwithprogress } from "./executeCommand";

const downloadCommand = 'wget --progress=bar:force https://dev.koompi.org/iso/server/koompi-server-x86_64.iso -P /opt/vinsta/iso/';

export async function downloadKOOMPIServerISO() {
    try {
      console.log("Downloading KOOMPI Server ISO...");
      await cmdwithprogress(downloadCommand);
      console.log('Download completed successfully');
    } catch (error: any) {
      console.error(`Unable to download KOOMPI Server ISO: ${error.message}`);
    }
  }