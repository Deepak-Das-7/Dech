import Colors from '@/assets/color';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const LoginScreen = () => {
    const router = useRouter();
    const [emailOrUsername, setEmailOrUsername] = useState('vikasjha99@gmail.com');
    const [password, setPassword] = useState('vikas999');

    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: emailOrUsername,
                password: password,
            });
            if (response.data.data.token) {
                await AsyncStorage.setItem('token', response.data.data.token);
                router.replace('/main');
            } else {
                Alert.alert('Error', 'Invalid credentials');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email or Username"
                    placeholderTextColor={Colors.placeholderText}
                    value={emailOrUsername}
                    onChangeText={setEmailOrUsername}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.placeholderText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.registerLink}
                onPress={() => router.push('/register')}
            >
                <Text style={styles.registerText}>
                    Don't have an account? <Text style={styles.registerTextHighlight}>Register</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.appBackground,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 40,
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
    loginButton: {
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
    loginButtonText: {
        color: Colors.buttonPrimaryText,
        fontSize: 16,
        fontWeight: '600',
    },
    registerLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    registerTextHighlight: {
        color: Colors.secondary,
        fontWeight: '600',
    },
});
