import Colors from '@/assets/color';
import { useAuth } from '@/contex/UserContext'; // Import the useAuth hook
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type User = {
    _id: string;
    username: string;
    email: string;
    profilePic?: string;
};

type Props = {
    visible: boolean;
    onClose: () => void;
};

const UserSearchModal = ({ visible, onClose }: Props) => {
    const { Token } = useAuth(); // Get the token from context
    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            if (!Token) return; // Don't proceed if no token

            setLoading(true);

            try {
                const res = await axios.get(`${API_URL}/users`, {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                });

                console.log(res.data);
                setUsers(res.data.data);
                setFiltered(res.data.data);
            } catch (err) {
                console.log('Error fetching users', err);
            } finally {
                setLoading(false);
            }
        };

        if (visible) fetchUsers();
    }, [visible, Token]); // Add Token to dependency array

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(text.toLowerCase())
        );
        setFiltered(filtered);
    };

    async function handleUserSelect(item: User) {
        if (!Token) return; // Don't proceed if no token

        try {
            const res = await axios.post(
                `${API_URL}/chats/${item._id}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                }
            );

            const chatId = res.data.data._id;
            if (chatId) {
                router.push(`/main/${chatId}`);
                onClose();
                setSearchText("");
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
                                    onPress={() => handleUserSelect(item)}
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

export default UserSearchModal;