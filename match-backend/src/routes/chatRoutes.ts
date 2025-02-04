import express from "express";
import { getChatRoom, getChatRoomsForUser, createChatRoom, mockCreateChatRoom } from "../controllers/chatRoomController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getChatHistory } from "../controllers/chatHistoryController";
const router = express.Router();

router.get("/chatRooms", authMiddleware, getChatRoomsForUser);
router.get("/chatRoom/:id", authMiddleware, getChatRoom);
router.post("/chatRoom", authMiddleware, createChatRoom);
router.post("/mockCreateChatRoom", authMiddleware, mockCreateChatRoom);
router.get("/chatHistory/:id", authMiddleware, getChatHistory);
export default router;
