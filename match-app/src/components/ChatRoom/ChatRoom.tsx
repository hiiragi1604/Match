import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import chatRoomStyle from './ChatRoom.module.css';
import { getChatRoom, getChatHistory } from '../../api/chat';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

export const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { chatRoomId } = useParams();
    const { user } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        let socket: Socket | null = null;
        
        const connectSocket = async () => {
            try {
                // Disconnect existing socket if any
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }

                const token = await user?.getIdToken();
                if (!token) return;

                // Connect to socket server
                socket = io('http://localhost:6969', {
                    auth: { token }
                });
                socketRef.current = socket;

                // Join the chat room
                socket.emit('join_chat', chatRoomId);

                // Listen for new messages
                socket.on('receive_message', (message) => {
                    setMessages(prev => [...prev, message]);
                    scrollToBottom();
                });
            } catch (error) {
                console.error('Socket connection error:', error);
            }
        };

        connectSocket();

        // Cleanup function
        return () => {
            if (socket) {
                socket.disconnect();
                socketRef.current = null;
            }
        };
    }, [chatRoomId, user]);

    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                const token = await user?.getIdToken();
                if (!token) return;

                const response = await getChatRoom(chatRoomId as string, token);
                const chatHistory = await getChatHistory(chatRoomId as string, token);
                setMessages(chatHistory.messages);
                scrollToBottom();
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchChatRoom();
    }, [chatRoomId, user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !socketRef.current) return;

        try {
            // Emit message through socket
            socketRef.current.emit('send_message', {
                chatRoomId,
                content: newMessage,
                firebaseUid: user.uid
            });

            // Clear input
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className={chatRoomStyle.container}>
            <div className={chatRoomStyle.header}>
                <button 
                    onClick={() => navigate('/chat')} 
                    className={chatRoomStyle.backButton}
                >
                    ← Back
                </button>
            </div>
            <div className={chatRoomStyle.messagesContainer}>
                {messages.map((message) => (
                    <div 
                        key={message._id}
                        className={`${chatRoomStyle.message} ${
                            message.sender.firebaseUid === user?.uid ? chatRoomStyle.sent : chatRoomStyle.received
                        }`}
                    >
                        <div className={chatRoomStyle.messageContent}>
                            {message.content}
                        </div>
                        <div className={chatRoomStyle.messageTime}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className={chatRoomStyle.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={chatRoomStyle.input}
                />
                <button type="submit" className={chatRoomStyle.sendButton}>
                    Send
                </button>
            </form>
        </div>
    );
};
