import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase-admin";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = await auth.verifyIdToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}