// src/app/utils/razorpay.ts

/**
 * Utility to ensure Razorpay is properly loaded before using it
 * This handles dynamic loading if the script is not already present
 */
export const loadRazorpay = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if ((window as any).Razorpay) {
      return resolve((window as any).Razorpay);
    }

    // Check if the script is already in progress of loading
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

    // Add script to document body
    document.body.appendChild(script);
  });
};

/**
 * Create and open a Razorpay payment instance
 * @param options Razorpay payment options
 * @returns Promise resolving with payment result
 */
export const initiateRazorpayPayment = async (options: any): Promise<any> => {
  try {
    // Load Razorpay if not already loaded
    const Razorpay = await loadRazorpay();
    
    // Return a promise that resolves when payment is completed
    return new Promise((resolve, reject) => {
      // Create Razorpay instance with options
      const razorpayInstance = new Razorpay({
        ...options,
        // Override the handler to capture response for our promise
        handler: function(response: any) {
          // Call the original handler if provided
          if (typeof options.handler === 'function') {
            options.handler(response);
          }
          
          // Resolve the promise with payment response
          resolve(response);
        },
        // Add modal closed handler to reject promise on cancel
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          },
          ...options.modal
        }
      });
      
      // Open Razorpay checkout
      razorpayInstance.open();
      
      // Attach to window for debugging purposes
      (window as any).razorpayInstance = razorpayInstance;
    });
  } catch (error) {
    console.error('Failed to initiate Razorpay payment:', error);
    throw error;
  }
};