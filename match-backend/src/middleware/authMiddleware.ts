import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase-admin";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = await auth.verifyIdToken(token);
        if (!decodedToken) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}