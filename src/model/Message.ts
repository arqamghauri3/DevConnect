import { timeStamp } from "console";
import mongoose, { Schema, Document, Mongoose, mongo } from "mongoose";

export interface Message extends Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    content: string;
    type: string;
    fileUrl: string;
    fileType: string;
    timestamp: Date
}

const MessageSchema = new Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["text", "file", "image"],
        default: "text"
    },

    fileUrl: {
        type: String,
    },

    fileType: {
        type: String
    },

    timeStamp: {
        type: Date,
        default: Date.now
    }
})

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message",MessageSchema)

export default MessageModel;