import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import mongoose from "mongoose";

//Get all users
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Get user by ID
export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }
        next(error);
    }
};

// Create user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            res.status(400).json({ message: "User data is required" });
            return;
        }
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: "Invalid user data" });
            return;
        }
        next(error);
    }
};

