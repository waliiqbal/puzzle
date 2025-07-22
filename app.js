import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from "./lib/db.js"
import CustomRoutes from "./routes/routes.js";
import dotenv from 'dotenv';
dotenv.config()

const app = express();
const port = process.env.port || 3002;

app.use(cors());
app.use(express.static('public')); // ✅ Corrected
app.use(express.json({ limit: '50mb' })); // ✅ Corrected

// Initialize routes before starting the server
CustomRoutes(app, express);

// Connect to DB and start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
});
