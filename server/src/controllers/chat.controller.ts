import { Request, Response } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";

// Create or get an existing chat between two users
export const createChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { receiverId } = req.body;
  const senderId = (req as any).userId;

  try {
    // Check if the chat already exists
    const existingChat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      res.status(200).json({
        message: "Chat already exists",
        data: existingChat,
      });
      return; // Early return to prevent further execution
    }

    // Create a new chat if it doesn't exist
    const newChat = await Chat.create({
      members: [senderId, receiverId],
    });

    res.status(201).json({
      message: "Chat created successfully",
      data: newChat,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create chat",
      error: err,
    });
  }
};

// Get all chats for a specific user
export const getUserChats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).userId;

  try {
    const chats = await Chat.find({ members: userId })
      .populate("members", "username email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch chats",
      error: err,
    });
  }
};

// Get a specific chat between two users
export const getChatBetweenUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req as any).userId;
  const otherUserId = req.params.userId;

  try {
    // Find the chat between the user and the other user
    const chat = await Chat.findOne({
      members: { $all: [userId, otherUserId] },
    })
      .populate("members", "username")
      .populate("lastMessage");

    if (!chat) {
      res.status(404).json({
        message: "Chat not found",
      });
      return;
    }

    res.status(200).json({
      message: "Chat fetched successfully",
      data: chat,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch chat",
      error: err,
    });
  }
};
