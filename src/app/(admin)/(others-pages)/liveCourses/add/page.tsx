import LiveCourses from '@/components/liveCourses/LiveCourses'
import React, { Suspense } from 'react'

const page = () => {
  return (
     <Suspense fallback={<div>Loading question form...</div>}>
      <LiveCourses />
    </Suspense>
  )
}

export default page