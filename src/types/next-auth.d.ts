import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    firstName?: string,
    lastName?: string,
    _id?: string;
    isVerified?: boolean;
    username?: string;
    profilePicture?: string;
  }
  interface Session {
    user: {
      firstName?: string,
      lastName?: string,
      _id?: string;
      isVerified?: boolean;
      username?: string;
      profilePicture?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string,
    lastName?: string,
    _id?: string;
    isVerified?: boolean;
    username?: string;
    profilePicture?: string;
  }
}