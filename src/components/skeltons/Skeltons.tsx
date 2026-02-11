import ComponentCard from "../common/ComponentCard";

export const UpcomingProgramsSkeleton = () => {
    return (
        <div className="space-y-6">
            <ComponentCard
                title=""
                name=""
            >
                <div className="space-y-6">
                    {/* First Row - Title and Waitlist Count */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        <div>
                            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </div>
                    </div>

                    {/* Second Row - Date and Course Types */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        <div>
                            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </div>
                    </div>

                    {/* Third Row - Description and Image Upload */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-[320px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
                        </div>

                        <div>
                            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-[320px] w-full bg-gray-200 animate-pulse rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-full mb-3"></div>
                                <div className="h-4 w-40 bg-gray-300 animate-pulse rounded mb-1"></div>
                                <div className="h-3 w-32 bg-gray-300 animate-pulse rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex items-center gap-5 mt-6">
                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </ComponentCard>
        </div>
    );
}

export const SkeletonLoader = () => (
    <div className="space-y-6">
        <ComponentCard title="Add T&C" name="">
            {/* Title skeleton */}
            <div className="mb-6">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-32 mb-2"></div>
                <div className="h-10 bg-gray-100 animate-pulse rounded-lg"></div>
            </div>

            {/* Editor skeleton */}
            <div className="mb-6">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mb-2"></div>
                <div className="h-[420px] bg-gray-100 animate-pulse rounded-lg"></div>
            </div>

            {/* Button skeleton */}
            <div className="flex items-center gap-5">
                <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-24"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-24"></div>
            </div>
        </ComponentCard>
    </div>
);

export const QuestionSkeleton = () => {
  return (
    <div className="space-y-6">
      <ComponentCard 
        title=""
        name=""
      >
        <div className="space-y-6">
          {/* Form Fields Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
            
            {/* MultiSelect Skeleton */}
            <div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="mt-1 flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Description Editor Skeleton */}
          <div>
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-[320px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex items-center gap-5">
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export const PrerecordedSkeleton = ({ isEditMode = false }: { isEditMode?: boolean }) => {
  return (
    <div className="space-y-6">
      <ComponentCard 
        title=""
        name=""
      >
        <div className="space-y-6">
          {/* Basic Info Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>

          {/* Duration and Date Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Radio Buttons Skeleton */}
          <div className="flex flex-wrap items-center gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>

          {/* Description Editor Skeleton */}
          <div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-[320px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          {/* Options Section Skeleton */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="mb-6">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Options Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                  {/* Option Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </div>

                  {/* Price Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[...Array(2)].map((_, j) => (
                      <div key={j}>
                        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>

                  {/* Features */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-md"></div>
                    </div>
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="relative mb-2">
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        {j === 1 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 animate-pulse rounded-md"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Checkbox */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons Skeleton */}
          <div className="flex items-center gap-5 mt-6">
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export function MedicalExamSkeleton() {
  return (
    <div className="space-y-6">
      {/* Main Form Card Skeleton */}
      <ComponentCard 
        title={
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
        } 
        name=""
      >
        {/* Category + Exam Name + Status Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div>
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex flex-wrap items-center gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Country + Title Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div>
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Exam Steps Skeleton */}
        <div className="mt-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="relative">
                <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                {i === 1 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 animate-pulse rounded-md"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Description + Image Skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-[320px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
          <div>
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-[320px] w-full bg-gray-200 animate-pulse rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-full mb-3"></div>
              <div className="h-4 w-40 bg-gray-300 animate-pulse rounded mb-1"></div>
              <div className="h-3 w-32 bg-gray-300 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Enroll Section Skeleton */}
      <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-4">
            <div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div>
              <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-40 w-full bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
          <div>
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-[200px] w-full bg-gray-200 animate-pulse rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-full mb-3"></div>
              <div className="h-4 w-40 bg-gray-300 animate-pulse rounded mb-1"></div>
              <div className="h-3 w-32 bg-gray-300 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section Skeleton */}
      <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, planIndex) => (
            <div key={planIndex} className="border border-gray-200 rounded-lg p-4 relative">
              <div className="space-y-4">
                {/* Plan Header */}
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                
                {/* Price Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
                
                {/* Plan Month and Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div>
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                
                {/* Subtitles */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-md"></div>
                  </div>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="mb-2">
                      <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Remove Button */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Rapid Learning Tools Section Skeleton */}
      <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, toolIndex) => (
            <div key={toolIndex} className="border border-gray-200 rounded-lg p-4 relative">
              <div className="space-y-4">
                {/* Tool Type */}
                <div>
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
                
                {/* Price Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Remove Button */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center gap-5">
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
}

export function LiveCoursesSkeleton() {
  return (
    <>
      <div className="space-y-6">
        {/* Main Form Card Skeleton */}
        <ComponentCard 
          title=""
          name=""
        >
          <div className="space-y-6">
            {/* First Row - Title, Instructor Name, Qualification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>

            {/* Second Row - Duration, Zoom Link, Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>

            {/* Tags Section Skeleton */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-md"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="relative">
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                    {i === 1 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 animate-pulse rounded-md"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Status and Sold Out Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="flex flex-wrap items-center gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full"></div>
                      <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Modules Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {[...Array(3)].map((_, moduleIndex) => (
          <div key={moduleIndex} className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            {/* Module Header */}
            <div className="mb-6">
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
            </div>
            
            <div className="space-y-6">
              {/* Module Number, Name, Title */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>

              {/* Most Popular Checkbox */}
              <div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>

              {/* Sub Titles Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
                
                {[...Array(2)].map((_, subIndex) => (
                  <div key={subIndex} className="relative mb-4">
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded pr-10"></div>
                    {subIndex === 1 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-300 animate-pulse rounded-md"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center gap-5 mt-5">
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </>
  );
}

export function HyperSpecialistSkeleton() {
    return (
        <>
            <div className="space-y-6">
                <ComponentCard 
                    title=""
                    name=""
                >
                    <div className="space-y-6">
                        {/* Title, Description, Price Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Title Field Skeleton */}
                            <div>
                                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
                                <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            
                            {/* Description Field Skeleton */}
                            <div>
                                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
                                <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            
                            {/* Price Fields Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* USD Price Skeleton */}
                                <div>
                                    <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                                </div>
                                
                                {/* INR Price Skeleton */}
                                <div>
                                    <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Tags Section Skeleton */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-md"></div>
                            </div>

                            {/* Tags Inputs Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="relative">
                                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                                        {/* Remove Button Skeleton (only for second tag) */}
                                        {i === 1 && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 animate-pulse rounded-md"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ComponentCard>
            </div>
            
            {/* Action Buttons Skeleton */}
            <div className="flex items-center gap-5 mt-5">
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
        </>
    );
}

export function FaqSkeleton() {
    return (
        <div className="space-y-6">
            <ComponentCard 
                title=""
                name=""
            >
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* Title Field Skeleton */}
                    <div>
                        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                    </div>

                    {/* Editor Skeleton */}
                    <div>
                        <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
                        <div className="h-[320px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex items-center gap-5 mt-6">
                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
            </ComponentCard>
        </div>
    );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full space-y-2">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
      
      {/* Chart Area Skeleton */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <div className="h-[310px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function MonthlyTargetSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        {/* Header Skeleton */}
        <div className="flex justify-between mb-8">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
        </div>

        {/* Chart Area Skeleton - 180 degree radial bar */}
        <div className="relative">
          <div className="max-h-[330px] flex items-center justify-center">
            <div className="h-[140px] w-[280px] overflow-hidden relative">
              {/* Outer semi-circle - track */}
              <div className="h-[140px] w-[280px] bg-gray-200 animate-pulse rounded-tl-[140px] rounded-tr-[140px] border-t border-l border-r border-gray-300">
                {/* Inner semi-circle - hollow area */}
                <div className="absolute inset-0 m-auto h-[112px] w-[224px] bg-white dark:bg-gray-900 rounded-tl-[112px] rounded-tr-[112px] border-t border-l border-r border-gray-300"></div>
              </div>
            </div>
          </div>
          
          {/* Percentage text in center skeleton */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-12 w-24 bg-gray-300 animate-pulse rounded"></div>
          </div>
          
          {/* Percentage badge skeleton */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%]">
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>

        {/* Description text skeleton */}
        <div className="mx-auto mt-10 w-full max-w-[380px] space-y-2">
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Stats section skeleton with dividers */}
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div className="flex flex-col items-center">
          <div className="mb-1 h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        
        <div className="flex flex-col items-center">
          <div className="mb-1 h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>
        
        <div className="flex flex-col items-center">
          <div className="mb-1 h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function MonthlySalesChartSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
      </div>

      {/* Chart Area Skeleton - Bar Chart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {/* X-axis labels skeleton */}
          <div className="flex justify-between mb-2 px-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-3 w-6 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>

          {/* Chart bars skeleton */}
          <div className="h-[140px] w-full relative">
            {/* Grid lines skeleton */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px w-full bg-gray-200"></div>
              ))}
            </div>

            {/* Bars skeleton */}
            <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between px-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 bg-gray-300 animate-pulse rounded-t"
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    animationDelay: `${i * 0.05}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Y-axis labels skeleton */}
          <div className="h-4 w-16 mt-2 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function EcommerceMetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers Card Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Icon Skeleton - Exact same size as GroupIcon container */}
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            {/* Label - "Customers" exact width */}
            <div className="h-4 w-[90px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            {/* Value - "3,782" exact width */}
            <div className="h-8 w-[60px] mt-2 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
          </div>
          {/* Badge - "11.01%" exact width */}
          <div className="h-7 w-[85px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
        </div>
      </div>

      {/* Orders Card Skeleton */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Icon Skeleton - Exact same size as BoxIconLine container */}
        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            {/* Label - "Orders" exact width */}
            <div className="h-4 w-[70px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            {/* Value - "5,359" exact width */}
            <div className="h-8 w-[60px] mt-2 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
          </div>
          {/* Badge - "9.05%" exact width */}
          <div className="h-7 w-[85px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function BlogsSkeleton() {
  return (
    <div className="space-y-6">
      <ComponentCard 
        title=""
        name=""
      >
        <div className="space-y-6">
          {/* First Row - Exam Name and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div>
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Second Row - Date and Short Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div>
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Radio Buttons */}
          <div className="flex flex-wrap items-center gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>

          {/* Editor Skeleton */}
          <div>
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-[320px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          {/* Dropzone Skeleton */}
          <div>
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-64 w-full bg-gray-200 animate-pulse rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-full mb-3"></div>
              <div className="h-4 w-40 bg-gray-300 animate-pulse rounded mb-1"></div>
              <div className="h-3 w-32 bg-gray-300 animate-pulse rounded"></div>
              <div className="mt-4 h-10 w-32 bg-gray-300 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex items-center gap-5">
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export function UpcomingProgramSkeleton() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Upcoming Program"
        Plusicon={
          <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
        }
        name="Add Prerecord"
        onAddProductClick="/upcomingProgram/add"
      >
        {/* Table Skeleton */}
        <div className="card p-4">
          {/* Table Header Skeleton */}
          <div className="flex items-center py-3 border-b">
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded mr-3"></div>
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`h-6 bg-gray-200 animate-pulse rounded mr-4 ${
                  i === 0 ? "w-32" : 
                  i === 1 ? "w-48" : 
                  i === 2 ? "w-40" : 
                  i === 3 ? "w-40" : 
                  "w-36"
                }`}
              ></div>
            ))}
          </div>
          
          {/* Table Rows Skeleton */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center py-4 border-b">
              {/* Checkbox Skeleton */}
              <div className="w-5 h-5 bg-gray-200 animate-pulse rounded mr-4"></div>
              
              {/* Data Cells Skeleton */}
              <div className="flex-1 grid grid-cols-5 gap-4">
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              </div>
              
              {/* Action Buttons Skeleton */}
              <div className="flex items-center gap-2 ml-4">
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            </div>
          ))}
          
          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export function TreeTableSkeleton() {
  return (
    <div className="card p-4">
      {/* Table Header Skeleton */}
      <div className="flex items-center py-3 border-b">
        <div className="w-8 h-8 bg-gray-200 animate-pulse rounded mr-3"></div>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-6 bg-gray-200 animate-pulse rounded mr-4 ${i === 0 ? "w-32" :
                i === 1 ? "w-40" :
                  i === 2 ? "w-24" :
                    "w-28"
              }`}
          ></div>
        ))}
      </div>

      {/* Table Rows Skeleton with Expand/Collapse Icons */}
      {Array.from({ length: 7 }).map((_, rowIndex) => (
        <div key={rowIndex}>
          {/* Parent Row Skeleton */}
          <div className="flex items-center py-4 border-b">
            {/* Expand/Collapse Icon Skeleton */}
            <div className="w-5 h-5 bg-gray-200 animate-pulse rounded mr-3"></div>

            {/* Checkbox Skeleton */}
            <div className="w-5 h-5 bg-gray-200 animate-pulse rounded mr-3"></div>

            {/* Data Cells Skeleton */}
            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex items-center gap-2 ml-4">
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CartListSkeleton() {
    return (
        <div className="space-y-6">
            <ComponentCard
                title={
                    <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                }
            >
                <div className="card p-4">
                    {/* Table Header Skeleton */}
                    <div className="flex items-center py-3 border-b">
                        {["Category Name", "Duration", "Price", "Quantity", "Created At"].map((header, i) => (
                            <div
                                key={i}
                                className={`h-6 bg-gray-200 animate-pulse rounded mr-4 ${i === 0 ? "w-40" :
                                    i === 1 ? "w-32" :
                                        i === 2 ? "w-24" :
                                            i === 3 ? "w-32" :
                                                "w-36"
                                    }`}
                            ></div>
                        ))}
                    </div>

                    {/* Table Rows Skeleton */}
                    {Array.from({ length: 8 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="flex items-center py-4 border-b">
                            {/* Data Cells Skeleton */}
                            <div className="flex-1 grid grid-cols-5 gap-4">
                                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination Skeleton */}
                    <div className="flex items-center justify-center mt-4 pt-4 border-t gap-4">
                        <div className="flex items-center gap-2">
                            {[...Array(9)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 bg-gray-200 animate-pulse rounded"
                                />
                            ))}
                        </div>

                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                    </div>

                </div>
            </ComponentCard>
        </div>
    );
}

export function DemoPageSkeleton() {
  return (
    <div className="space-y-6">
      <ComponentCard
        title="Medical Exam"
        Plusicon={
          <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
        }
        name="Add Exam"
        onAddProductClick="/medicalexamlist/add"
      >
        <TreeTableSkeleton />
      </ComponentCard>
    </div>
  );
}
