// src/middleware/socketio.middleware.ts
import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

export const socketIoMiddleware = (io: Server) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as any).io = io; // Attach the socket.io instance to the request object
    next();
  };
};
