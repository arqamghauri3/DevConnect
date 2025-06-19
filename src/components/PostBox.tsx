'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu'
import { ArrowDown, ArrowDownIcon, CalendarIcon, CodeIcon, ImageIcon, LinkIcon, LucideArrowDown, MoreHorizontalIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { postSchema } from '@/schemas/postSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'

const PostBox = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit = async (data: z.infer<typeof postSchema>) => {
        setIsSubmitting(true);
        // const result = await signIn("credentials", {
        //   redirect: false,
        //   identifier: data.identifier,
        //   password: data.password,
        // });
        // if (result?.error) {
        //   toast.error(result.error);
        // }

        // if (result?.url) {
        //   toast.success("Login successful!");
        //   router.replace("/profile");
        // }

        setIsSubmitting(false);
    };

    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            post: "",
            category: "",
            photo: "",
            video: "",
            link: "",
            tags: [],
            event: ""
        },
    });
    const [selected, setSelected] = useState('Discussion');
    return (
        <div className='bg-white text-black border border-gray-200 dark:border-white dark:bg-black dark:text-white max-w-xl px-5 py-2 rounded-md ml-4 mt-4 '>
            <div className='flex gap-3'>
                <div>
                    <Image className='rounded-full' src="https://kzmfs1j9s5xnomxdm2d3.lite.vusercontent.net/placeholder.svg" alt="profile" width={40} height={40} />
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
                    <div className='grow-1'>
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
                                                    className="w-full px-4 py-4 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y bg-white dark:bg-black dark:text-white"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-sm mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </div>
                    <div className='flex justify-between items-center'>
                        <ul className='flex gap-2 text-md'>
                            <li className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 flex items-center gap-2'>
                                <ImageIcon className='w-5 h-5' />
                                <p>Photo</p>
                            </li>
                            <li className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 flex items-center gap-2'>
                                <CodeIcon className='w-5 h-5' />
                                <p>Code</p>
                            </li>
                            <li className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 flex items-center gap-2'>
                                <LinkIcon className='w-5 h-5' />
                                <p>Link</p>
                            </li>
                            <li className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 flex items-center gap-2'>
                                <CalendarIcon className='w-5 h-5' />
                                <p>Event</p>
                            </li>
                        </ul>
                        <div className='flex gap-2 mt-3'>
                            <Button className='bg-black text-white dark:bg-white dark:text-black cursor-pointer px-4 py-2 rounded-md'>
                                <p>Post</p>
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PostBox