import { Server, Socket } from "socket.io";
import Message from "../models/Message";
import Chat from "../models/Chat";

// This function will be used to initialize and handle socket events
export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected");

    // Handle user joining a specific chat room based on chatId
    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId); // Join the room (chatId)
      console.log(`User joined chat room: ${chatId}`);
    });

    // In socket setup, just emit the message — don't save to DB again
    socket.on("sendMessage", (data) => {
      io.to(data.chatId).emit("receiveMessage", {
        chatId: data.chatId,
        content: data.content,
        sender: { _id: data.senderId },
        createdAt: new Date().toISOString(),
        _id: crypto.randomUUID(), // or reuse the one returned from API
      });
    });

    // Handle user disconnecting from the socket
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
