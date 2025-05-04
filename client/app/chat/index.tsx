import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

const ChatListScreen = () => {
    const router = useRouter();

    return (
        <View>
            <Text>Chat List</Text>
            <Button title="Go to Chat" onPress={() => router.push("./4")} />
        </View>
    );
};

export default ChatListScreen;
