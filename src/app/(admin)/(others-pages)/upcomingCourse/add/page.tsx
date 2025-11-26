import UpcomingCourse from '@/components/upcomingCourse/UpcomingCourse'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <Suspense fallback={<div>Loading question form...</div>}>
            <UpcomingCourse />
        </Suspense>
    )
}

export default page