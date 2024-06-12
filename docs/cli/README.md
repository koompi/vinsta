# Vinsta Command line tool

## Installation
After you set up Vinsta server already, you can use Vinsta cli tool to access every API Vinsta Server have:

```bash
    curl -fsSL https://github.com/koompi/vinsta/raw/main/client/vinsta/script/install_vinsta | bash
```

##

<details close="close">
<summary><b>POST</b> /api/create</summary>

```json
{
    "name": "koompi-vm-1",
    "iso": "koompi",
    "ram": "4096",
    "disk": "15G",
    "cpu": "2",
    "network": "br10",
    "bootOption": "uefi",
    "arch": "x64"
}
```
</details>
