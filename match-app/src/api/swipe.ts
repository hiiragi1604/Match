import axios from "axios";

const MATCH_URI = import.meta.env.VITE_MATCH_API_URI;

// This function records a swipe action in the database.
// It takes in the user ID, project ID, swipe direction, and timestamp as arguments.
// For now left is dislike and right is like.
export const recordSwipping = async (userId: string, projectId: string, direction: String, timestamp: Date) => {
    let action;
    if (direction === "left") {
        action = "dislike";
    } else if (direction === "right") {
        action = "like";
    } else {
        throw new Error("Invalid direction");
    }

    const data = {
        swiper: userId,
        targetProject: projectId,
        action: action,
        timestamp: timestamp,
    };

    const response = await axios.post(`${MATCH_URI}/swipe/swipe`, data);
    return response.data;
};