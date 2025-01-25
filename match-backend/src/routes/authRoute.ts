import express, { Request, Response, NextFunction } from "express";
import { verifyUser } from "../controllers/authController";

const AuthRouter = express.Router();

// Test route
AuthRouter.get("/test", (req: Request, res: Response) => {
    res.send("Auth route is working");
});

AuthRouter.post("/verifyUser", verifyUser);

export default AuthRouter;