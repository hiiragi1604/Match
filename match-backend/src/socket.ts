import { Server, Socket } from "socket.io";
import { auth } from "./config/firebase-admin";
import ChatHistory from "./models/ChatHistory";
import User from "./models/User";
import { Types } from 'mongoose';
import { IMessage } from "./models/ChatHistory";

interface CustomSocket extends Socket {
  userId?: string;
  username?: string;
  firebaseUid?: string;
}


export const setupSocketIO = (io: Server) => {
  // Middleware to authenticate socket connections
  io.use(async (socket: CustomSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error("Authentication error: Token not provided");
      }

      const decodedToken = await auth.verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!user) {
        throw new Error("User not found");
      }

      socket.userId = (user._id as Types.ObjectId).toString();
      socket.username = user.personalInfo.name;
      socket.firebaseUid = user.firebaseUid;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: CustomSocket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join a chat room
    socket.on("join_chat", async (chatRoomId: string) => {
      try {
        // Leave all other rooms first
        socket.rooms.forEach(room => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        // Join the chat room
        socket.join(chatRoomId);
        console.log(`User ${socket.userId} joined chat ${chatRoomId}`);
      } catch (error) {
        console.error("Error joining chat:", error);
      }
    });

    // Handle new messages from users
    socket.on("send_message", async (data: { chatRoomId: string, content: string, firebaseUid: string }) => {
      try {
        const { chatRoomId, content, firebaseUid } = data;
        
        // Save message to database
        const chatHistory = await ChatHistory.findOne({ chatRoom: chatRoomId });
        if (chatHistory && socket.userId) {
          chatHistory.messages.push({
            sender: new Types.ObjectId(socket.userId),
            content,
            timestamp: new Date()
          });

          await chatHistory.save();

          // Update message to all users in the chat room
          io.to(chatRoomId).emit("receive_message", {
            sender: {
              firebaseUid: firebaseUid,
              _id: socket.userId,
              name: socket.username
            },
            content,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}; 