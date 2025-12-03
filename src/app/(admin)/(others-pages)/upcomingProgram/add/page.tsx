
import UpcomingPrograms from '@/components/upcomingPrograms/UpcomingPrograms'
import React, { Suspense } from 'react'

const page = () => {
  return (
     <Suspense fallback={<div>Loading question form...</div>}>
      <UpcomingPrograms />
    </Suspense>
  )
}

export default page