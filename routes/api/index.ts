import type { Request, response, Response } from "express";
import { createVirtualMachine } from "../../qemu/createVirtualMachine";
import { removeVirtualMachine } from "../../qemu/removeVirtualMachine";
import { startVirtualMachine } from "../../qemu/startVirtualMachine";
import { stopVirtualMachine } from "../../qemu/stopVirtualMachine";
import { checkInfoVirtualMachine } from "../../qemu/checkInfoVirtualMachine";

export const createVM = async (req: Request, res: Response) => {
  // console.log(req.body);

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
    console.error("Error creating VM:", error);
    res.status(500).json({ message: "Error creating VM", error });
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
    console.error("Error creating VM:", error);
    res.status(500).json({ message: "Error creating VM", error });
  }
};

export const startVM = async (req: Request, res: Response) => {
  try {
    const vmOptions = {
      name: req.body.name || "default_name",
    };

    const startVM = await startVirtualMachine(vmOptions);
    res.status(201).json({ message: "Virtual Machine is starting", vm: startVM });
  } catch (error) {
    console.error("Error starting VM:", error);
    res.status(500).json({ message: "Error starting the VM", error });
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
    console.error("Error stoping VM:", error);
    res.status(500).json({ message: "Error stopping the VM", error });
  }
};


export const checkInfoVM = async (req: Request, res: Response) => {
  try {
    const vmOptions = {
      name: req.body.name || "default_name",
    };

    const stopVM = await checkInfoVirtualMachine(vmOptions);
    res.status(201).json({ message: "Checking info of the virtual machine", vm: stopVM });
  } catch (error) {
    console.error("Error failed to check VM:", error);
    res.status(500).json({ message: "Error failed to check the virtual machine", error });
  }
};

export const cloneVM = (req: Request, res: Response) => {
  // logic to delete user by ID from the database
};

export const listAllVM = (req: Request, res: Response) => {
  // logic to delete user by ID from the database
};
