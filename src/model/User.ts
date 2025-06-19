import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  bio: string;
  profilePicture: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  provider: string;
}

const UserSchema: Schema<User> = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, default: "" },
  firstName: { type: String, required: true },
  lastName: { type: String, default: "" },
  dateOfBirth: { type: Date, required: true },
  bio: { type: String, default: "" },
  profilePicture: {
    type: String,
    default:
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  verifyCode: { type: String, required: false, default: "" },
  verifyCodeExpiry: { type: Date, required: false, default: Date.now },
  isVerified: { type: Boolean, default: false },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please fill a valid email address"],
  },
  provider: {
    type: String,
    required: true
  }
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
