import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface for the Follow document
export interface Follow extends Document {
    follower: mongoose.Types.ObjectId;
    following: mongoose.Types.ObjectId;
    followedAt: Date;
}

// Mongoose schema definition
const FollowSchema = new Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    followedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create a compound index to prevent duplicate follows
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

const FollowModel =
    (mongoose.models.Follow as mongoose.Model<Follow>) ||
    mongoose.model<Follow>("Follow", FollowSchema);

export default FollowModel;
  