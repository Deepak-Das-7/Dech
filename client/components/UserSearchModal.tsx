import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image
} from 'react-native';
import Colors from '@/assets/color';
import axios from 'axios';
import { router } from 'expo-router';

type User = {
    _id: string;
    username: string;
    email: string;
    profilePic?: string; // assuming this is the image URL
};


type Props = {
    visible: boolean;
    onClose: () => void;
};

const UserSearchModal = ({ visible, onClose }: Props) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
    const TOKEN = process.env.EXPO_PUBLIC_TOKEN;

    useEffect(() => {
        if (visible) fetchUsers();
    }, [visible]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });
            setUsers(res.data.data);
            setFiltered(res.data.data);
        } catch (err) {
            console.log('Error fetching users', err);
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = (text: string) => {
        setSearchText(text);
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(text.toLowerCase())
        );
        setFiltered(filtered);
    };

    async function handleUserSelect(item: User) {
        try {
            const res = await axios.post(
                `${API_URL}/chats/${item._id}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }
            );

            const chatId = res.data.data._id
            if (chatId) {
                router.push(`/main/${chatId}`);
            } else {
                console.log('Chat ID not found in response');
            }
        } catch (err) {
            console.log('Error creating/fetching chat', err);
        }
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Search Users</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="Search by username"
                        value={searchText}
                        onChangeText={handleSearch}
                        style={styles.input}
                        placeholderTextColor={Colors.timestamp}
                    />

                    {loading ? (
                        <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.userItem}
                                    onPress={() => {
                                        handleUserSelect(item);
                                        onClose();
                                        setSearchText("");
                                    }}
                                >
                                    <View style={styles.userInfo}>
                                        <Image
                                            source={{ uri: item.profilePic || 'https://via.placeholder.com/40' }}
                                            style={styles.avatar}
                                        />
                                        <View>
                                            <Text style={styles.username}>{item.username}</Text>
                                            <Text style={styles.email}>{item.email}</Text>
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default UserSearchModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: "flex-end",
    },
    modalContainer: {
        width: '100%',
        height: '90%',
        backgroundColor: Colors.chatBackground,
        borderRadius: 12,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    closeText: {
        color: Colors.primary,
        fontSize: 16,
    },
    input: {
        backgroundColor: Colors.inputBackground,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
        color: Colors.textPrimary,
    },
    userItem: {
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    username: {
        fontSize: 12,
        color: Colors.textPrimary,
    },
    email: {
        fontSize: 10,
        color: Colors.textSecondary,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: Colors.inputBackground,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

});
