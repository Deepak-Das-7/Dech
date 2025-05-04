import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name='index' />
            <Stack.Screen name='[chatId]' />
        </Stack>
    )
}

export default Layout

const styles = StyleSheet.create({})