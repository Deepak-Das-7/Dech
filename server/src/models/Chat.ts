// src/models/Chat.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  members: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
}

const ChatSchema: Schema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>("Chat", ChatSchema);
