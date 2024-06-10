## Vinsta Pre-installed Virtual Machine Images

This folder contains virtual machine disk images (in the .qcow2 format) generated through the Vinsta API. These images represent snapshots of pre-installed operating systems and configurations, ready for rapid deployment of new virtual machines.

## Benefits of Using Vinsta Images:

- <b>Faster Deployment</b>: Skip lengthy installation processes by using pre-configured virtual machine images.
- <b>Standardization</b>: Ensure consistency across your virtual machine infrastructure with pre-defined configurations.
- <b>Version Control</b>: Easily track and manage different versions of your virtual machine images.

## Download Existing Image Disk and from our site

```bash
wget https://dev.koompi.org/iso/qcow/koompi-preinstalled-vm-1.tar.gz # Run this inside the pre-images folder
tar -xzvf koompi-preinstalled-vm-1.tar.gz
```

<b>Note:</b>You need this disk image (KOOMPI Server) if you want to deploy a preinstalled virtual machine instead of creating a new one and goes through the installation.

if you don't want to use KOOMPI Server, you can create your own prebuilt image, by running the API Create and then move the *.qcow2 file to `pre-images` folder.

## Usage:

```bash
vinsta --clone
```