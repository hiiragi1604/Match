import axios from "axios";

const MATCH_URI = import.meta.env.VITE_MATCH_API_URI;

export const getRecommendedProjects = async (userId: string) => {
  const response = await axios.get(`${MATCH_URI}/match/user/${userId}`);
  return response.data;
};

export const getRecommendedUsers = async (projectId: string) => {
  const response = await axios.get(`${MATCH_URI}/match/project/${projectId}`);
  return response.data;
};
