import express, { Request, Response } from 'express';
import { addMember } from "../controllers/projectController";

const adminRoute = express.Router();

// Test route
adminRoute.get("/test", (req: Request, res: Response) => {
    res.send("Admin route is working");
});

// Add member to project
adminRoute.put("/addMember", addMember);

export default adminRoute;