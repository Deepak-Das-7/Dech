// src/controllers/message.controller.ts
import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, content, receiverIds } = req.body;
  const senderId = (req as any).userId;
  const io = (req as any).io; // Access the io instance from the request

  try {
    const receivers: string[] = Array.isArray(receiverIds)
      ? receiverIds
      : receiverIds
      ? [receiverIds]
      : [];

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receivers,
      content,
      chat: chatId,
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });

    // Emit message to all clients in the same chat room
    if (io) {
      io.to(chatId).emit("new-message", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err });
  }
};

export const getMessagesForChat = async (req: Request, res: Response) => {
  const chatId = req.params.chatId;
  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to get messages", error: err });
  }
};
