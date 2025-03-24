import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const recommenderBaseURI = process.env.RECOMMENDER_URI;

export const getRecommendedProjects = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;
        const response = await axios.get(`${recommenderBaseURI}/api/matching/user/${userId}`);
        console.log(response.data);
        res.status(200).json(response.data);
    } catch (error : any) {
        console.error('Error in getRecommendedProjects:', {
            userId: req.params.userId,
            error: error.response?.data || error.message,
            status: error.response?.status
        });
        
        // Send appropriate error response
        res.status(error.response?.status || 500).json({
            error: "Failed to get project recommendations",
            details: error.response?.data || error.message
        });
    }
};

export const getRecommendedUsers = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const response = await axios.get(`${recommenderBaseURI}/api/matching/project/${projectId}`);
    res.status(200).json(response.data);
};

