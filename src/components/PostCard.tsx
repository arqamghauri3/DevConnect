'use client'

import Image from 'next/image';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

import { MessageCircle, Repeat, Heart, BarChart2, Upload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface PostCardProps {
  avatarUrl: string;
  name: string;
  handle: string;
  timestamp: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'photo' | 'video';
  link?: string
}

const PostCard: React.FC<PostCardProps> = ({
  avatarUrl,
  name,
  handle,
  timestamp,
  content,
  mediaUrl,
  mediaType,
  link
}) => {

  const { data: likeCount } = useQuery({
    queryKey: ["likeCount", link],
    queryFn: () => fetchLikes(link),
    enabled: !!link,
    refetchOnWindowFocus: false
      
  })

  const fetchLikes = async(post: string | undefined) => {
    const response = axios.get(`/api/like?post=${post}`)
    return response
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
        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
          <MessageCircle size={20} />
          <span>0</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
          <Repeat size={20} />
          <span>0</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
          <Heart size={20} />
          <span>{likeCount?.data.data}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
          <BarChart2 size={20} />
          <span>0</span>
        </button>
        <button className="text-gray-500 hover:text-blue-500">
          <Upload size={20} />
        </button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
