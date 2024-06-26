import inquirer from "inquirer";
import ora from "ora";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDB } from "../../../../shells/connectDB";
import VMOptionsModel from "../../../../models/vmOptionsSchema";
import { userSchema } from "../../../../models/userSchema";
import crypto from "crypto";

const User = mongoose.model("User", userSchema);

export async function importExistingVM() {

    const loginaccount = await inquirer.prompt([
        {
            type: "input",
            name: "account_username",
            message: "Enter your account username:",
            default: "jiren",
        },
        {
            type: "password",
            name: "account_password",
            message: "Enter your account password:",
            mask: "*",
        },
    ]);

    try {
        // Connect to MongoDB
        await connectDB();
        const spinner = ora("Authorizing user...").start();

        // Authenticate user
        const user = await User.findOne({ username: loginaccount.account_username });
        if (!user) {
            spinner.fail(`User "${loginaccount.account_username}" not found.`);
            mongoose.disconnect();
            return;
        }

        const isPasswordValid = await bcrypt.compare(loginaccount.account_password, user.password || '');
        if (!isPasswordValid) {
            spinner.fail("Invalid account password.");
            mongoose.disconnect();
            return;
        }
        spinner.succeed("Authorized...");

    } catch (error) {
        console.log(error);
    }

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the name of the virtual machine:",
            default: "koompi-vm-1",
        },
        {
            type: "input",
            name: "iso",
            message: "Enter the ISO of the virtual machine:",
            default: "koompi",
        },
        {
            type: "input",
            name: "ram",
            message: "Enter the RAM size (in MB) of the virtual machine:",
            default: "4096",
        },
        {
            type: "input",
            name: "disk",
            message: "Enter the disk size (in GB) of the virtual machine:",
            default: "15G",
        },
        {
            type: "input",
            name: "cpu",
            message: "Enter the number of CPUs of the virtual machine:",
            default: "2",
        },
        {
            type: "input",
            name: "network",
            message: "Enter the network of the virtual machine:",
            default: "host-bridge",
        },
        {
            type: "input",
            name: "bootOption",
            message: "Enter the boot option of the virtual machine:",
            default: "uefi",
        },
        {
            type: "input",
            name: "arch",
            message: "Enter the architecture of the virtual machine:",
            default: "x64",
        },
        {
            type: "input",
            name: "vmusername",
            message: "Enter username of the virtual machine:",
            default: "admin",
        },
        {
            type: "password",
            name: "vmpassword",
            message: "Enter password of the virtual machine:",
            mask: "*",
        },
        {
            type: "input",
            name: "vmip",
            message: "Enter IP address of the Virtual Machine:",
            default: "10.2.0.12",
        },
    ]);

    const spinner = ora("Importing existing virtual machine... Please wait.").start();

    try {
        // Connect to MongoDB
        await connectDB();

        // Authenticate user
        const user = await User.findOne({ username: loginaccount.account_username });
        if (!user) {
            spinner.fail(`User "${loginaccount.account_username}" not found.`);
            mongoose.disconnect();
            return;
        }

        const isPasswordValid = await bcrypt.compare(loginaccount.account_password, user.password || '');
        if (!isPasswordValid) {
            spinner.fail("Invalid account password.");
            mongoose.disconnect();
            return;
        }

        // Check if VM already exists
        const existingVM = await VMOptionsModel.findOne({ name: answers.name });
        if (existingVM) {
            spinner.fail(`Virtual machine with the name "${answers.name}" already exists.`);
            mongoose.disconnect();
            return;
        }

        // Retrieve user-specific encryption information
        const encryptionInfo = user.encryptionInfo;
        if (!encryptionInfo || !encryptionInfo.salt || !encryptionInfo.iv) {
            spinner.fail("Encryption information not found or incomplete.");
            mongoose.disconnect();
            return;
        }

        // Encrypt vmpassword using the derived encryption key and iv
        const key = crypto.pbkdf2Sync(loginaccount.account_password, Buffer.from(encryptionInfo.salt, 'hex'), 100000, 32, 'sha512');
        const newCipher = crypto.createCipheriv("aes-256-cbc", key, Buffer.from(encryptionInfo.iv, 'hex'));
        let newEncryptedMasterkey = newCipher.update(answers.vmpassword, "utf8", "hex");
        newEncryptedMasterkey += newCipher.final("hex");

        // Store newEncryptedMasterkey along with other VM options
        const vmOptions = new VMOptionsModel({
            name: answers.name,
            iso: answers.iso,
            ram: answers.ram,
            disk: answers.disk,
            cpu: answers.cpu,
            network: answers.network,
            bootOption: answers.bootOption,
            arch: answers.arch,
            vmusername: answers.vmusername,
            vmpassword: `${encryptionInfo.salt}:${encryptionInfo.iv}:${newEncryptedMasterkey}`,
            ipaddr: answers.vmip,
        });
        await vmOptions.save();
        spinner.succeed("Virtual machine imported successfully");
        console.log('Successfully inserted the VM data into the database collection');
    } catch (error) {
        spinner.fail("Error creating virtual machine");
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
}
