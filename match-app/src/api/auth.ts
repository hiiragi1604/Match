import axios from "axios";

const MATCH_URI = import.meta.env.VITE_MATCH_API_URI;

export const verifyUser = async (token: string) => {
  const response = await axios.post(`${MATCH_URI}/auth/verifyUser`, {
    token,
  });
  return response;
};
