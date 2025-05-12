import Colors from '@/assets/color';
import { AuthProvider, useAuth } from '@/contex/UserContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';

const Layout = () => {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
};

const AuthContent = () => {
  const { Token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name={Token ? 'main' : 'login'} />
      </Stack>
    </>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.appBackground,
  },
});

export default Layout;