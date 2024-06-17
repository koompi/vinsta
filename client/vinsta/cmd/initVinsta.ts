import inquirer from "inquirer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// MongoDB Connection Setup
mongoose.connect('mongodb://localhost:27017/vinsta', {
});
const db = mongoose.connection;

// Define Schema for Master Key
const masterKeySchema = new mongoose.Schema({
  key: String, // Encrypted or hashed master key
});

// Model for Master Key
const MasterKey = mongoose.model('MasterKey', masterKeySchema);

export async function initVinsta() {
  const { initOption } = await inquirer.prompt([
    {
      type: "list",
      name: "initOption",
      message: "Select an option to initialize:",
      choices: ["Server", "Client"],
    }
  ]);

  if (initOption === "Server") {
    await initializeServer();
  } else if (initOption === "Client") {
    await initializeClient();
  }
}

async function initializeServer() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the Vinsta server name you want to create:",
      default: "Vinsta-Server-1",
    },
    {
      type: "input",
      name: "databaseip",
      message: "Enter the IP Address of the MongoDB:",
      default: "localhost",
    },
    {
      type: "input",
      name: "databaseport",
      message: "Enter the Port of the MongoDB:",
      default: "27017",
    },
    {
      type: "input",
      name: "databasepassword",
      message: "Enter the Password of the MongoDB:",
      default: "zxcvahsdkjfqwer",
    },
    {
      type: "password",
      name: "masterkey",
      message: "Create a master key that is used for accessing the Vinsta Server:",
      mask: '*', // Mask input for security
    },
  ]);

  // Connect to MongoDB
  await mongoose.connect(`mongodb://${answers.databaseip}:${answers.databaseport}/vinsta`, {
    user: 'admin',
    pass: answers.databasepassword,
  });

  // Hash the master key
  const hashedKey = await bcrypt.hash(answers.masterkey, 10);

  // Store hashed master key in MongoDB
  const newMasterKey = new MasterKey({ key: hashedKey });
  await newMasterKey.save();

  console.log('Successfully initialized the Vinsta Server');
  mongoose.disconnect(); // Disconnect from MongoDB
}

async function initializeClient() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Create your own nickname:",
      default: "jiren",
    },
    {
      type: "input",
      name: "number",
      message: "Enter your mobile phone number:",
      default: "85515780491",
    },
    {
      type: "input",
      name: "databaseip",
      message: "Enter the IP Address of the MongoDB:",
      default: "localhost",
    },
    {
      type: "input",
      name: "databaseport",
      message: "Enter the Port of the MongoDB:",
      default: "27017",
    },
    {
      type: "input",
      name: "databasepassword",
      message: "Enter the Password of the MongoDB:",
      default: "zxcvahsdkjfqwer",
    },
    {
      type: "password",
      name: "masterkey",
      message: "Enter the master key that is used for accessing the Vinsta Server:",
      mask: '*', // Mask input for security
    },
  ]);

  try {
    // Connect to MongoDB
    await mongoose.connect(`mongodb://${answers.databaseip}:${answers.databaseport}/vinsta`, {
      user: 'admin',
      pass: answers.databasepassword,
    });

    // Retrieve hashed master key from MongoDB
    const storedMasterKey = await MasterKey.findOne();

    if (!storedMasterKey) {
      console.error('Master key not found in MongoDB.');
      mongoose.disconnect();
      return;
    }

    // Compare provided master key with stored hashed key
    if (!answers.masterkey) {
      console.error('No master key provided.');
      mongoose.disconnect();
      return;
    }

    const isMatch = await bcrypt.compare(answers.masterkey, storedMasterKey.key || '');

    if (!isMatch) {
      console.error('Invalid master key.');
      mongoose.disconnect();
      return;
    }

    // Proceed with account creation
    console.log('Master key verified. Creating account...');

    // Implement account creation logic here (e.g., save nickname and number to MongoDB)

    console.log(`Account created successfully for ${answers.name} with number ${answers.number}`);
    mongoose.disconnect(); // Disconnect from MongoDB
  } catch (error) {
    console.error('Error during initialization:', error);
    mongoose.disconnect();
  }
}