import express, { Request, Response } from "express";
import { getRecommendedProjects, getRecommendedUsers } from "../controllers/recommenderController";

const RecommenderRouter = express.Router();

RecommenderRouter.get("/user/:userId", getRecommendedProjects);
RecommenderRouter.get("/project/:projectId", getRecommendedUsers);

export default RecommenderRouter;
