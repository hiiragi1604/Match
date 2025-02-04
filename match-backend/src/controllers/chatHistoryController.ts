import { Request, Response } from "express";
import ChatRoom from "../models/ChatRoom";
import ChatHistory from "../models/ChatHistory";

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const chatRoomId = req.params.id;
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      res.status(404).json({ message: "Chat room not found" });
      return;
    }const chatHistory = await ChatHistory.findById(chatRoom.chatHistory)
    .populate({
        path: "messages",
        populate: {
            path: "sender",
            select: "personalInfo.name _id firebaseUid" // Only get name and _id fields
        }
    });
    
    res.status(200).json(chatHistory);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history" });
    return;
  }
};
