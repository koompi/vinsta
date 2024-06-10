## Virtual Machine ISOs
This folder contains downloadable disk images (ISOs) for installing various operating systems on your virtual machines. These ISOs provide the necessary installation files to create a virtual instance with a specific operating system.

#### Example:

- archlinux-x86_64.iso
- koompi-server-x86_64.iso
- ubuntu-x86_64.iso
- manjaro-x86_64.iso

##

For your convenience, you can download the ISOs directly from our website:

[KOOMPIOS Server](https://dev.koompi.org/iso/server/koompi-server-x86-64.iso)

<b>Important</b>: The username and password provided during download are temporary credentials and 
must be changed during the operating system setup process.

<b>Username: koompilive                  
Password: 123
</b>

### Step 1: After create the instance you will receive IP address of the machine
```bash
ssh koompilive@ipaddress # Replace ipadress with real addr
```

### Step 2: Edit the username and password

```bash
vim koompi.json
```

### Step 3: Start the installation

```bash
sudo pibee config koompi.json
```

### Step 4: Restart the instance by calling the API or simple run `sudo reboot`

```bash
ssh newusername@ipaddress # Replace with new user and ip
```


## Note:
If you can't ssh into the instance, you need to remove the old known ssh in the ~/.ssh/known_hosts

```bash
vim ~/.ssh/known_hosts # Remove the line where it show IP
```