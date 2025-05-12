import Colors from '@/assets/color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    text: string;
    time: string;
    fromMe: boolean;
};

const MessageBubble: React.FC<Props> = ({ text, time, fromMe }) => (
    <View>
        <View style={fromMe ? styles.myMessage : styles.otherMessage}>
            <Text style={styles.messageText}>{text}</Text>
        </View>
        <Text style={fromMe ? styles.myMessageTime : styles.otherMessageTime}>{time}</Text>
    </View>
);

export default MessageBubble;

const styles = StyleSheet.create({
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
    messageText: {
        color: Colors.messageText,
        fontSize: 12,
    },
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
});
