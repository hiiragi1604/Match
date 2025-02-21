import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const recommenderBaseURI = process.env.RECOMMENDER_URI;

export const getRecommendedProjects = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const response = await axios.get(`${recommenderBaseURI}/api/matching/user/${userId}`);
        res.status(200).json(response.data);
};

export const getRecommendedUsers = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const response = await axios.get(`${recommenderBaseURI}/api/matching/project/${projectId}`);
    res.status(200).json(response.data);
};

