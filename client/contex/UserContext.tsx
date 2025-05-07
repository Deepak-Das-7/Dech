import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

// Interface for decoded token
interface DecodedToken {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

// Interface for context value
interface AuthContextValue {
    Token: string | null;
    userDetails: DecodedToken | null;
    login: (token: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

// Create context with initial undefined value but proper type
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider props interface
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [Token, setToken] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<DecodedToken | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;


    // Load token from storage on initial render
    useEffect(() => {
        const loadAuthData = async () => {
            setIsLoading(true);
            try {
                const token = await AsyncStorage.getItem('Token');
                if (token) {
                    const decoded = jwtDecode<DecodedToken>(token);
                    setToken(token);
                    setUserDetails(decoded);
                }
            } catch (err) {
                setError('Failed to load authentication data');
                console.error('Auth loading error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthData();
    }, []);

    const login = useCallback(async (emailOrUsername: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: emailOrUsername,
                password: password,
            });

            if (response.data?.data?.token) {
                await AsyncStorage.setItem('Token', response.data.data.token);
                const decoded = jwtDecode<DecodedToken>(response.data.data.token);
                setToken(response.data.data.token);
                setUserDetails(decoded);
                return true; // Return true on successful login
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            console.error('Login error:', err);
            return false; // Return false on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await AsyncStorage.removeItem('Token');
            setToken(null);
            setUserDetails(null);
        } catch (err) {
            setError('Failed to logout');
            console.error('Logout error:', err);
            throw new Error('Failed to logout');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const contextValue: AuthContextValue = {
        Token,
        userDetails,
        login,
        logout,
        isLoading,
        error,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};