import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import vmRoutes from "./routes/vmRoutes";

dotenv.config();  // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins for testing purposes
  next();
});

// Form the MongoDB connection string using environment variables
const { DATABASE_IP, DATABASE_PORT, DATABASE_NAME } = process.env;
const DATABASE_URL = `mongodb://${DATABASE_IP}:${DATABASE_PORT}/vinstadb`;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB connected successfully');
  } catch (error: any) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

app.use("/api", vmRoutes);
app.use(express.static(__dirname + '/public'));

const PORT = Number(process.env.PORT || 3333);
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
