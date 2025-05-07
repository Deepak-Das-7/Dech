import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import routes from "./routes";
import { setupSocket } from "./services/socket";
import messageRoutes from "./routes/message.routes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/", routes);
app.use("/messages", messageRoutes(io));

setupSocket(io);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ DB connection failed", error);
    process.exit(1);
  });
