import express, { Request, Response } from 'express';
import { createUser, getAllUsers, getUserById, getUserByFirebaseUid } from '../controllers/userController';

const UserRouter = express.Router();

// Test route
UserRouter.get("/test", (req: Request, res: Response) => {
    res.send("User route is working");
});

// Get all users route
UserRouter.get("/all", getAllUsers);

// Get user by ID route
UserRouter.get("/:id", getUserById);

// Create user route
UserRouter.post("/create", createUser);

// Get user by Firebase UID route
UserRouter.get("/firebase/:uid", getUserByFirebaseUid);

export default UserRouter;