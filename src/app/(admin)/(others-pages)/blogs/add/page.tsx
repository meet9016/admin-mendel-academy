import Blogs from '@/components/blogs/Blogs'
import React, { Suspense } from 'react'

const page = () => {
  return (
     <Suspense fallback={<div>Loading question form...</div>}>
          <Blogs />
        </Suspense>
  )
}

export default page