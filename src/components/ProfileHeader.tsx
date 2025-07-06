'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Edit, Link2Icon, MapPinnedIcon, MessageCircle, SaveIcon, User2Icon } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { boolean } from 'zod'
import { Input } from './ui/input'

interface UserData {
    _id: string;
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    bio: string;
    profilePicture: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    provider: string;
    link: string;
}

interface FormData {
    username: string;
    link: string;
}


const ProfileHeader = ({ username }: any) => {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false)
    const [isUser, setIsUser] = useState(false);
    const [isUserExist, setIsUserExist] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [formData, setFormData] = useState<FormData | null>(null)
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEdit = () => {
        setIsEdit(true);
        setFormData({
            username: username,
            link: userData?.link || ''
        });
    }

    const handleSubmit = async () => {
        setIsUpdating(true);
        
        try {
            const requestData = {
                username: username,
                ...formData
            };
            
            const response = await axios.put(`/api/user`, requestData);
            console.log('PUT Response: ', response.data);
            
            // ✅ Update local state immediately
            if (response.data.user) {
                setUserData(response.data.user);
            }
            
            setIsEdit(false);
            
        } catch (error) {
            console.error('Error updating user:', error);
            // You could add a toast notification here
        } finally {
            setIsUpdating(false);
        }
    }

    const getUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/user?username=${username}`);
            console.log('API Response:', response.data);

            // Handle API-level errors (like "User Not Found")
            if (response.data.success === false) {
                console.log('❌ User not found:', response.data.message);
                setIsUserExist(false);
                setUserData(null);
                return;
            }

            // Handle successful response
            if (response.data.username) {
                console.log('✅ User found:', response.data.username);
                setUserData(response.data.username);
                setIsUserExist(true);
            }

        } catch (error) {
            // Handle network errors (like 500 status)
            console.error('❌ Network error:', error);
            if (axios.isAxiosError(error)) {
                console.log('Error response:', error.response?.data);
            }
            setIsUserExist(false);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (userData && session?.user?.username) {
            console.log('ud', userData.username);
            console.log('ses', session.user.username);

            if (userData.username === session.user.username) {
                setIsUser(true);
            }
        }
    }, [userData, session?.user?.username]);

    return <>
        {isUserExist ? (<><div className='mt-8 max-w-6xl rounded-lg mx-auto bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-700'>
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
                        {userData?.firstName || 'Loading'} {userData?.lastName || ''}
                    </h1>
                    <p className='text-gray-500 text-lg'>@{userData?.username || ''}</p>
                </div>
                <div className='flex gap-2 text-gray-500'>
                    <MapPinnedIcon />
                    <p>Oslo, Norway</p>
                </div>
                <div className='flex gap-2 text-gray-500'>
                    <Link2Icon />
                    <p>
                        {!isEdit ? (
                            <>
                                <a href='www.linkedin.com/in/arqam-ghauri/' className='text-blue-500 dark:text-blue-300'>
                                    {userData?.link || 'Loading'}
                                </a>
                            </>
                        ) : (
                            <>
                                <Input 
                                    type='text' 
                                    onChange={(e) => { 
                                        setFormData(prev => ({
                                            username: prev?.username || username, // Ensure username is always set
                                            link: e.target.value
                                        })) 
                                    }} 
                                    value={formData?.link || ''} 
                                />
                            </>
                        )}

                    </p>
                </div>
                <div className='space-x-3 mt-2'>
                    {isUser ? (
                        <>
                            {isEdit ? (
                                <Button 
                                    variant={'outline'} 
                                    onClick={handleSubmit} 
                                    disabled={isUpdating}
                                    className='font-semibold h-10 w-28 bg-white text-black dark:bg-black dark:text-white'
                                >
                                    {isUpdating ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <SaveIcon />
                                            Save
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button 
                                    variant={'outline'} 
                                    className='font-bold h-10 w-28 bg-black text-white dark:bg-white dark:text-black dark:hover:text-white' 
                                    onClick={handleEdit}
                                >
                                    <Edit />
                                    Edit Profile
                                </Button>
                            )}




                        </>
                    ) : (
                        <>
                            <Button variant={'outline'} className='font-bold h-10 w-28 bg-black text-white dark:bg-white dark:text-black dark:hover:text-white'>
                                <User2Icon />
                                Follow
                            </Button>
                            <Button variant={'outline'} className='font-semibold h-10 w-28 bg-white text-black dark:bg-black dark:text-white '>
                                <MessageCircle />
                                Message
                            </Button>
                        </>
                    )}

                </div>
            </div>
            <div className='ml-10 mt-2 mb-2 flex items-center'>
                <Image
                    src={userData?.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    width={15}
                    height={15}
                    className="w-32 h-32 rounded-full"
                />

                <div className='mx-10 mt-1 text-gray-600'>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum nisi deserunt aliquid officiis laboriosam. Dignissimos aliquid veritatis, quis architecto libero, reiciendis unde magni corrupti illo, laborum non maiores eum rerum?</p>
                </div>

            </div>

        </div></>) : (
            <>
                Error Page
            </>
        )
        }
    </>



}

export default ProfileHeader