import Colors from '@/assets/color';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const RegisterScreen = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

    const handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        const response = await axios.post(`${API_URL}/auth/register`, {
            email: email,
            username: username,
            password: password
        });

        if (response) {
            Alert.alert('Success', 'Account created!');
            router.replace('/login');
        } else {
            Alert.alert('Error', 'Invalid data');
        }

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={Colors.placeholderText}
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.placeholderText}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.placeholderText}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor={Colors.placeholderText}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
                <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Text style={styles.loginTextHighlight}>Login</Text>
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.appBackground,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 32,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        backgroundColor: Colors.inputBackground,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    registerButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    registerButtonText: {
        color: Colors.buttonPrimaryText,
        fontSize: 16,
        fontWeight: '600',
    },
    loginLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    loginTextHighlight: {
        color: Colors.secondary,
        fontWeight: '600',
    },
});
