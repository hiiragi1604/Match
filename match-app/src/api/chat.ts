import axios from "axios";

export const getChatRoomsForUser = async (token: string) => {
    const response = await axios.get(`http://localhost:6969/chat/chatRooms`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export const getChatRoom = async (chatRoomId: string, token: string) => {
    const response = await axios.get(`http://localhost:6969/chat/chatRoom/${chatRoomId}`, {
        headers: {

            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export const createChatRoomMock = async (chatRoomData: any, token: string) => {
    const response = await axios.post(`http://localhost:6969/chat/mockCreateChatRoom`, chatRoomData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export const getChatHistory = async (chatRoomId: string, token: string) => {
    const response = await axios.get(`http://localhost:6969/chat/chatHistory/${chatRoomId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}
