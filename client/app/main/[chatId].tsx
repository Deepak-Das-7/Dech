import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { fetchChatInfo, fetchMessagesFromAPI } from '@/apis/chathelpers';
import { sendMessageToAPI } from '@/apis/messageHelpers';
import { cleanupSocket, initSocket, listenForMessages } from '@/apis/socketHelpers';
import Colors from '@/assets/color';
import { MessageType } from '@/assets/types/other';
import MessageInput from '@/components/MessageInput';
import MessageList from '@/components/MessageList';
import ChatHeader from '@/components/SingleChatHeader';
import { useAuth } from '@/contex/UserContext';

const ChatRoom = () => {
    const { Token, userDetails, error } = useAuth(); // Using context here for token and userDetails
    const { chatId } = useLocalSearchParams<{ chatId: string }>();
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState('');
    const [otherUserId, setOtherUserId] = useState('');
    const socketRef = useRef<any>(null);
    const currentUserId = useRef<string>(userDetails?.id || '');

    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;
    const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || API_URL;

    useEffect(() => {
        const init = async () => {
            if (!Token || !chatId || !userDetails) return;

            try {
                const chatInfo = await fetchChatInfo(Token, chatId, userDetails.id, API_URL);
                const msgs = await fetchMessagesFromAPI(Token, chatId, API_URL, userDetails.id);

                setOtherUser(chatInfo.otherUser);
                setOtherUserId(chatInfo.otherUserId);
                setMessages(msgs);
            } catch (err) {
                console.log(err);
                console.log("failed to load message")
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [chatId, Token, userDetails]);

    useEffect(() => {
        if (!Token || !chatId) return;

        const socket = initSocket(Token, SOCKET_URL);
        socketRef.current = socket;
        socket.emit('joinChat', chatId);

        listenForMessages(socket, currentUserId.current, (msg) =>
            setMessages((prev) => [...prev, msg])
        );

        return () => cleanupSocket(socketRef.current);
    }, [Token, chatId]);

    const handleSend = async () => {
        if (!inputText.trim() || !Token) return;

        try {
            const sent = await sendMessageToAPI(chatId, inputText, Token, API_URL);
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
