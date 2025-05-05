import chatData from '@/assets/chat';
import Colors from '@/assets/color';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ChatList = () => {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof chatData[0] }) => (
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

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logoText}>Dech</Text>
                <TouchableOpacity onPress={() => router.push('/main/profile')}>
                    <Ionicons name="person-circle" size={32} color={Colors.iconPrimary} />
                </TouchableOpacity>
            </View>

            {/* Chat list */}
            <FlatList
                data={chatData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

export default ChatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appBackground,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40, // mimic SafeAreaView top padding manually
        paddingBottom: 16,
        backgroundColor: Colors.chatBackground,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    logoText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
    },
    listContent: {
        padding: 16,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBackground,
        padding: 12,
        borderRadius: 12,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    messageContainer: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    time: {
        fontSize: 12,
        color: Colors.timestamp,
    },
    lastMessage: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    separator: {
        height: 12,
    },
});
