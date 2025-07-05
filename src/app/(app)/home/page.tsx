'use client'

import MenuSidebar from '@/components/MenuSidebar'
import PostBox from '@/components/PostBox'
import PostList from '@/components/PostList'
import TrendingSidebar from '@/components/TrendingSidebar'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Post as PostType } from '@/model/Post';
import { User } from '@/model/User';
import { Separator } from '@/components/ui/separator'

interface PopulatedPost extends Omit<PostType, 'userId'> {
    userId: Pick<User, 'username' | 'firstName' | 'profilePicture'>;
    _id: string;
    createdAt: string;
}

const page = () => {
    const [posts, setPosts] = useState<PopulatedPost[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
      }, []);
    
      useEffect(() => {
        fetchPosts();
      }, [fetchPosts]);

    return (
        <div className='container mx-auto'>
            <div className="grid grid-cols-1 md:grid-cols-10 gap-10 max-w-full ">
                <div className="md:col-span-3">
                    <MenuSidebar />
                </div>
                <div className="md:col-span-4">
                    <PostBox onPostCreated={fetchPosts} />
                    <Separator className='mt-7'/>
                    <PostList posts={posts} loading={loading} />
                </div>
                <div className='md:col-span-3'>
                    <TrendingSidebar />
                </div>
            </div>
        </div>
    )
}

export default page