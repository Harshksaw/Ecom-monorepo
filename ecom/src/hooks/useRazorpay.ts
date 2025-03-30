// src/app/hooks/useRazorpay.ts
'use client';

import { useState, useEffect } from 'react';

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    //@ts-ignore
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Add script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return isLoaded;
};