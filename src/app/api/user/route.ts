import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/dbConnect'
import LikeModel from '@/model/Like';
import PostModel from '@/model/Post';
import UserModel from '@/model/User';
import FollowModel from '@/model/Follow';


async function uploadToCloudinary(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result) {
                    return resolve(result.secure_url);
                }
                return reject(new Error("Upload failed"));
            }
        ).end(bytes);
    });
}

export async function GET(request: Request) {

    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username")
        const user = await UserModel.findOne({
            username,
            isVerified: true,
        });;
        if (user != null) {
            return Response.json({
                username: user
            });
        }
        return Response.json({
            success: false,
            message: 'User Not Found'
        },
            {
                status: 500
            })



    } catch (error) {
        return Response.json({
            success: false,
            message: 'User Not Fetched'
        },
            {
                status: 500
            })

    }


}

export async function PUT(request: Request) {
    await dbConnect();

    try {
        const formData = await request.formData();
        const username = formData.get('username') as string;
        const link = formData.get('link') as string;
        const profilePictureFile = formData.get('profilePicture') as File;

        let updateData: any = { link };

        // Handle file upload if provided
        if (profilePictureFile) {
            const imageUrl = await uploadToCloudinary(profilePictureFile);
            updateData.profilePicture = imageUrl;
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { username: username },
            { $set: updateData },
            { new: true }
        );

        if (updatedUser) {
            return Response.json({
                user: updatedUser
            });
        }

        return Response.json({
            success: false,
            message: 'User Not Found'
        }, { status: 404 });

    } catch (error) {
        console.error('Internal Server Error:', error);
        return Response.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    await dbConnect();

    try {
        const { userId } = await request.json();

        if(!userId){
            return Response.json({
                success: false,
                message: "Missing fields!"
            },{
                status: 404
            });
        }

        await LikeModel.deleteMany({ user: userId });
        await PostModel.deleteMany({ userId: userId });
        await FollowModel.deleteMany({
            $or: [{ follower: userId }, { following: userId }]
        });
        await UserModel.findByIdAndDelete(userId);

        return Response.json({
            success: true,
            message: "User and all associated data deleted successfully"
        },{
            status: 200
        });

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to delete user"
        }, { status: 500 });
    }
}