import dbConnect from '@/lib/dbConnect';
import FollowModel from '@/model/Follow';
import React from 'react'

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
      
          const followerCount = await FollowModel.countDocuments({follower: follower})
          const followingCount = await FollowModel.countDocuments({following: following})
          console.log("Follower Count ",followerCount);
          console.log("Following Count ",followingCount);

          if (followerCount >= 0 || followingCount >= 0 ) {
            return Response.json({
              success: true,
              data: {
                followerCount,
                followingCount
              },
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