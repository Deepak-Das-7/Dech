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

    // Handle sending a message
    socket.on(
      "sendMessage",
      async (data: {
        chatId: string;
        content: string;
        receiverId: string[];
      }) => {
        const { chatId, content, receiverId } = data;
        const senderId = socket.id; // Use socket.id for now, or replace with authenticated user ID

        try {
          // Normalize receiverId to an array
          const receivers: string[] = Array.isArray(receiverId)
            ? receiverId
            : [receiverId];

          // Create messages for each recipient
          const messages = await Promise.all(
            receivers.map((rid) =>
              Message.create({
                sender: senderId, // Assuming socket.id is used as senderId for now
                receiver: rid,
                content,
                chat: chatId,
              })
            )
          );

          // Update the lastMessage field in the chat with the most recent one
          const lastMessage = messages[messages.length - 1];
          await Chat.findByIdAndUpdate(chatId, {
            lastMessage: lastMessage._id,
          });
          console.log("new messagedd:", messages);
          // Emit the new messages to all users in the chat room
          io.to(chatId).emit("newMessages", messages); // Emit new messages to all users in the chat room
        } catch (err) {
          console.error("Error in sending message:", err);
          socket.emit("messageError", { message: "Error in sending message" });
        }
      }
    );

    // Handle user disconnecting from the socket
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
