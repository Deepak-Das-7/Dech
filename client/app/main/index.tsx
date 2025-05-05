import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Colors from '@/assets/color';
import ChatListHeader from '@/components/home/ChatListHeader';
import ChatItem from '@/components/home/ChatItem';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

type ChatItemType = {
    id: string;
    name: string;
    avatar: string;
    time: string;
    lastMessage: string;
};

const ChatListScreen = () => {
    const [chats, setChats] = useState<ChatItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
    const TOKEN = process.env.EXPO_PUBLIC_TOKEN;


    const fetchChats = async () => {
        try {
            const decoded: { id: string } = jwtDecode(TOKEN || "");
            const currentUserId = decoded.id;

            const response = await axios.get(`${API_URL}/chats`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });

            const formatted = response.data.data.map((chat: any) => {
                const otherUser = chat.members.find((m: any) => m._id !== currentUserId);
                return {
                    id: chat._id,
                    name: otherUser?.username ?? 'Unknown',
                    avatar: `https://ui-avatars.com/api/?name=${otherUser?.username ?? 'U'}`,
                    time: chat.lastMessage
                        ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '',
                    lastMessage: chat.lastMessage?.content ?? 'No messages yet',
                };
            });

            setChats(formatted);
        } catch (err) {
            console.error(err);
            setError('Failed to load chats.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [])
    );
    return (
        <View style={styles.container}>
            <ChatListHeader />
            {loading ? (
                <ActivityIndicator style={{ marginTop: 50 }} color={Colors.primary} size="large" />
            ) : error ? (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ChatItem item={item} />}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
};

export default ChatListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appBackground,
    },
    listContent: {
        padding: 16,
    },
    separator: {
        height: 12,
    },
});
