import axios from "axios";

export const fetchChatInfo = async (
  token: string,
  chatId: string,
  currentUserId: string,
  apiUrl: string
): Promise<{ otherUser: string; otherUserId: string }> => {
  const response = await axios.get(`${apiUrl}/chats/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const chatData = response.data.data;
  const other = chatData.members.find(
    (m: { _id: string }) => m._id !== currentUserId
  );

  return {
    otherUser: other?.username || "User",
    otherUserId: other?._id,
  };
};

export const fetchMessagesFromAPI = async (
  token: string,
  chatId: string,
  apiUrl: string,
  currentUserId: string
) => {
  const response = await axios.get(`${apiUrl}/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.map((msg: any) => ({
    id: msg._id,
    text: msg.content,
    fromMe: msg.sender._id === currentUserId,
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));
};
