import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import UserRouter from "./routes/userRoutes";
import ProjectRoutes from "./routes/projectRoutes";
import AdminRoutes from "./routes/adminRoutes";
import AuthRouter from "./routes/authRoute";
import ChatRoutes from "./routes/chatRoutes";
import RecommenderRoutes from "./routes/recommenderRoutes";
import cors from "cors";
import SwipeRouter from "./routes/swipeRoutes";



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use("/users", UserRouter);
app.use("/projects", ProjectRoutes);
app.use("/admin", AdminRoutes);
app.use("/auth", AuthRouter);
app.use("/chat", ChatRoutes);
app.use("/match", RecommenderRoutes);
app.use("/swipe", SwipeRouter);


// Test route
app.get("/ping", (req, res) => {
  res.send("pong");
});

export default app;
