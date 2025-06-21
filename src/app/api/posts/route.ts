import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import cloudinary from "@/lib/cloudinary";


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
        const posts = await PostModel.find({})
            .populate({
                path: 'userId',
                model: UserModel,
                select: 'username firstName profilePicture'
            })
            .sort({ createdAt: -1 });

        return Response.json(posts);

    } catch (error) {
        console.error("Error fetching posts", error);
        return Response.json(
          {
            success: false,
            message: "Failed to fetch posts",
          },
          {
            status: 500,
          }
        );
    }
}


export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return Response.json(
            {
              success: false,
              message: "Not authenticated",
            },
            {
              status: 401,
            }
          );
    }

    try {
        const formData = await request.formData();
        const post = formData.get('post') as string;
        const category = formData.get('category') as string;
        const link = formData.get('link') as string | null;
        const event = formData.get('event') as string | null;
        const tagsString = formData.get('tags') as string | null;
        const tags = tagsString ? JSON.parse(tagsString) : [];

        const mediaFile = formData.get('media') as File | null;

        let mediaUrl: string | undefined = undefined;
        let mediaType: 'photo' | 'video' | undefined = undefined;

        const postData: any = {
            post,
            category,
            link,
            tags,
            event,
            userId: user._id
        };

        if (mediaFile) {
            mediaUrl = await uploadToCloudinary(mediaFile);
            if(mediaFile.type.startsWith('image/')){
                mediaType = 'photo';
            } else if(mediaFile.type.startsWith('video/')){
                mediaType = 'video';
            }

            if (mediaUrl && mediaType) {
                postData.mediaUrl = mediaUrl;
                postData.mediaType = mediaType;
            }
        }

        const newPost = new PostModel(postData);
        await newPost.save()

        return Response.json(
            {
                success: true,
                message: "Post Added Successfully",
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error writing a Post", error);
        return Response.json(
          {
            success: false,
            message: "Post Failed",
          },
          {
            status: 500,
          }
        );

    }
}