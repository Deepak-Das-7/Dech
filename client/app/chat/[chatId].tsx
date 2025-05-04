import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const ChatScreen = () => {
    const { chatId } = useLocalSearchParams()

    return (
        <View>
            <Text>Chat Screen - Chat ID: {chatId}</Text>
        </View>
    );
};

export default ChatScreen;
