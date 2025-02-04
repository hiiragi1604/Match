import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

interface IChatHistory extends Document {
  chatRoom: mongoose.Types.ObjectId;
  messages: IMessage[];
}

const messageSchema = new Schema<IMessage>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatHistorySchema = new Schema<IChatHistory>({
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  messages: [messageSchema],
});

const ChatHistory = mongoose.model<IChatHistory>("ChatHistory", chatHistorySchema);

export default ChatHistory;