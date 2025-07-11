'use client'

import React from 'react'
import PostCard from './PostCard'
import { Post as PostType } from '@/model/Post';
import { User } from '@/model/User';

interface PopulatedPost extends Omit<PostType, 'userId'> {
    userId: Pick<User, 'username' | 'firstName' | 'profilePicture'>;
    _id: string;
    createdAt: string;
}

interface PostListProps {
    posts: PopulatedPost[];
    loading: boolean;
}

const PostList = ({ posts, loading }: PostListProps) => {

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
                    link={post._id}
                />
            ))}
        </div>
    )
}

export default PostList