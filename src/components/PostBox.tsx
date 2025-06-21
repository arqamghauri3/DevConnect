'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu'
import { ArrowDown, ArrowDownIcon, CalendarIcon, CodeIcon, ImageIcon, LinkIcon, LucideArrowDown, MoreHorizontalIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { postSchema } from '@/schemas/postSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { ApiResponse } from '@/types/ApiResponse'
import { useRouter } from 'next/navigation'

const PostBox = ({ onPostCreated }: { onPostCreated: () => void }) => {
    const {data: session} = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            post: "",
            category: "",
            media: undefined,
            link: "",
            tags: [],
            event: ""
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selected, setSelected] = useState('Discussion');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showEventInput, setShowEventInput] = useState(false);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);

    useEffect(() => {
        form.setValue('category', selected)
    }, [selected, form])

    // Clean up the object URL on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
            }
        };
    }, [mediaPreview]);


    const onSubmit = async (data: z.infer<typeof postSchema>) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('post', data.post);
            formData.append('category', data.category);

            if(data.tags){
                formData.append('tags', JSON.stringify(data.tags));
            }
            if(data.link){
                formData.append('link', data.link);
            }
            if(data.event){
                formData.append('event', data.event);
            }
            if(data.media){
                formData.append('media', data.media);
            }

            const response = await axios.post<ApiResponse>("/api/posts", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(response.data.message ?? "Post created successfully");
            form.reset();
            setMediaPreview(null);
            setShowEventInput(false)
            setShowLinkInput(false)
            onPostCreated();
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? "Error in Post")
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        form.setValue('media', file);

        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }

        if (file) {
            setMediaPreview(URL.createObjectURL(file));
        } else {
            setMediaPreview(null);
        }
    }

    const cancelMedia = () => {
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }
        setMediaPreview(null);
        form.setValue('media', undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }


    if (!session?.user) {
        return (
            <div className='bg-white text-black border border-gray-200 dark:border-white  dark:bg-black dark:text-white px-5 py-4 rounded-md mt-4 text-center'>
                <p className='mb-4'>Please log in to create a post.</p>
                <Button onClick={() => router.push('/sign-in')}>
                    Login
                </Button>
            </div>
        )
    }

    return (
        <div className='bg-white text-black border border-gray-200 dark:border-white  dark:bg-black dark:text-white px-5 py-4 rounded-md mt-4 '>
            <div className='flex gap-3'>
                <div>
                    <Image className='rounded-full' src={session.user.profilePicture || "https://kzmfs1j9s5xnomxdm2d3.lite.vusercontent.net/placeholder.svg"} alt="profile" width={40} height={40} />
                </div>
                <div className='w-full'>
                    <div className='flex items-center gap-5'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="min-w-[150px] flex justify-between items-center gap-2 px-4 py-2 border rounded-md bg-white dark:bg-black text-sm font-medium">
                                    {selected}
                                    <LucideArrowDown className='w-4 h-4 mt-1' />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => setSelected('Discussion')}>Discussion</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setSelected('Post')}>Post</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setSelected('Articles')}>Articles</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setSelected('Jobs')}>Jobs</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    <div >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-2">
                                <FormField
                                    control={form.control}
                                    name="post"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <textarea
                                                    placeholder="Write your post..."
                                                    {...field}
                                                    className="w-full px-1 py-4 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-white dark:bg-black dark:text-white"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-sm mt-1" />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="hidden"
                                                    {...field}
                                                    
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Tags (comma separated, optional)"
                                                    type='text'
                                                    {...field}
                                                    onChange={e => field.onChange(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                                                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="media"
                                    render={({ field }) => (
                                        <FormItem className='hidden'>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {mediaPreview && (
                                    <div className='relative mt-2 border rounded-md p-2'>
                                        <button
                                            type='button'
                                            onClick={cancelMedia}
                                            className='absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 z-10'
                                        >
                                            <XIcon className='w-4 h-4'/>
                                        </button>
                                        {form.getValues('media')?.type.startsWith('image/') ? (
                                            <Image src={mediaPreview} alt="Media preview" width={500} height={300} className="rounded-md w-full object-contain max-h-80" />
                                        ) : (
                                            <video src={mediaPreview} controls className="rounded-md w-full max-h-80" />
                                        )}
                                    </div>
                                )}
                                {showLinkInput && (
                                    <FormField
                                        control={form.control}
                                        name="link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Link (optional)"
                                                        {...field}
                                                        onBlur={() => setShowLinkInput(false)}
                                                        autoFocus
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                {showEventInput && (
                                    <FormField
                                        control={form.control}
                                        name="event"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Event (optional)"
                                                        {...field}
                                                        onBlur={() => setShowEventInput(false)}
                                                        autoFocus
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <div className='flex justify-between items-start flex-col '>
                                    <ul className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm w-full'>
                                        <div className='md:col-span-1'>
                                            <li
                                                className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 flex items-center gap-2 cursor-pointer'
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <ImageIcon className='w-4 h-4' />
                                                <p>Media</p>
                                            </li>
                                        </div>
                                        <div className='md:col-span-1'>
                                            <li
                                                className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 flex items-center gap-2 cursor-pointer'
                                                onClick={() => setShowLinkInput((v) => !v)}
                                            >
                                                <LinkIcon className='w-4 h-4' />
                                                <p>Link</p>
                                            </li>
                                        </div>
                                        <div className='md:col-span-1'>
                                            <li
                                                className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 flex items-center gap-2 cursor-pointer'
                                                onClick={() => setShowEventInput((v) => !v)}
                                            >
                                                <CalendarIcon className='w-4 h-4' />
                                                <p>Event</p>
                                            </li>
                                        </div>
                                    </ul>

                                </div>
                                <div className='mt-3 w-full'>
                                    <Button
                                        type="submit"
                                        className='bg-black text-white dark:bg-white dark:text-black cursor-pointer rounded-md w-full'
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default PostBox