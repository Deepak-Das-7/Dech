import Colors from '@/assets/color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ChatHeader = ({ chatId }: { chatId: string }) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
                <Ionicons name="arrow-back" size={24} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
                <Image source={{ uri: 'https://i.pravatar.cc/150?img=2' }} style={styles.avatar} />
                <Text style={styles.username}>Friend {chatId}</Text>
            </View>
            <View style={styles.headerRight}>
                <Text style={styles.statusText}>Online</Text>
            </View>
        </View>
    );
};

export default ChatHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderColor: Colors.border,
    },
    headerIcon: { paddingRight: 8 },
    headerCenter: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 12 },
    headerRight: { paddingLeft: 8 },
    avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
    username: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
    statusText: { fontSize: 12, color: Colors.online, fontWeight: '500' },
});
