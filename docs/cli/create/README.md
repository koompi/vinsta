## <summary><b>vinsta --create | Create a new Virtual Machine</summary>

### Step 1: run `vinsta --create`

![alt text](../../../assets/cmd-assets/create/create.png "Title")

### Step 2: SSH into the VM (Part1)
Using the provided information, edit the installation config if you want to customize the default username and password.

![alt text](../../../assets/cmd-assets/create/ssh-1.png "Title")
![alt text](../../../assets/cmd-assets/create/edit-koompi-json.png "Title")

Find and update the following fields to your desired values:

```json
"name": "admin",
"password": "123123123"
```
### Step 3: Start the installation
![alt text](../../../assets/cmd-assets/create/start-installation.png "Title")

Once you are ready with the config, simply run the command below to start the installation:

```bash
sudo pibee config koompi.json
```

### Step 4: Reboot the VM
![alt text](../../../assets/cmd-assets/create/reboot-after-install.png "Title")

When you see the following message, the installation is complete. Reboot the VM and SSH into it using your new username and password.

```bash
sudo reboot
```

<b>NOTE:</b> You might need to wait a few moments, before you can access the machine because we are using host-bridge here, so the IP address will take sometimes to respond back.

### Step 5: SSH into the VM (Part2)
![alt text](../../../assets/cmd-assets/create/ssh-2.png "Title")

```bash
ssh admin@10.2.0.111
```

Now you have a virtual machine ready for production use.

## Additional Links

- [Back to Previous Section](../README.md)
- [Clone Command Documentation](../clone/README.md)
- [Start Command Documentation](../start/README.md)
- [Stop Command Documentation](../stop/README.md)
- [Remove Command Documentation](../remove/README.md)
- [Check Command Documentation](../check/README.md)
- [Listall Command Documentation](../listall/README.md)