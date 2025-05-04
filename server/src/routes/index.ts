import express from "express";
import cors from "cors";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import chatRoutes from "./chat.routes";

const routes = express();

// Middleware
routes.use(express.json());
routes.use(cors()); // You may want to enable CORS, if needed

// Routes
routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/chats", chatRoutes);

// If you want to protect some routes using authMiddleware
// Example: routes.use("/protected", authMiddleware, protectedRoutes);

// Exporting routes
export default routes;
