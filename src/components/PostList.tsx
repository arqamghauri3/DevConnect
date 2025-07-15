'use client'

import React, { useEffect } from 'react'
import PostCard from './PostCard'
import { Post as PostType } from '@/model/Post';
import { User } from '@/model/User';
import { useSession } from 'next-auth/react';


interface PopulatedPost extends Omit<PostType, 'userId'> {
    userId: Pick<User, 'username' | 'firstName' | 'profilePicture'>
    _id: string;
    createdAt: string;
}

interface PostListProps {
    posts: PopulatedPost[];
    loading: boolean;
    refetch: () => void
}

const PostList = ({ posts, refetch ,loading }: PostListProps) => {

    const {data: session} = useSession()


    if (loading) {
        return <div className='text-center mt-4'>Loading posts...</div>;
    }

    if (posts.length === 0) {
        return <div className='text-center mt-4'>No posts yet. Be the first to create one!</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center gap-4 mt-4'>
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    avatarUrl={post.userId?.profilePicture || "/avatar.jpg"}
                    name={post.userId?.firstName || post.userId?.username || "User"}
                    handle={post.userId?.username || "user"}
                    timestamp={new Date(post.createdAt).toLocaleDateString()}
                    content={post.post}
                    mediaUrl={post.mediaUrl}
                    mediaType={post.mediaType}
                    post_id={post._id}
                    user_id={session?.user._id}
                    refetch={refetch}
                />
            ))}
        </div>
    )
}

export default PostList