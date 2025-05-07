import express from "express";
import cors from "cors";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import chatRoutes from "./chat.routes";

const routes = express.Router(); // Use express.Router() for defining route handlers

// Middleware
routes.use(express.json());
routes.use(cors());

// Define the root route handler directly on the 'routes' router
routes.get("/", (req, res) => {
  res.send("API is running");
});

// Mount other route handlers
routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/chats", chatRoutes);

export default routes;
