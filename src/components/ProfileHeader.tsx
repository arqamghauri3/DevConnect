'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Edit, Link2Icon, MapPinnedIcon, MessageCircle, SaveIcon, UploadIcon, User2Icon } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { boolean } from 'zod'
import { Input } from './ui/input'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { editProfile, fetchIsFollowing, fetchUser, followUser, unfollowUser } from '@/app/api/(profile)/profile'


interface FormData {
    username: string;
    link: string;
    profilePicture?: File; // Make optional
}


const ProfileHeader = ({ username }: any) => {
    const { data: session } = useSession();
    // const [userData, setUserData] = useState<UserData | null>(null);
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false)
    // const [isUser, setIsUser] = useState(false);
    const [isUserExist, setIsUserExist] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [formData, setFormData] = useState<FormData | null>(null)
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    // const [isFollowing, setIsFollowing] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);


    useEffect(() => {
        return () => {
            if (profileImagePreview) {
                URL.revokeObjectURL(profileImagePreview);
            }
        };
    }, [profileImagePreview]);

    const { data: userData, isLoading: userLoading, isError: userError } = useQuery({
        queryKey: ["user", username],
        queryFn: () => fetchUser(username),
        enabled: !!username

    })

    const followerId = session?.user?._id;
    const followingId = userData?._id;

    const { data: isFollowing, isLoading: followLoading } = useQuery({
        queryKey: ["isFollowing", followerId, followingId],
        queryFn: () => fetchIsFollowing(followerId, followingId),
        enabled: !!followerId && !!followingId,
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
            // Only retry if it's a 500 error
            return error?.response?.status === 500;
        },
    });

    // 3. Mutations for follow/unfollow
    const followMutation = useMutation({
        mutationFn: () => followUser(followerId, followingId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["isFollowing", followerId, followingId] });
            const previous = queryClient.getQueryData(["isFollowing", followerId, followingId]);
            queryClient.setQueryData(["isFollowing", followerId, followingId], true); // Set to following
            return { previous };
        },
        onError: (err, variables, context) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData(["isFollowing", followerId, followingId], context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["isFollowing", followerId, followingId] });
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: () => unfollowUser(followerId, followingId),
        // Optimistically update the cache before the mutation happens
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["isFollowing", followerId, followingId] });
            const previous = queryClient.getQueryData(["isFollowing", followerId, followingId]);
            queryClient.setQueryData(["isFollowing", followerId, followingId], false); // Set to not following
            return { previous };
        },
        // If the mutation fails, roll back
        onError: (err, variables, context) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData(["isFollowing", followerId, followingId], context.previous);
            }
        },
        // After mutation, refetch to ensure data is correct
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["isFollowing", followerId, followingId] });
        },
    });

    const editProfileMutation = useMutation({
        mutationFn: () => editProfile(username, formData?.link, selectedFile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user", username] });
            setIsEdit(false)
        }
    })

    if (userLoading) return <div>Loading...</div>;
    if (userError || !userData) return <div>User not found.</div>;

    const isUser = session?.user?.username === userData.username;
    // const handleFollow = async () => {

    //     console.log('follower:', followerId);
    //     console.log('following:', followingId);
    //     const response = await axios.post('/api/follow', { followerId, followingId });
    //     console.log('response', response);
    // }

    // const handleIsFollowing = async () => {
    //     try {
    //         const follower = session?.user._id;
    //         const following = userData?._id
    //         if (follower && following) {
    //             const response = await axios.get(`/api/follow?follower=${follower}&following=${following}`)
    //             console.log(response);
    //             setIsFollowing(response.data.success === true);
    //         }

    //     } catch (error) {

    //     }
    // }


    const handleEdit = () => {
        setIsEdit(true);
        setFormData({
            username: username,
            link: userData?.link || ''
            // profilePicture is optional, so we don't need to set it here
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setProfileImagePreview(previewUrl);
        }
    };

    // const handleSubmit = async () => {
    //     setIsUpdating(true);

    //     try {
    //         const formDataToSend = new FormData();
    //         formDataToSend.append('username', username);
    //         formDataToSend.append('link', formData?.link || '');

    //         if (selectedFile) {
    //             formDataToSend.append('profilePicture', selectedFile);
    //         }

    //         const response = await axios.put(`/api/user`, formDataToSend, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         if (response.data.user) {
    //             // setUserData(response.data.user);
    //             setProfileImagePreview(null);
    //             setSelectedFile(null);
    //             console.log('Profile updated successfully!');
    //         }

    //         setIsEdit(false);

    //     } catch (error) {
    //         console.error('Error updating user:', error);
    //         alert('Failed to update profile. Please try again.');
    //     } finally {
    //         setIsUpdating(false);
    //     }
    // };



    // const getUser = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(`/api/user?username=${username}`);
    //         console.log('API Response:', response.data);

    //         // Handle API-level errors (like "User Not Found")
    //         if (response.data.success === false) {
    //             console.log('❌ User not found:', response.data.message);
    //             setIsUserExist(false);
    //             setUserData(null);
    //             return;
    //         }

    //         // Handle successful response
    //         if (response.data.username) {
    //             console.log('✅ User found:', response.data.username);
    //             setUserData(response.data.username);
    //             setIsUserExist(true);
    //         }

    //     } catch (error) {
    //         // Handle network errors (like 500 status)
    //         console.error('❌ Network error:', error);
    //         if (axios.isAxiosError(error)) {
    //             console.log('Error response:', error.response?.data);
    //         }
    //         setIsUserExist(false);
    //         setUserData(null);
    //     } finally {
    //         setLoading(false);
    //     }
    // }



    // useEffect(() => {
    //     getUser()


    // }, [])

    // useEffect(() => {
    //     if (userData && session?.user?.username) {
    //         console.log('ud', userData.username);
    //         console.log('ses', session.user.username);

    //         if (userData.username === session.user.username) {
    //             setIsUser(true);
    //         }
    //     }
    // }, [userData, session?.user?.username]);


    // useEffect(() => {
    //     if (session?.user?._id && userData?._id) {
    //         handleIsFollowing()
    //     }
    // }, [session?.user?._id, userData?._id])

    return <>
        {!userError ? (
            <>
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
                                        <a href={userData?.link || 'Loading'} className='text-blue-500 dark:text-blue-300'>
                                            {userData?.link || 'Loading'}
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            type='text'
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    username: prev?.username || username,
                                                    link: e.target.value,
                                                    profilePicture: prev?.profilePicture // Keep existing
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
                                            onClick={() => editProfileMutation.mutate()}
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
                                    {isFollowing ? (
                                        <>
                                            <>
                                                <Button  onClick={() => unfollowMutation.mutate()} variant={'outline'} className='font-bold h-10 w-28 bg-black text-white dark:bg-white dark:text-black dark:hover:text-white'>
                                                    <User2Icon />
                                                    UnFollow
                                                </Button>
                                            </>
                                        </>
                                    ) : (
                                        <>
                                            <Button  onClick={() => followMutation.mutate()} variant={'outline'} className='font-bold h-10 w-28 bg-black text-white dark:bg-white dark:text-black dark:hover:text-white'>
                                                <User2Icon />
                                                Follow
                                            </Button>
                                        </>
                                    )}

                                    <Button variant={'outline'} className='font-semibold h-10 w-28 bg-white text-black dark:bg-black dark:text-white '>
                                        <MessageCircle />
                                        Message
                                    </Button>
                                </>
                            )}

                        </div>
                    </div>
                    <div className='ml-10 mt-2 mb-2 flex items-center '>
                        <div className={isEdit ? ('rounded-mg relative w-64') : ('rounded-mg w-64')}>
                            {isEdit ? (
                                <div className='absolute bottom-0 right-4'>
                                    <Button variant={'ghost'} className='w-9 h-9 bg-white  dark:bg-black rounded-full relative'>
                                        <UploadIcon className='rounded-full' />
                                        <Input
                                            type='file'
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </Button>
                                </div>
                            ) : null}
                            <Image
                                src={profileImagePreview || userData?.profilePicture || "/placeholder.svg"}
                                alt="Profile"
                                width={32}
                                height={32}
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        </div>
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