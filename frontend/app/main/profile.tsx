import Colors from '@/assets/color';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
    const router = useRouter();
    const [username, setUsername] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [phone, setPhone] = useState('123-456-7890');
    const [about, setAbout] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

    const handleEdit = () => {
        // Placeholder for edit profile logic
        console.log('Editing profile...');
    };

    const handleLogout = () => {
        // Placeholder for logout logic
        console.log('Logging out...');
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.avatar}
                    source={{ uri: 'https://via.placeholder.com/100' }}
                />
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone Number"
                    placeholderTextColor={Colors.placeholderText}
                    editable={false}
                />

                <Text style={styles.sectionTitle}>About</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    value={about}
                    onChangeText={setAbout}
                    placeholder="Tell us about yourself"
                    placeholderTextColor={Colors.placeholderText}
                    editable={false}
                    multiline
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appBackground,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    username: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginTop: 10,
    },
    email: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    infoContainer: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.inputBackground,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    logoutButton: {
        backgroundColor: Colors.buttonSecondaryBg,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    buttonText: {
        color: Colors.buttonPrimaryText,
        fontSize: 16,
        fontWeight: '600',
    },
});
