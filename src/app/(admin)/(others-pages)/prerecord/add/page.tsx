import Prerecorded from '@/components/preRecorded/Prerecorded'
import React, { Suspense } from 'react'

const page = () => {
  return (
     <Suspense fallback={<div>Loading question form...</div>}>
      <Prerecorded />
    </Suspense>
  )
}

export default page