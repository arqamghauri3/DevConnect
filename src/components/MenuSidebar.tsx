import { BookIcon, CalendarIcon, HomeIcon, icons, UsersIcon } from 'lucide-react'
import React from 'react'

const MenuSidebar = () => {
    const menuItem = [
        {
            name: "Home",
            link: "/home",
            icon: <HomeIcon />
        },
        {
            name: "My Network",
            link: "/network",
            icon: <UsersIcon />
        },
        {
            name: "Articles",
            link: "/articles",
            icon: <BookIcon />
        },
        {
            name: "Events",
            link: "/events",
            icon: <CalendarIcon />
        },

    ]
    return (
            <div className='bg-white text-black border border-gray-200 dark:border-white dark:bg-black dark:text-white px-5 py-2 rounded-md ml-4 mt-4 '>
                <ul>
                    {menuItem.map((item, index) => {
                        return (
                            <li key={index} className='hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2 mt-2 font-semibold'>
                                <a href={item.link} className='max-w-full text-sm flex items-center gap-2'>{item.icon} {item.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
    )
}

export default MenuSidebar