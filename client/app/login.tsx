import Colors from '@/assets/color';
import { useAuth } from '@/contex/UserContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
    const { login, isLoading, error } = useAuth();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);


    const handleLogin = async () => {
        if (!emailOrUsername || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const response = await login(emailOrUsername, password);
            if (response) {
                router.replace('/main');
            } else {
                Alert.alert('Error', 'Invalid credentials');
            }
        } catch (err) {
            console.log(err);
            Alert.alert('Error', error || 'Failed to login');
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

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={Colors.placeholderText}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Text style={styles.eyeText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                <Text style={styles.loginButtonText}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Text>
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
    passwordContainer: {
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 18,
    },
    eyeText: {
        fontSize: 14,
        color: Colors.secondary,
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

export default LoginScreen;
