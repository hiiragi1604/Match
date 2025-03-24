import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Project from "../models/Project";
import User from "../models/User";
import Swipe from "../models/Swipe";

//save the swipe action of the user
export const swipeProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { swiper, targetProject, action, timestamp } = req.body;

        if (!swiper || !targetProject || !action || !timestamp) {
            res.status(400).json({ message: "Invalid request data" });
            return;
        }

        const user = await User.findById(swiper);
        const project = await Project.findById(targetProject);
        
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        const existingSwipe = await Swipe.findOne({ swiper: swiper, targetProject: targetProject });
        if (existingSwipe) {
            res.status(400).json({ message: "User has already swiped on this project" });
            return;
        }

        const swipeRecord = new Swipe({
            swiper: swiper,
            targetProject: targetProject,
            action: action,
            timestamp: timestamp,
        });
        await swipeRecord.save();

        res.status(201).json(swipeRecord);
        return;
    } catch (error) {
        console.error("Error in swipeProject:", error);
        next(error);
    }
};

//get the swipe history of the user
export const getSwipeHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        const history = await Swipe.find({ swiper: userId }).sort({ timestamp: -1 });
        res.status(200).json(history);
        return;
    } catch (error) {
        console.error("Error in getSwipeHistory:", error);
        next(error);
    }
};
