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

//Get all chat rooms for a user
export const getChatRoomsForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({
            firebaseUid: req.user.uid
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user.chatRooms);
    } catch (error) {
        next(error);
    }
}

export const mockCreateChatRoom = async (req: Request, res: Response, next: NextFunction) => {
    const participant = req.body.participants;
    const projectId = req.body.projectId;
    const firebaseUser = await User.findOne({
        firebaseUid: req.user.uid
    });

    if (!firebaseUser) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const user = await User.findOne({
        firebaseUid: req.user.uid,
    });

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    const mongoParticipant = await User.findOne({
        _id: { $in: participant }
    });

    if (!mongoParticipant) {
        res.status(404).json({ message: "Participant not found" });
        return;
    }

    const project = await Project.findById(projectId);

    if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
    }

    console.log("creating mock chat room");


    const chatRoom = await ChatRoom.create({
        projectId,
        creator: user._id,
        participants: [user._id, participant],
        lastActive: new Date(),
        createdAt: new Date(),

    });

    const chatHistory = await ChatHistory.create({
        chatRoom: chatRoom._id,
        messages: [],
    });
    chatRoom.chatHistory = chatHistory._id as mongoose.Types.ObjectId;
    await chatRoom.save();

    //Update user chatRooms
    user.chatRooms.push({
        chatRoomId: chatRoom._id as mongoose.Types.ObjectId,
        chatRoomName: project.name
    });
    await user.save();

    //Update participant chatRooms
    mongoParticipant.chatRooms.push({
        chatRoomId: chatRoom._id as mongoose.Types.ObjectId,
        chatRoomName: project.name
    });
    await mongoParticipant.save();
    res.status(201).json(chatRoom);

}
