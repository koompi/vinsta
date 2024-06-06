## Setting up Host Bridge on the host

## Installing Dependencies
```bash
sudo pacman -Sy netplan # On ubuntu, Google it
```

## Step 1: Setting up netplan bridge

Create /etc/netplan/01-kvmbridge.yml. Example:

```text
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
        forward-delay: 15wwp0s21f0u3i4
```

<b>Notes</b>: Network interface should be changed, depending on your ethernet interfaces. Run:

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

## Step 2: Tell KVM how to access the connection

Create a file kvmbridge.xml with the following contents:
```text
<network>
  <name>host-bridge</name>
  <forward mode="bridge"/>
  <bridge name="br0"/>
</network>
```

### Enable the bridge:

```bash
sudo virsh net-define kvmbridge.xml
sudo virsh net-start host-bridge
sudo virsh net-autostart host-bridge
```