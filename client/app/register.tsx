import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';

const RegisterScreen = () => {
    const router = useRouter();

    return (
        <View>
            <Text>Register Screen</Text>
            <Button title="Go to Login" onPress={() => router.push('/login')} />
        </View>
    );
};

export default RegisterScreen;
