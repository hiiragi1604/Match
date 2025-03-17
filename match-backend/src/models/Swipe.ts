import mongoose, { Schema, Document } from "mongoose";

interface ISwipe {
  swiper: mongoose.Types.ObjectId; // The user who swiped
  targetProject: mongoose.Types.ObjectId; // The project being swiped on
  action: "like" | "dislike"; // Whether it's a like or dislike
  timestamp: Date;
}

interface ISwipeHistory extends Document {
  swiper: mongoose.Types.ObjectId;
  targetProject: mongoose.Types.ObjectId;
  action: "like" | "dislike";
  timestamp: Date;
}

const swipeSchema = new Schema<ISwipeHistory>({
  swiper: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  targetProject: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  action: { type: String, enum: ["like", "dislike"], required: true },
  timestamp: { type: Date, default: Date.now },
});

const Swipe = mongoose.model<ISwipeHistory>("Swipe", swipeSchema);

export default Swipe;
