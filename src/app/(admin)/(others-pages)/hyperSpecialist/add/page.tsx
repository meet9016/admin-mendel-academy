import React, { Suspense } from 'react'
import HyperSpecialist from '@/components/hyperSpecialist/HyperSpecialist'

const page = () => {
  return (
     <Suspense fallback={<div>Loading question form...</div>}>
      <HyperSpecialist />
    </Suspense>
  )
}

export default page