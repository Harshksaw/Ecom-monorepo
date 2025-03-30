// src/app/utils/razorpay.ts

// This utility ensures Razorpay is properly loaded before trying to use it
export const loadRazorpay = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Check if Razorpay is already loaded
      if ((window as any).Razorpay) {
        return resolve((window as any).Razorpay);
      }
  
      // If not, check if the script is already in progress of loading
      const existingScript = document.getElementById('razorpay-script');
      if (existingScript) {
        // Wait for the script to load
        existingScript.addEventListener('load', () => {
          if ((window as any).Razorpay) {
            resolve((window as any).Razorpay);
          } else {
            reject(new Error('Razorpay script loaded but Razorpay is not available'));
          }
        });
        existingScript.addEventListener('error', () => {
          reject(new Error('Error loading Razorpay script'));
        });
        return;
      }
  
      // If script is not loaded at all, create and append it
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.addEventListener('load', () => {
        if ((window as any).Razorpay) {
          resolve((window as any).Razorpay);
        } else {
          reject(new Error('Razorpay script loaded but Razorpay is not available'));
        }
      });
      
      script.addEventListener('error', () => {
        reject(new Error('Error loading Razorpay script'));
      });
  
      document.body.appendChild(script);
    });
  };