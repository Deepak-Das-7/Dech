import axios from "axios";
import { MessageType } from "@/assets/types/other";

export const sendMessageToAPI = async (
  chatId: string,
  content: string,
  token: string,
  apiUrl: string
): Promise<MessageType & { receiverId: string[]; chat: string }> => {
  const response = await axios.post(
    `${apiUrl}/messages`,
    { chatId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const now = new Date();

  return {
    id: response.data._id,
    text: response.data.content,
    fromMe: true,
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    chat: response.data.chat,
    receiverId: [], // filled later
  };
};
