// src/routes/message.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { socketIoMiddleware } from "../middleware/socketio.middleware"; // Import socket middleware
import {
  getMessagesForChat,
  sendMessage,
} from "../controllers/message.controller";
import { Server } from "socket.io";

const messageRoutes = (io: Server) => {
  const router = Router();

  // Use the socket middleware to inject io into the request
  router.post("/", authMiddleware, socketIoMiddleware(io), sendMessage);
  router.get("/:chatId", authMiddleware, getMessagesForChat);

  return router;
};

export default messageRoutes;
