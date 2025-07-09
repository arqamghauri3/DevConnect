export interface UserData {
    _id: string;
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
    link: string;
}