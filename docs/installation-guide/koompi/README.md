## Installation Guide for KOOMPI OS and Arch Linux

### Step 1: Install Dependencies
Firstly, you need to install the necessary dependencies for KVM and QEMU:
```bash
sudo pacman -Syu curl wget virt-manager virt-viewer qemu qemu-arch-extra \
edk2-ovmf vde2 ebtables dnsmasq bridge-utils openbsd-netcat libguestfs \
guestfs-tools expect netplan
```

### Step 2: Enable the Libvirt Daemon
```bash
sudo systemctl enable libvirtd.service
sudo systemctl start libvirtd.service
```

### Step 3: Configure User Permissions for KVM
Edit the libvirt configuration file to allow normal user accounts to use KVM. Use the following commands to open the file in your preferred text editor:

```bash
sudo vim /etc/libvirt/libvirtd.conf
```

```text
unix_sock_group = "libvirt"
unix_sock_ro_perms = "0777"
unix_sock_rw_perms = "0770"
```
<b>NOTE</b>: You can change the editor to nano if you are not comfortable using vim.

### Step 4: Add current user to kvm and libvirt groups
```
sudo usermod -a -G kvm $(whoami)
sudo usermod -a -G libvirt $(whoami)
sudo newgrp libvirt
```

### Step 5: Enable Nested Virtualization (Optional)
To enable nested virtualization, execute the following commands:
```bash
sudo modprobe -r kvm_intel
sudo modprobe kvm_intel nested=1
echo "options kvm-intel nested=1" | sudo tee /etc/modprobe.d/kvm-intel.conf
```

### Step 6: Verify Nested Virtualization
Run these commands to verify that nested virtualization is enabled:
```bash
systool -m kvm_intel -v | grep nested
cat /sys/module/kvm_intel/parameters/nested
```

## Setting Up a Host Bridge

## Step 1: Configure Netplan Bridge
Create the Netplan configuration file `/etc/netplan/01-kvmbridge.yaml` with the following contents:
```yaml
network:
  ethernets:
    enp2s0f0:
      dhcp4: false
  bridges:
    br0:
      interfaces: [enp2s0f0]
      dhcp4: true
      mtu: 1500
      parameters:
        stp: true
        forward-delay: 15
```

<b>Notes</b>: Replace `enp2s0f0` with your actual network interface name. To find your network interface, run:

```bash
ip a # To check for your ethernet interface
```

Run:

```bash
sudo netplan try # to test the config before apply
```

```bash
sudo netplan apply # to apply it once you're satisfied it works. Note that changing a network config over ssh may not be a good idea.
```
<b>Caution</b>: Changing network configuration over SSH may disconnect your session. Proceed with caution.


## Step 2: Configure KVM to Use the Bridge

Create a file named `kvmbridge.xml` with the following contents:
```xml
<network>
  <name>host-bridge</name>
  <forward mode="bridge"/>
  <bridge name="br0"/>
</network>
```

Define and start the network bridge using the following commands:
```bash
sudo virsh net-define kvmbridge.xml
sudo virsh net-start host-bridge
sudo virsh net-autostart host-bridge
```


Also define and start the default network using the following commands:
```bash
sudo virsh net-define default
sudo virsh net-start default
sudo virsh net-autostart default
```

By following these steps, you will have set up KVM and QEMU with a host-bridged network configuration. This setup allows your virtual machines to share the same subnet as your host machine, enabling other devices on the network to SSH into the virtual machines directly.

## Installing Vinsta
After completing the KVM and QEMU setup, you can proceed to set up the Vinsta server and prepare it for production use.

### Step 1: Installing Bun
```bash
curl -fsSL https://bun.sh/install | bash # for macOS, Linux, and WSL
```

### Step 2: Clone the Vinsta repository
```bash
git clone https://github.com/koompi/vinsta
```

### Step 3: Install, Build
Navigate to the Vinsta directory, install dependencies, and build the project:
```bash
cd vinsta
bun install
bun run build
```

### Step 4: Download additional resources
To ensure Vinsta works correctly, you need to have at least one ISO file available, as well as a preinstalled disk image.

#### Download KOOMPI-Server ISO
```bash
wget https://dev.koompi.org/iso/server/koompi-server-x86_64.iso -O iso/koompi-server-x86-64.iso

```
<b>Note:</b> You don't need to download the preinstalled disk image below if you plan to create your own preinstalled disk image.
Also refer to this link to learn more about `iso` folder: [Click me](https://github.com/koompi/vinsta/tree/main/iso)

#### Download KOOMPI-Server Preinstalled Disk Image
```bash
wget https://dev.koompi.org/iso/qcow/koompi-preinstalled-vm-1.tar.gz -O pre-images/koompi-preinstalled-vm-1.tar.gz
tar -xzvf pre-images/koompi-preinstalled-vm-1.tar.gz
```
<b>Note:</b> You need this disk image (KOOMPI Server) if you want to deploy a preinstalled virtual machine instead of creating a new one and going through the installation process.

<b>Note:</b> You can also download just the preinstalled disk image; there is no need to download the ISO if you do so.
Also refer to this link to learn more about `pre-image` folder: [Click me](https://github.com/koompi/vinsta/tree/main/pre-images)

### Step 5: Start the Vinsta Server
<b>Recommended:</b> Run the server as `sudo` since many server functions require elevated privileges:
```bash
sudo bun start
```

By completing all of the guide above, you have successfully deployed Vinsta Server and ready to use it:

### Vinsta Command Line Application

Please refer to the detailed cli usage guide for Vinsta:

[Vinsta](../../cli/README.md)
