import axios from "axios";

const MATCH_URI = import.meta.env.VITE_MATCH_API_URI;

export const getProjectById = async (projectId: string) => {
  const response = await axios.get(
    `${MATCH_URI}/projects/getById/${projectId}`
  );
  return response.data;
};
