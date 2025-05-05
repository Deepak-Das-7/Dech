import Colors from '@/assets/color';
import ChatHeader from '@/components/SingleChatHeader';
import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
} from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

type MessageType = {
    id: string;
    text: string;
    fromMe: boolean;
    time: string;
};

type RawMessage = {
    _id: string;
    sender: { _id: string; username: string; email: string };
    receiver: { _id: string; username: string; email: string }[];
    content: string;
    chat: string;
    createdAt: string;
};
const ChatRoom = () => {
    const { chatId } = useLocalSearchParams();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [otherUser, setOtherUser] = useState('');


    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
    const TOKEN = process.env.EXPO_PUBLIC_TOKEN;

    const decoded: { id: string } = jwtDecode(TOKEN || "");
    const currentUserId = decoded.id;

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/messages/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });

            const formatted = (response.data as RawMessage[]).map((msg) => ({
                id: msg._id,
                text: msg.content,
                fromMe: msg.sender._id === currentUserId,
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

    const handleSend = async () => {
        if (!inputText.trim()) return;

        try {
            const now = new Date();

            const response = await axios.post(
                `${API_URL}/messages`,
                {
                    chatId,
                    content: inputText,
                },
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }
            );
            const newMessage = {
                id: response.data._id,
                text: response.data.content,
                fromMe: true,
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages((prev) => [...prev, newMessage]);
            setInputText('');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const fetchChat = async () => {
        try {
            const response = await axios.get(`${API_URL}/chats/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });

            const chatData = response.data.data;
            // Find the other user (not the current user)
            const otherUser = chatData.members.find(
                (member: { _id: string }) => member._id !== currentUserId
            );
            setOtherUser(otherUser.username)
        } catch (err) {
            console.error(err);
            setError('Failed to load chat.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchMessages();
        fetchChat();
    }, [chatId]);

    return (
        <View style={styles.container}>
            <ChatHeader chatId={otherUser} />
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
            ) : error ? (
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
