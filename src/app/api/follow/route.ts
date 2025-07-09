import dbConnect from '@/lib/dbConnect';
import FollowModel from '@/model/Follow';
import React from 'react'

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { follower, following } = await request.json();
    const follow = new FollowModel({
      following: following,
      follower: follower
    })
    await follow.save()
    console.log('follow', follow);


    return Response.json({
      success: true,
      message: "Follow Added Successfully",
    },
      { status: 200 }
    )
  } catch (error) {
    return Response.json({
      success: false,
      message: "Follow Failed",
    },
      { status: 500 })

  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url)
    const follower = searchParams.get("follower")
    const following = searchParams.get("following")

    if (!follower || !following) {
      return Response.json({
        success: false,
        data: null,
        message: "Missing required fields!"
      }, { status: 400 });
    }

    const follow = await FollowModel.findOne({ follower, following });
    console.log(follow);

    if (follow) {
      return Response.json({
        success: true,
        data: follow,
        message: "Follow Exists!"
      }, { status: 200 });
    } else {
      return Response.json({
        success: false,
        data: null,
        message: "Follow Doesn't Exist!"
      }, { status: 404 });
    }
  } catch (error) {
    console.error("Error checking follow relationship:", error);
    return Response.json({
      success: false,
      data: null,
      message: "Internal server error.",
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();

  try {

    const { follower, following } = await request.json()
    const result = await FollowModel.findOneAndDelete({
      follower: follower,
      following: following
    });

    if(result){
      return Response.json({
        success: true,
        message: "Unfollowed Successfully"
      },{
        status: 200
      })
    }

    return Response.json({
      success: false,
      message: "Follow doesn't exist"
    },{
      status: 404
    })

  } catch (error) {
    console.error("Error deleting follow relationship: ", error);
    return Response.json({
      success: false,
      message: "Internal Server error."
    },
      {
        status: 500
      })
  }
}