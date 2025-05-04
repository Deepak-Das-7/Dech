import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import {
  createChat,
  getChatBetweenUsers,
  getUserChats,
} from "../controllers/chat.controller";

const router = Router();

router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getUserChats);
router.get("/find/:userId", authMiddleware, getChatBetweenUsers);

export default router;
