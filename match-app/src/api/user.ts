import axios from "axios";

const MATCH_URI = import.meta.env.VITE_MATCH_API_URI;

export const getUserFromFirebaseUid = async (firebaseUid: string) => {
  const response = await axios.get(`${MATCH_URI}/users/firebase/${firebaseUid}`);
  return response.data;
};
