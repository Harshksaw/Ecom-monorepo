'use client';

import React from 'react';
import { FaStar, FaQuoteLeft, FaUser, FaCheck } from 'react-icons/fa';


interface Review {
  _id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

interface CustomerReviewsProps {
  reviews: Review[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  // Don't render if there are no reviews
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Format date to display more nicely
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate a consistent color based on username for the avatar background
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-rose-100 text-rose-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-amber-100 text-amber-600',
      'bg-cyan-100 text-cyan-600',
      'bg-pink-100 text-gray-600',
      'bg-indigo-100 text-indigo-600'
    ];
    
    // Use the sum of character codes to select a consistent color
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Happy Customers</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-indigo-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our customers love the quality and variety of our jewelry and gemstone products. 
            Here's what they have to say:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review) => {
            const avatarColorClass = getAvatarColor(review.userName);
            
            return (
              <div 
                key={review._id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-gray-100"
              >
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${avatarColorClass}`}>
                    <FaUser className="text-lg" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg leading-tight">{review.userName}</h3>
                    <div className="flex text-yellow-400 my-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-200'} w-4 h-4`}
                        />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                        <FaCheck className="mr-1 text-green-500" size={10} />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <FaQuoteLeft className="absolute -top-1 -left-1 text-gray-200 opacity-50" size={16} />
                  <div className="pl-5">
                    <h4 className="font-medium text-gray-800">{review.title}</h4>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                </div>
                
                {/* <div className="mt-auto pt-3 text-right">
                  <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;