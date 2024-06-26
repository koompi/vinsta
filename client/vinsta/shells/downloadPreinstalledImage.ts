import { cmdwithprogress } from "./executeCommand";

const downloadCommand = 'wget --progress=bar:force https://dev.koompi.org/iso/qcow/koompi-preinstalled-vm-1.tar.gz -P /opt/vinsta/pre-images/';

export async function downloadPreinstalledImage() {
    try {
      console.log("Downloading KOOMPI Server Preinstalled Image..."); 
      await cmdwithprogress(downloadCommand);
      await cmdwithprogress("tar -xzvf /opt/vinsta/pre-images/koompi-preinstalled-vm-1.tar.gz -C /opt/vinsta/pre-images/");
      await cmdwithprogress("rm -rf /opt/vinsta/pre-images/koompi-preinstalled-vm-1.tar.gz");
      console.log('Download completed successfully');
    } catch (error: any) {
      console.error(`Unable to download KOOMPI Preinstalled Image: ${error.message}`);
    }
  }