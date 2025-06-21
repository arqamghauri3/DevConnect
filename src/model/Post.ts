import mongoose, { Schema, Document } from "mongoose";

export interface Post extends Document {
  post: string;
  category: string;
  mediaUrl?: string;
  mediaType?: 'photo' | 'video';
  link?: string;
  tags?: string[];
  event?: string;
  userId?: string;
}

const PostSchema: Schema<Post> = new Schema(
  {
    post: { type: String, required: true },
    category: { type: String, required: true },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['photo', 'video'] },
    link: { type: String },
    tags: [{ type: String }],
    event: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

const PostModel =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model<Post>("Post", PostSchema);

export default PostModel;


