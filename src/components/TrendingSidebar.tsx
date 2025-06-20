import { BookIcon, CalendarIcon, HomeIcon, icons, TrendingUp, UsersIcon } from 'lucide-react'
import React from 'react'

const TrendingSidebar = () => {
    const trends = [
        {
            name: "Home",
            link: "/home",
            number: "5K posts"
        },
        {
            name: "My Network",
            link: "/network",
            number: "7.5K posts"
        },
        {
            name: "Articles",
            link: "/articles",
            number: "15K posts"
        },
        {
            name: "Events",
            link: "/events",
            number: "8K posts"
        },

    ]
    return (
        <div className='bg-white text-black border border-gray-200 dark:border-white dark:bg-black dark:text-white px-5 py-4 rounded-md ml-4 mr-4 md:ml-0 mt-4 '>
            <div className='flex gap-3 items-center mt-2'>
                <TrendingUp />
                <h1 className='text-lg font-semibold'>Trending Topics</h1>
            </div>
            <ul>
                {trends.map((item, index) => {
                    return (
                        <li key={index} className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 font-semibold'>
                            <a href={item.link} className='max-w-full text-sm'>
                                <div className='flex-col'>
                                    <div className='font-semibold text-md'>{item.name}</div>
                                    <div className='text-gray-400 text-sm'>{item.number} </div>
                                </div>
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default TrendingSidebar