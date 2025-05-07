import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/assets/color';

type Props = {
    inputText: string;
    setInputText: React.Dispatch<React.SetStateAction<string>>;
    handleSend: () => void;
};

const MessageInput = ({ inputText, setInputText, handleSend }: Props) => {
    const trimmedText = inputText.trim();

    // State to store the picked image URI
    const [imageUri, setImageUri] = useState<string | null>(null);

    // Handle picking an image file
    const handleFilePick = async () => {
        try {
            // Allow only image files
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/*", // Restrict to images only
            });

            if (result.canceled) {
                console.log("User canceled file pick");
                return;  // Exit if user cancels the file picker
            }

            // Get file information from the response
            const { uri, mimeType } = result.assets[0];

            // Logging the picked file details
            console.log("Picked file:", { uri, mimeType });

            // Check if the mimeType starts with "image/"
            if (mimeType?.startsWith("image/")) {
                setImageUri(uri); // Set the image URI to display
                console.log("This is an image file.");
            } else {
                console.log("Picked file is not an image.");
            }

        } catch (error) {
            console.log("File picking failed:", error);
            alert("An error occurred while picking the file. Please try again.");
        }
    };

    // Handle picking an image from camera
    const handleCameraPick = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri); // Set the image URI to display
            console.log('Captured image:', result.assets[0]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Display attachment preview */}
            {imageUri && (
                <View style={styles.attachmentPreview}>
                    <Image source={{ uri: imageUri }} style={styles.attachmentImage} />
                </View>
            )}
            {/* Input */}
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message"
                placeholderTextColor={Colors.placeholderText}
            />

            {/* File & Camera */}
            <View style={styles.rightIcons}>
                <TouchableOpacity style={styles.iconButton} onPress={handleFilePick}>
                    <Feather name="paperclip" size={22} color={Colors.iconPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleCameraPick}>
                    <Ionicons name="camera-outline" size={22} color={Colors.iconPrimary} />
                </TouchableOpacity>
            </View>



            {/* Send */}
            {trimmedText || imageUri ? (
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Ionicons name="send" size={20} color={Colors.buttonPrimaryText} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="send" size={20} color={Colors.buttonPrimaryText} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default MessageInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.inputBackground,
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        borderRadius: 25,
        margin: 10,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.inputBackground,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: Colors.textPrimary,
        maxHeight: 100,
        marginHorizontal: 5,
    },
    iconButton: {
        paddingHorizontal: 6,
        paddingVertical: 6,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    attachmentPreview: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attachmentImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    sendButton: {
        backgroundColor: Colors.buttonPrimaryBg,
        borderRadius: 20,
        padding: 8,
        marginLeft: 6,
    },
});
