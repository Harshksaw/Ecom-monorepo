// src/app/product/[slug]/loading.tsx
import Wrapper from "../../app/components/Wrapper";

export default function Loading() {
  return (
    <div className="w-full md:py-20">
      <Wrapper>
        <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
          {/* Left column loading skeleton */}
          <div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
            <div className="aspect-square w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Right column loading skeleton */}
          <div className="flex-[1] py-3">
            {/* Title skeleton */}
            <div className="h-9 bg-gray-200 rounded-md w-3/4 mb-4 animate-pulse"></div>
            
            {/* Category skeleton */}
            <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-5 animate-pulse"></div>
            
            {/* Price skeleton */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 bg-gray-200 rounded-md w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-md w-20 animate-pulse"></div>
            </div>
            
            {/* Tax info skeleton */}
            <div className="h-4 bg-gray-200 rounded-md w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-24 mb-20 animate-pulse"></div>
            
            {/* Size selection skeleton */}
            <div className="mb-10">
              <div className="flex justify-between mb-2">
                <div className="h-5 bg-gray-200 rounded-md w-24 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded-md w-24 animate-pulse"></div>
              </div>
              
              {/* Size grid skeleton */}
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Button skeleton */}
            <div className="h-14 bg-gray-300 rounded-full mb-10 animate-pulse"></div>
            
            {/* Description skeleton */}
            <div className="h-6 bg-gray-200 rounded-md w-40 mb-4 animate-pulse"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded-md w-full mb-2 animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Related products skeleton */}
        <div className="mt-[50px] md:mt-[100px] mb-[100px] md:mb-0">
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}