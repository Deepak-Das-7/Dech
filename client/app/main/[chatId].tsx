import React, { useEffect, useState, useRef } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import ChatHeader from '@/components/SingleChatHeader';
import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';
import Colors from '@/assets/color';
import { MessageType } from '@/assets/types/other';
import { getTokenAndUserId } from '@/apis/authHelper';
import { fetchChatInfo, fetchMessagesFromAPI } from '@/apis/chathelpers';
import { cleanupSocket, initSocket, listenForMessages } from '@/apis/socketHelpers';
import { sendMessageToAPI } from '@/apis/messageHelpers';




const ChatRoom = () => {
    const { chatId } = useLocalSearchParams<{ chatId: string }>();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [otherUser, setOtherUser] = useState('');
    const [otherUserId, setOtherUserId] = useState('');
    const socketRef = useRef<any>(null);
    const currentUserId = useRef<string>('');

    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;
    const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || API_URL;

    useEffect(() => {
        const init = async () => {
            const auth = await getTokenAndUserId();
            if (!auth || !chatId) return;

            setToken(auth.token);
            currentUserId.current = auth.userId;

            try {
                const [chatInfo, msgs] = await Promise.all([
                    fetchChatInfo(auth.token, chatId, auth.userId, API_URL),
                    fetchMessagesFromAPI(auth.token, chatId, API_URL, auth.userId),
                ]);

                setOtherUser(chatInfo.otherUser);
                setOtherUserId(chatInfo.otherUserId);
                setMessages(msgs);
            } catch (err) {
                console.log(err);
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [chatId]);

    useEffect(() => {
        if (!token || !chatId) return;

        const socket = initSocket(token, SOCKET_URL);
        socketRef.current = socket;
        socket.emit('joinChat', chatId);

        listenForMessages(socket, currentUserId.current, (msg) =>
            setMessages((prev) => [...prev, msg])
        );

        return () => cleanupSocket(socketRef.current);
    }, [token, chatId]);

    const handleSend = async () => {
        if (!inputText.trim() || !token) return;

        try {
            const sent = await sendMessageToAPI(chatId, inputText, token, API_URL);
            sent.receiverId = [otherUserId];

            setMessages((prev) => [...prev, sent]);
            setInputText('');

            socketRef.current?.emit('sendMessage', {
                chatId: sent.chat,
                content: sent.text,
                senderId: currentUserId.current,
                receiverId: sent.receiverId,
            });
        } catch (err) {
            console.log('Send failed:', err);
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
