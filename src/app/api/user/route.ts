import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User';

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
        const data = await request.json()
        const { username, link } = data
        const updatedUser = await UserModel.findOneAndUpdate(
            {
                username: username
            },
            {
                $set: { link: link }
            },
            { new: true }
        )
        if (updatedUser != null) {
            return Response.json({
                user: updatedUser
            });
        }

        // return Response.json({
        //     success: false,
        //     message: 'User Not Found'
        // },
        //     {
        //         status: 500
        //     })

        return Response.json({
            data: data
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