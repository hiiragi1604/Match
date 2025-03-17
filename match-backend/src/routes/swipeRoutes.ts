import express, { Request, Response } from 'express';
import { swipeProject, getSwipeHistory } from "../controllers/swipeController";

const SwipeRouter = express.Router();

// Route to handle swiping on a project
SwipeRouter.post("/swipe", swipeProject);

// Route to get swipe history for a user
SwipeRouter.get("/history/:userId", getSwipeHistory);

export default SwipeRouter;