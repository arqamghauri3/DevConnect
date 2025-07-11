import dbConnect from "@/lib/dbConnect";
import LikeModel from "@/model/Like";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const { post, user } = await request.json()

        if (!post || !user) {
            return Response.json({
                success: true,
                message: "Missing fields",
            },
                { status: 400 }
            )
        }

        const like = new LikeModel({
            post: post,
            user: user
        })

        await like.save()
        return Response.json({
            success: true,
            message: "Like Added Successfully",
        },
            { status: 200 }
        )

    } catch (error) {
        return Response.json({
            success: false,
            message: "Internal network error"
        },
            {
                status: 500
            })
    }
}

export async function GET(request: Request) {

    await dbConnect();

    try {
        const { searchParams } = new URL(request.url)
        const post = searchParams.get("post");

        if (!post) {
            return Response.json({
                success: true,
                message: "Missing fields",
            },
                { status: 400 }
            )
        }

        const likeCount = await LikeModel.countDocuments({
            post: post
        })

        if (likeCount >= 0) {
            return Response.json({
                success: true,
                data: likeCount,
                message: "Likes Fetched Successfully",
            },
                { status: 200 }
            )
        }

    } catch (error) {
        return Response.json({
            success: false,
            message: "Internal network error"
        },
            {
                status: 500
            })
    }

}