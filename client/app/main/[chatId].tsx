import Colors from '@/assets/color';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList, Image, KeyboardAvoidingView, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

const dummyMessages = [
    { id: '1', text: 'Hey!', fromMe: false, time: '10:00 AM' },
    { id: '2', text: 'Hi, how are you?', fromMe: true, time: '10:01 AM' },
    { id: '3', text: 'I am doing great. You?', fromMe: false, time: '10:02 AM' },
];

const ChatRoom = () => {
    const router = useRouter();
    const { chatId } = useLocalSearchParams();
    const [messages, setMessages] = useState(dummyMessages);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            fromMe: true,
            time: formattedTime,
        };
        setMessages([...messages, newMessage]);
        setInputText('');
    };

    const renderMessage = ({ item }: { item: typeof dummyMessages[0] }) => {
        const isMine = item.fromMe;
        return (
            <View>
                <View style={isMine ? styles.myMessage : styles.otherMessage}>
                    <Text style={isMine ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
                </View>
                <Text style={isMine ? styles.myMessageTime : styles.otherMessageTime}>{item.time}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
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

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.messageList}
                inverted
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
            >
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message"
                        placeholderTextColor={Colors.placeholderText}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Ionicons name="send" size={20} color={Colors.buttonPrimaryText} />
                    </TouchableOpacity>
                </View>
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
    messageList: { padding: 16, gap: 12, flexGrow: 1, justifyContent: 'flex-end' },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.userMessageBg,
        borderRadius: 10,
        padding: 7,
        maxWidth: '75%',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.otherMessageBg,
        borderRadius: 10,
        padding: 7,
        maxWidth: '85%',
    },
    myMessageText: { color: Colors.messageText, fontSize: 12 },
    otherMessageText: { color: Colors.messageText, fontSize: 12 },
    myMessageTime: {
        fontSize: 8,
        color: Colors.placeholderText,
        alignSelf: 'flex-end',
        marginTop: 1,
    },
    otherMessageTime: {
        fontSize: 8,
        color: Colors.placeholderText,
        alignSelf: 'flex-start',
        marginTop: 1,
    },
    inputBar: {
        flexDirection: 'row',
        backgroundColor: Colors.inputBackground,
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        borderWidth: 1,
        borderColor: Colors.border,
        color: Colors.textPrimary,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: Colors.buttonPrimaryBg,
        borderRadius: 20,
        padding: 10,
    },
});
