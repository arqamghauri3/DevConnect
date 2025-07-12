'use client'

import Image from 'next/image';
import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

import { MessageCircle, Repeat, Heart, BarChart2, Upload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface PostCardProps {
  avatarUrl: string;
  name: string;
  handle: string;
  timestamp: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'photo' | 'video';
  post_id?: string
  user_id?: string
}

const PostCard: React.FC<PostCardProps> = ({
  avatarUrl,
  name,
  handle,
  timestamp,
  content,
  mediaUrl,
  mediaType,
  post_id,
  user_id
}) => {


  const { data: likeCount, refetch: refetchLikeCount } = useQuery({
    queryKey: ["likeCount", post_id],
    queryFn: () => fetchLikes(post_id),
    enabled: !!post_id,
    refetchOnWindowFocus: false

  })

  const { data: isUserLike, refetch: refetchIsUserLike } = useQuery({
    queryKey: ["isUserLike", user_id, post_id],
    queryFn: () => fetchCurrentUserLike(user_id, post_id),
    enabled: !!user_id && !!post_id,
    refetchOnWindowFocus: false
  })

  const fetchLikes = async (post: string | undefined) => {
    const response = await axios.get(`/api/like?post=${post}`)
    return response
  }

  const fetchCurrentUserLike = async (user_id: string | undefined, post: string | undefined) => {

    const response = await axios.get(`/api/like/user?user=${user_id}&post=${post}`)

    if (response.data.data != null) {
      return true
    }

    return false
  }

  const handleLike = async (action: string) => {
    if (action === "like") {
      const response = await axios.post('/api/like', { post: post_id, user: user_id })
      console.log("like");

    }
    else {
      const response = await axios.delete('/api/like', {
        data: { post: post_id, user: user_id }
      })
      console.log("unlike");
    }
    refetchLikeCount()
    refetchIsUserLike()
  }

  return (
    <Card className="w-full bg-white dark:bg-black text-black dark:text-white border-gray-200 dark:border-gray-800 rounded-lg mt-5">
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Image
          src={avatarUrl}
          alt={`${name}'s avatar`}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{name}</span>
            <span className="text-gray-500">@{handle}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{timestamp}</span>
          </div>
        </div>
        <div className='w-full flex justify-end'>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className='text-red-500'>. . .</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">Dimensions</h4>
                    <p className="text-muted-foreground text-sm">
                      Set the dimensions for the layer.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        defaultValue="100%"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="maxWidth">Max. width</Label>
                      <Input
                        id="maxWidth"
                        defaultValue="300px"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        defaultValue="25px"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="maxHeight">Max. height</Label>
                      <Input
                        id="maxHeight"
                        defaultValue="none"
                        className="col-span-2 h-8"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="mb-4">{content}</p>
        {mediaUrl && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
            {mediaType === 'photo' ? (
              <Image
                src={mediaUrl}
                alt="Post media"
                width={350}
                height={350}
                className="w-full h-auto object-cover"
              />
            ) : mediaType === 'video' ? (
              <video
                src={mediaUrl}
                controls
                className="w-full h-auto"
              />
            ) : null}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-around p-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
          <button >
            <MessageCircle size={20} />
          </button>
          <span>0</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
          <button >
            <Repeat size={20} />
          </button>
          <span>0</span>

        </div>
        <div className={`flex items-center space-x-2 hover:text-red-500 cursor-pointer ${isUserLike ? 'text-red-500' : 'text-gray-500'}`}>
          <button className=' cursor-pointer' onClick={() => !isUserLike ? handleLike("like") : handleLike("unlike")}>
            <Heart
              size={20}
              fill={isUserLike ? "red" : "none"}
            />
          </button>
          <span>{likeCount?.data.data}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
          <button >
            <BarChart2 size={20} />
          </button>
          <span>0</span>
        </div>
        <div className="text-gray-500 hover:text-blue-500">
          <button >
            <Upload size={20} />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
