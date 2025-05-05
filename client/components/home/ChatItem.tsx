import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Colors from '@/assets/color';
import { useRouter } from 'expo-router';

type ChatItemProps = {
    id: string;
    name: string;
    avatar: string;
    time: string;
    lastMessage: string;
};

const ChatItem: React.FC<{ item: ChatItemProps }> = ({ item }) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push(`./main/${item.id}`)}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.messageContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatItem;

const styles = StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 24,
        marginRight: 15,
    },
    messageContainer: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    time: {
        fontSize: 10,
        color: Colors.timestamp,
    },
    lastMessage: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
});
