import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import {
  createChat,
  getChatBetweenUsers,
  getUserChats,
  getChatById,
} from "../controllers/chat.controller";

const router = Router();

router.post("/:receiverId", authMiddleware, createChat);
router.get("/", authMiddleware, getUserChats);
router.get("/:chatId", getChatById);
router.get("/find/:userId", authMiddleware, getChatBetweenUsers);

export default router;
