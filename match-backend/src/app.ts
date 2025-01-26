import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import UserRouter from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import adminRoute from "./routes/adminRoutes";
import AuthRouter from "./routes/authRoute";
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
app.use("/auth", AuthRouter);

// Test route
app.get("/ping", (req, res) => {
  res.send("pong");
});

export default app;
