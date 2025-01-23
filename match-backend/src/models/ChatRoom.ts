import mongoose, { Schema, Document } from 'mongoose';

interface IChatRoom extends Document {
  projectId: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  chatHistory: mongoose.Types.ObjectId;
  lastActive: Date;
  createdAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }, { required: true }],
  chatHistory: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatHistory', default: null },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);

export default ChatRoom; 