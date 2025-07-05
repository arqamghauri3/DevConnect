import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { Link2Icon, MapPinnedIcon, MessageCircle, User2Icon } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useSession } from 'next-auth/react'

const ProfileHeader = () => {
    const { data: session } = useSession();
    return (
        <div className='mt-8 max-w-6xl rounded-lg mx-auto bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700'>
            <div className='rounded-mg'>
                <Image
                    alt='Profile cover image'
                    src="https://kzmfs1j9s5xnomxdm2d3.lite.vusercontent.net/placeholder.svg"
                    width={800}
                    height={200}
                    className="w-full h-48 object-cover"
                />

            </div>
            <div className='flex justify-between px-10 mt-5 items-center'>
                <div className=''>
                    <h1 className='text-2xl font-bold'>
                    {session?.user?.firstName} {session?.user?.lastName}
                    </h1>
                    <p className='text-gray-500 text-lg'>@{session?.user?.username}</p>
                </div>
                <div className='flex gap-2 text-gray-500'>
                    <MapPinnedIcon />
                    <p>Oslo, Norway</p>
                </div>
                <div className='flex gap-2 text-gray-500'>
                    <Link2Icon />
                    <p>
                        <a href='www.linkedin.com/in/arqam-ghauri/' className='text-blue-500 dark:text-blue-300'>
                            www.linkedin.com/in/arqam-ghauri/
                        </a>
                    </p>
                </div>
                <div className='space-x-3 mt-2'>
                    <Button variant={'outline'} className='font-bold h-10 w-28 bg-black text-white dark:bg-white dark:text-black dark:hover:text-white'>
                        <User2Icon />
                        Follow
                    </Button>
                    <Button variant={'outline'} className='font-semibold h-10 w-28 bg-white text-black dark:bg-black dark:text-white '>
                        <MessageCircle />
                        Message
                    </Button>
                </div>
            </div>
            <div className='ml-10 mt-2 mb-2 flex items-center'>
                <Image
                    src={session?.user?.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    width={15}
                    height={15}
                    className="w-32 h-32 rounded-full"
                />

                <div className='mx-10 mt-1 text-gray-600'>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum nisi deserunt aliquid officiis laboriosam. Dignissimos aliquid veritatis, quis architecto libero, reiciendis unde magni corrupti illo, laborum non maiores eum rerum?</p>
                </div>

            </div>

        </div>
    )
}

export default ProfileHeader