import dbConnect from "@/lib/dbConnect";
import RepostModel from "@/model/Repost";

export async function POST(request: Request) {

    await dbConnect()

    try {

        const { post, user } = await request.json()

        if (!post && !user) {
            return Response.json({
                success: true,
                message: "Missing fields",
            },
                { status: 400 }
            )
        }

        const repost = new RepostModel({
            post: post,
            user: user
        })

        await repost.save()

        return Response.json({
            success: true,
            data: repost,
            message: "Repost Successfully",
        },
            {
                status: 200
            }
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
        const user = searchParams.get("user")
        const post = searchParams.get("post")

        if (!post && !user) {
            return Response.json({
                success: true,
                message: "Missing fields",
            },
                { status: 400 }
            )
        }

        const repostCount = await RepostModel.countDocuments({
            post: post,
        })

        if (repostCount >= 0) {
            return Response.json({
                success: true,
                data: repostCount,
                message: "Repost Fetched Successfully",
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