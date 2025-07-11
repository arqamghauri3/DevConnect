import mongoose, { Schema, Document } from "mongoose";

export interface Like extends Document {
    post: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    likedAt: Date;
}

const LikeSchema = new Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likedAt: {
        type: Date,
        default: Date.now
    },
})

LikeSchema.index({ post: 1, user: 1 }, { unique: true })

const LikeModel =
    (mongoose.models.Like as mongoose.Model<Like>) ||
    mongoose.model<Like>("Like", LikeSchema);

export default LikeModel;