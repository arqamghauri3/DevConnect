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