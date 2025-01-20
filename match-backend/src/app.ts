import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import UserRouter from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import adminRoute from "./routes/adminRoutes";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use("/user", UserRouter);
app.use("/projects", projectRoutes); 
app.use("/admin", adminRoute);

// Test route
app.get("/ping", (req, res) => {
  res.send("pong");
});

export default app;
