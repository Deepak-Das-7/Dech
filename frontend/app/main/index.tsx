import Colors from '@/assets/color';
import ChatItem from '@/components/home/ChatItem';
import ChatListHeader from '@/components/home/ChatListHeader';
import { useAuth } from '@/contex/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

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
    const { userDetails, isLoading, error, Token } = useAuth();
    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

    // Function to fetch chats
    const fetchChats = async () => {
        try {
            const currentUserId = userDetails?.id;

            const response = await axios.get(`${API_URL}/chats`, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            });

            if (response.data.data) {
                const formattedChats = response.data.data.map((chat: any) => {
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
                setChats(formattedChats);
            } else {
                console.log("No chats")
            }
        } catch (err) {
            console.error(err);
            console.log('Failed to load chats')
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchChats(); // Fetch chats whenever the screen is focused
        }, []) // Empty dependency array ensures it runs only once when the screen is focused
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
