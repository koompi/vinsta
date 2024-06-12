# Vinsta Command line tool

## Installation
Once you have set up the Vinsta server, you can use the Vinsta CLI tool to access all the APIs provided by the Vinsta Server:


```bash
    curl -fsSL https://github.com/koompi/vinsta/raw/main/client/vinsta/script/install_vinsta | bash
```

## <summary><b>vinsta</summary>

![alt text](../../assets/cmd-assets/vinsta.jpg "Title")


## <summary><b>vinsta --init</summary>

![alt text](../../assets/cmd-assets/init.jpg "Title")

First thing before doing anything else, you must connect to your own Vinsta Server IP and PORT first.

```bash
vinsta --init
```
Example Output:

```bash
hangsia@koompi ~ % vinsta --init
? Enter the host of the Vinsta server: 10.2.0.150
? Enter the port of the Vinsta server: 3333
SSH configuration updated successfully.
Initialization state saved to /home/hangsia/.vinsta/env

```

<b>NOTE:</b> `10.2.0.150` is the IP of my server where i deployed the Vinsta Server and `3333` is the default port of the Vinsta.

- [Create a virtual machine ](./create/README.md)
- [Clone an existing virtual machine](./clone/README.md)
- [Start a virtual machine ](./start/README.md)
- [Stop a existing virtual machine](./stop/README.md)
- [Remove a virtual machine ](./remove/README.md)
- [Check an virtual machine](./check/README.md)
- [List all of the virtual machine](./listall/README.md)
- [Back to Previous Section](../installation-guide/koompi/README.md)

