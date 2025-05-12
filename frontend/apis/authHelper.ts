import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const getTokenAndUserId = async (): Promise<{
  token: string;
  userId: string;
} | null> => {
  const storedToken = await AsyncStorage.getItem("token");
  if (!storedToken) return null;

  const decoded: { id: string } = jwtDecode(storedToken);
  return { token: storedToken, userId: decoded.id };
};
