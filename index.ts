import express from "express";
import vmRoutes from "./routes/vmRoutes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();  // Correct way to configure dotenv
const app = express();
app.use(cors())



app.use(express.json());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins for testing purposes
  next();
});


app.use("/api", vmRoutes);
app.use(express.static(__dirname + '/public'));
const PORT = Number(process.env.PORT || 3000); 
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

process.on("unhandledRejection", (error) => {})
process.on("uncaughtExeption", (error) => {})
