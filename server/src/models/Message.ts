import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId[]; // Array of receivers
  content: string;
  seen: boolean;
  chat: mongoose.Types.ObjectId; // Added chatId
}

const MessageSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of ObjectIds for receivers
    content: { type: String, required: true },
    seen: { type: Boolean, default: false },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true }, // Chat reference
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
