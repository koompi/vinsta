import type { Request, response, Response } from "express";
import { createVirtualMachine } from "../../vm/createVirtualMachine";
import { removeVirtualMachine } from "../../vm/removeVirtualMachine";
import { startVirtualMachine } from "../../vm/startVirtualMachine";
import { stopVirtualMachine } from "../../vm/stopVirtualMachine";
import { checkInfoVirtualMachine } from "../../vm/checkInfoVirtualMachine";
import { cloneVirtualMachine } from "../../vm/cloneVirtualMachine";
import { listAllVirtualMachines } from "../../vm/listAllVirtualMachine";
import { backupVirtualMachine } from "../../vm/backupVirtualMachine";
import { restoreVirtualMachine } from "../../vm/restoreVirtualMachine";
// import type { VMOptionsV2 } from '../../types/VMOptionsV2';

export const createVM = async (req: Request, res: Response) => {

  try {
    const vmOptions = {
      name: req.body.name || "default_name",
      iso: req.body.iso,
      ram: req.body.ram,
      disk: req.body.disk,
      cpu: req.body.cpu,
      network: req.body.network,
      bootOption: req.body.bootOption,
      arch: req.body.arch,
    };

    const createdVM = await createVirtualMachine(vmOptions);
    res.status(201).json({ message: "VM created successfully", vm: createdVM });
  } catch (error) {
    console.error("This VM already exists:", error);
    res.status(500).json({ message: "This VM already exists", error });
  }
};

export const removeVM = async (req: Request, res: Response) => {
  try {
    const vmOptions = {
      name: req.body.name || "default_name",
    };

    const removeVM = await removeVirtualMachine(vmOptions);
    res.status(201).json({ message: "VM successfully removed", vm: removeVM });
  } catch (error) {
    console.error("Virtual machine not found:", error);
    res.status(500).json({ message: "Virtual machine not found", error });
  }
};

export const startVM = async (req: Request, res: Response) => {
  try {
    const vmOptions = {
      name: req.body.name || "default_name",
    };

    const startVM = await startVirtualMachine(vmOptions);
    res.status(201).json({ message: "Virtual Machine is starting", vm: startVM });
  } catch (error: any) {
    if (error.message.includes("not found")) {
      console.error("Virtual machine not found:", error);
      res.status(500).json({ message: "Virtual machine not found", error });
    } else if (error.message.includes("already running")) {
      console.error("Virtual machine already started:", error);
      res.status(500).json({ message: "Virtual machine already started", error });
    } else {
      console.error("Virtual machine not found:", error);
      res.status(500).json({ message: "Virtual machine not found", error });
    }
  }
};
export const stopVM = async (req: Request, res: Response) => {
  try {
    const vmOptions = {
      name: req.body.name || "default_name",
    };

    const stopVM = await stopVirtualMachine(vmOptions);
    res.status(201).json({ message: "Virtual Machine is stopping", vm: stopVM });
  } catch (error) {
    console.error("Virtual machine not found:", error);
    res.status(500).json({ message: "Virtual machine not found", error });
  }
};

export const checkInfoVM = async (req: Request, res: Response) => {
  try {
    const vmOptions = {
      name: req.body.name || "default_name",
    };

    const table = await checkInfoVirtualMachine(vmOptions);
    res.status(201).json({ message: "Checking info of the virtual machine", table });
  } catch (error) {
    console.error("Virtual machine not found:", error);
    res.status(500).json({ message: "Virtual machine not found", error });
  }
};

export const cloneVM = async (req: Request, res: Response) => {
  try {
    const VMOptionsV2 = {
      image: req.body.image || "koompi-preinstalled-vm-1",
      name: req.body.name || "koompi-vm-1",
      ram: req.body.ram,
      disk: req.body.disk,
      cpu: req.body.cpu,
    };

    const cloneVM = await cloneVirtualMachine(VMOptionsV2);
    res.status(201).json({ message: "Successfully cloned the virtual machine", vm: cloneVM });
  } catch (error) {
    console.error("Error clone VM:", error);
    res.status(500).json({ message: "Error failed to clone the virtual machine", error });
  }
};

export const listAllVM = async (req: Request, res: Response) => {
  try {
    const table = await listAllVirtualMachines();
    res.json({ message: "Successfully listall the virtual machine", table });
  } catch (error) {
    res.status(500).json({ message: "Failed to list all virtual machines" });
  }
};


export const backupVM = async (req: Request, res: Response) => {
  try {
    const vmOptions = {
      name: req.body.name || "koompi-vm-1",
    };

    const backupVM = await backupVirtualMachine(vmOptions);
    res.status(201).json({ message: "Backing up the virtual machine", vm: backupVM });
  } catch (error) {
    console.error("Virtual machine not found:", error);
    res.status(500).json({ message: "Virtual machine not found", error });
  }
};

export const restoreVM = async (req: Request, res: Response) => {
  try {
    const vmOptions = {
      name: req.body.name || "koompi-vm-1",
    };

    const restoreVM = await restoreVirtualMachine(vmOptions);
    res.status(201).json({ message: "Restoring the virtual machine", vm: restoreVM });
  } catch (error) {
    console.error("Virtual machine not found:", error);
    res.status(500).json({ message: "Virtual machine not found", error });
  }
};
