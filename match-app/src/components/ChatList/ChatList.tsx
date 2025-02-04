import React, { useEffect, useState } from 'react';
import chatListStyle from "./ChatList.module.css";
import { createChatRoomMock, getChatRoomsForUser } from '../../api/chat';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';


export const ChatList: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<any[]>([]);
    const [projectId, setProjectId] = useState<string>("");
    const [participants, setParticipants] = useState<string>("");
    const { user } = useAuth();

    useEffect(() => {
        const fetchChatRooms = async () => {
            const token = await user?.getIdToken();
            if (token) {
                const chatRooms = await getChatRoomsForUser(token);
                setChatRooms(chatRooms);
            }
        };
        fetchChatRooms();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = await user?.getIdToken();
        if (token) {
            await createChatRoomMock({ projectId, participants }, token);
            const updatedChatRooms = await getChatRoomsForUser(token);
            setChatRooms(updatedChatRooms);
        }
    }

    console.log(chatRooms);
    return (
        <div className={chatListStyle.container}>
            <h1>Chat List</h1>
            {chatRooms.length > 0 ? (
                chatRooms.map((chatRoom) => (
                    <div key={chatRoom.chatRoomId} className={chatListStyle.chatRoom}>
                        <Link to={`/chat/${chatRoom.chatRoomId}`}>
                            <h2>{chatRoom.chatRoomName}</h2>
                        </Link>
                    </div>
                ))

                
            ) : (
                <h2>No chat rooms found</h2>
            )}
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder='Project ID' 
                    type="text" 
                    value={projectId} 
                    onChange={(e) => setProjectId(e.target.value)} 
                />
                <input 
                    placeholder='Participants' 
                    type="text" 
                    value={participants} 
                    onChange={(e) => setParticipants(e.target.value)} 
                />
                <button type="submit">Create Chat Room</button>
            </form>
        </div>
    );
}



