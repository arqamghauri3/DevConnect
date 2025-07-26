import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  sender: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileType?: string;
  replyTo?: mongoose.Types.ObjectId;       // 🆕 Message threading
  editedAt?: Date;          // 🆕 Message editing
  deletedAt?: Date;         // 🆕 Soft delete
  readBy: {                 // 🆕 Read receipts
    userId: mongoose.Types.ObjectId;
    readAt: Date;
  }[];
  timestamp: Date;
}

const MessageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["text", "file", "image"],
    default: "text",
  },

  fileUrl: {
    type: String,
  },

  fileType: {
    type: String,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", MessageSchema);

export default MessageModel;
