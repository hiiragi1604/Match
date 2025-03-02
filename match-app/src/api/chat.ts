import axios from "axios";

const MATCH_URI = import.meta.env.VITE_MATCH_API_URI;

export const getChatRoomsForUser = async (token: string) => {
  const response = await axios.get(`${MATCH_URI}/chat/chatRooms`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getChatRoom = async (chatRoomId: string, token: string) => {
  const response = await axios.get(`${MATCH_URI}/chat/chatRoom/${chatRoomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createChatRoomMock = async (chatRoomData: any, token: string) => {
  const response = await axios.post(
    `${MATCH_URI}/chat/mockCreateChatRoom`,
    chatRoomData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getChatHistory = async (chatRoomId: string, token: string) => {
  const response = await axios.get(
    `${MATCH_URI}/chat/chatHistory/${chatRoomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
