import React, { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/assets/color';
import ChatHeader from '@/components/SingleChatHeader';
import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';
import { useLocalSearchParams } from 'expo-router';
import { MessageType, RawMessage } from '@/assets/types';
import { io, Socket } from 'socket.io-client';

const ChatRoom = () => {
    const { chatId } = useLocalSearchParams();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const [otherUser, setOtherUser] = useState('');
    const [otherUserId, setOtherUserId] = useState('');
    const currentUserId = useRef<string>('');

    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
    const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || API_URL; // fallback

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                const decoded: { id: string } = jwtDecode(storedToken);
                currentUserId.current = decoded.id;
            }
        };
        fetchToken();
    }, []);

    useEffect(() => {
        if (!token || !chatId) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${API_URL}/messages/${chatId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const formatted = (response.data as RawMessage[]).map((msg) => ({
                    id: msg._id,
                    text: msg.content,
                    fromMe: msg.sender._id === currentUserId.current,
                    time: new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                setMessages(formatted);
            } catch (err) {
                console.error(err);
                setError('Failed to load messages.');
            } finally {
                setLoading(false);
            }
        };

        const fetchChat = async () => {
            try {
                const response = await axios.get(`${API_URL}/chats/${chatId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const chatData = response.data.data;
                const otherUser = chatData.members.find(
                    (member: { _id: string }) => member._id !== currentUserId.current
                );
                setOtherUser(otherUser?.username || 'User');
                setOtherUserId(otherUser?._id);
            } catch (err) {
                console.error(err);
                setError('Failed to load chat.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        fetchChat();
    }, [token, chatId, API_URL]);

    useEffect(() => {
        if (!token || !chatId) return;

        // Connect to socket
        socketRef.current = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
        });

        socketRef.current.emit('joinChat', chatId);

        socketRef.current.on('receiveMessage', (msg: RawMessage) => {
            if (msg.sender._id === currentUserId.current) {
                return;
            }

            const incomingMessage: MessageType = {
                id: msg._id,
                text: msg.content,
                fromMe: false,
                time: new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };

            setMessages((prev) => [...prev, incomingMessage]);
        });


        return () => {
            socketRef.current?.disconnect();
        };
    }, [token, chatId, SOCKET_URL]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        try {
            const now = new Date();

            const response = await axios.post(
                `${API_URL}/messages`,
                { chatId, content: inputText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newMessage: MessageType = {
                id: response.data._id,
                text: response.data.content,
                fromMe: true,
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, newMessage]);
            setInputText('');

            // 🔧 Emit socket message with all required fields
            socketRef.current?.emit('sendMessage', {
                chatId: response.data.chat,
                content: response.data.content,
                senderId: currentUserId.current, // your logged-in user ID
                receiverId: [otherUserId], // the user you're chatting with
            });
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };


    if (loading) {
        return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />;
    }

    return (
        <View style={styles.container}>
            <ChatHeader chatId={otherUser} />
            {error ? (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
            ) : (
                <MessageList messages={messages} />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={80}
            >
                <MessageInput
                    inputText={inputText}
                    setInputText={setInputText}
                    handleSend={handleSend}
                />
            </KeyboardAvoidingView>
        </View>
    );
};

export default ChatRoom;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.chatBackground,
        paddingTop: Platform.OS === 'android' ? 35 : 0,
    },
});
