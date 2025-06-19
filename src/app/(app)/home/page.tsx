import MenuSidebar from '@/components/MenuSidebar'
import PostBox from '@/components/PostBox'
import React from 'react'

const page = () => {
  return (
    <div className='flex max-w-full gap-6'>
      <div className='flex-shrink-0 min-w-sm'>
        <MenuSidebar />
      </div>
      <div className='flex-shrink-0 min-w-xl'>
        <PostBox />
      </div>
    </div>
  )
}

export default page