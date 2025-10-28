import Question from '@/components/question/Question'
import React, { Suspense } from 'react'

const page = () => {
  return (
     <Suspense fallback={<div>Loading question form...</div>}>
      <Question />
    </Suspense>
  )
}

export default page