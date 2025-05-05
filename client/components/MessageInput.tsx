import Colors from '@/assets/color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    inputText: string;
    setInputText: (text: string) => void;
    handleSend: () => void;
};

const MessageInput = ({ inputText, setInputText, handleSend }: Props) => {
    return (
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
    );
};

export default MessageInput;

const styles = StyleSheet.create({
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
