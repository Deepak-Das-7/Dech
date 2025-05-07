import { MessageType, RawMessage } from "@/assets/types/other";
import { io, Socket } from "socket.io-client";

export const initSocket = (token: string, socketUrl: string): Socket => {
  return io(socketUrl, {
    auth: { token },
    transports: ["websocket"],
  });
};

export const listenForMessages = (
  socket: Socket,
  currentUserId: string,
  addMessage: (msg: MessageType) => void
) => {
  socket.on("receiveMessage", (msg: RawMessage) => {
    if (msg.sender._id === currentUserId) return;

    const incoming: MessageType = {
      id: msg._id,
      text: msg.content,
      fromMe: false,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    addMessage(incoming);
  });
};

export const cleanupSocket = (socket: Socket | null) => {
  socket?.disconnect();
};
