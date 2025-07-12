import dbConnect from "@/lib/dbConnect";
import LikeModel from "@/model/Like";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const user = searchParams.get("user")
        const post = searchParams.get("post")

        if (!user && !post) {
            return Response.json({
                success: false,
                message: "Missing fields"
            },
                {
                    status: 404
                })
        }

        const userLike = await LikeModel.findOne({ user: user, post: post })

        if (userLike) {
            return Response.json({
                success: true,
                data: userLike,
                message: "Like found"
            },
                {
                    status: 200
                })
        } else {
            return Response.json({
                success: false,
                data: userLike,
                message: "Like doesn't exist"
            },
                {
                    status: 200
                })
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