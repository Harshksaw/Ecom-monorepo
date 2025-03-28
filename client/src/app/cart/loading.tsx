// src/app/cart/loading.tsx
import Wrapper from '../../app/components/Wrapper';

export default function CartLoading() {
  return (
    <Wrapper>
      <div className="py-10">
        <div className="h-8 bg-gray-200 rounded w-60 mb-8 animate-pulse"></div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items */}
          <div className="flex-grow">
            {/* Cart Header */}
            <div className="hidden md:grid grid-cols-5 border-b pb-4 mb-4">
              <div className="col-span-2 h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
            </div>
            
            {/* Cart Items Skeleton */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b pb-6 mb-6">
                {/* Product Image & Name */}
                <div className="col-span-1 md:col-span-2 flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-grow">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Unit Price */}
                <div className="md:text-center flex justify-between md:block">
                  <div className="md:hidden h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 md:mx-auto animate-pulse"></div>
                </div>
                
                {/* Quantity */}
                <div className="md:text-center flex justify-between md:block">
                  <div className="md:hidden h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 md:mx-auto animate-pulse"></div>
                </div>
                
                {/* Subtotal */}
                <div className="md:text-center flex justify-between md:block">
                  <div className="md:hidden h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 md:mx-auto animate-pulse"></div>
                </div>
              </div>
            ))}
            
            {/* Continue Shopping Button */}
            <div className="mt-8">
              <div className="h-5 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-6 animate-pulse"></div>
              
              {/* Summary Details */}
              <div className="space-y-3 border-b pb-4 mb-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="flex justify-between mb-6">
                <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              
              {/* Checkout Button */}
              <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
              
              {/* Payment Methods */}
              <div className="mt-4 h-3 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}