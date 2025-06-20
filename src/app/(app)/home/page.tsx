import MenuSidebar from '@/components/MenuSidebar'
import PostBox from '@/components/PostBox'
import TrendingSidebar from '@/components/TrendingSidebar'
import React from 'react'

const page = () => {
  return (
  <div className='container mx-auto'>
    <div className="grid grid-cols-1 md:grid-cols-10 gap-10 max-w-full ">
      <div className="md:col-span-3">
        <MenuSidebar />
      </div>
      <div className="md:col-span-4">
        <PostBox />
      </div>
      <div className='md:col-span-3'>
        <TrendingSidebar />
      </div>
    </div>
  </div>
  )
}

export default page