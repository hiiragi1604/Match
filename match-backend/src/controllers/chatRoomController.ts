import { Request, Response, NextFunction } from "express";
import ChatRoom from "../models/ChatRoom";
import Project from "../models/Project";
import User from "../models/User";
import mongoose from "mongoose";
import ChatHistory from "../models/ChatHistory";

//Create a new chat room
export const createChatRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.userId || !req.body.projectId) {
            res.status(400).json({ message: "Missing userId or projectId" });
            return;
        }
        const { userId, projectId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const participants = [user._id, project.members.map((member) => {
            if (member.role === "Owner") {
                return member.user;
            }
        })];
        const chatRoomData = {
            projectId,
            creator: userId,
            participants,
            lastActive: new Date(),
            createdAt: new Date(),
        };
        const chatRoom = await ChatRoom.create(chatRoomData);
        const chatHistory = await ChatHistory.create({
            chatRoom: chatRoom._id,
            messages: [],
        });
        chatRoom.chatHistory = chatHistory._id as mongoose.Types.ObjectId;
        await chatRoom.save();
        res.status(201).json(chatRoom);
    } catch (error) {
        next(error);
    }
}

//Get chat room
export const getChatRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatRoom = await ChatRoom.findById(req.params.id);
        if (!chatRoom) {
            res.status(404).json({ message: "Chat room not found" });
            return;
        }
        res.status(200).json(chatRoom);
    } catch (error) {
        next(error);
    }
}