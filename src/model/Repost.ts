import mongoose, { Schema, Document } from "mongoose";

export interface Repost extends Document {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    repostedAt: Date;
}

const RepostSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    repostedAt: {
        type: Date,
        default: Date.now,
    }
})

RepostSchema.index({ user: 1, post: 1 }, { unique: true });

const RepostModel =
    (mongoose.models.Repost as mongoose.Model<Repost>) ||
    mongoose.model<Repost>("Repost", RepostSchema);

export default RepostModel;