## To List all of the available virtual machine on Vinsta Server

Simply Run:
```
vinsta --listall
```
Example Output:
```bash
hangsia@koompi ~ % vinsta --listall
✔ Configuration loaded successfully
✔ Successfully listed all virtual machines
┌─────┬──────────────────────────────┬───────────────┬────────────────────┐
│ ID  │ Name                         │ Status        │ IP Address         │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ 5   │ riverbase-staging-vm-1       │ running       │ 10.2.0.123         │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ 97  │ koompi-vm-1                  │ running       │ 10.2.0.92          │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ 98  │ koompi-vm-2                  │ running       │ 10.2.0.95          │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ 101 │ koompi-vm-3                  │ running       │ 10.2.0.121         │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ 102 │ koompi-demo-vm-1             │ running       │ 10.2.0.117         │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ 104 │ koompi-demo                  │ running       │ 10.2.0.107         │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ -   │ koompi-preinstalled-vm-1     │ shut          │ undefined          │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ -   │ selendra-white-vm            │ shut          │ undefined          │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ -   │ selendra-white-vm-01         │ shut          │ undefined          │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ -   │ selendra-white-vm-1          │ shut          │ undefined          │
├─────┼──────────────────────────────┼───────────────┼────────────────────┤
│ -   │ selendra-white-vm-1-1        │ shut          │ undefined          │
└─────┴──────────────────────────────┴───────────────┴────────────────────┘

```

## Additional Links

- [Back to Previous Section](../README.md)
- [Create Command Documentation](../create/README.md)
- [Clone Command Documentation](../clone/README.md)
- [Start Command Documentation](../start/README.md)
- [Stop Command Documentation](../stop/README.md)
- [Remove Command Documentation](../remove/README.md)
- [Check Command Documentation](../check/README.md)