import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MessageBubble from './MessageBubble';
import { MessageType } from '@/assets/types/other';

type Props = {
    messages: MessageType[];
};

const MessageList: React.FC<Props> = ({ messages }) => {
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <MessageBubble text={item.text} time={item.time} fromMe={item.fromMe} />
            )}
            contentContainerStyle={styles.messageList}
        />
    );
};

export default MessageList;

const styles = StyleSheet.create({
    messageList: {
        padding: 16,
        gap: 7,
        // flexGrow: 1,
        // justifyContent: 'flex-end',
    },
});
