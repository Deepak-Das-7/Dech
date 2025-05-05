import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/assets/color';
import UserSearchModal from '@/components/UserSearchModal'; // import at top



const ChatListHeader = () => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    return (
        <View style={styles.header}>
            <Text style={styles.logoText}>Dech</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <Ionicons name="search" size={24} color={Colors.iconPrimary} />
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push('/main/profile')}
                >
                    <Ionicons name="person-circle-outline" size={28} color={Colors.iconPrimary} />
                </TouchableOpacity>
            </View>
            <UserSearchModal
                visible={showModal}
                onClose={() => setShowModal(false)}
            />
        </View>
    );
};

export default ChatListHeader;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 16,
        backgroundColor: Colors.chatBackground,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    logoText: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.primary,
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    iconButton: {
        padding: 4,
    },
});
