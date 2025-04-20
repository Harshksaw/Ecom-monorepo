
import React from 'react';
import Wrapper from '../components/Wrapper';



export default function PrivacyPolicyPage() {
  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-gray-500 max-w-none">
          <p>
            At Shri Nanu Gems, we value your privacy and are committed to protecting your personal information. 
            This Privacy Policy outlines how we collect, use, and safeguard your data.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>When you visit our website, place an order, or contact us, we may collect:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Your name, contact number, email address, and shipping details</li>
            <li>Payment and billing information (securely processed via trusted gateways)</li>
            <li>Browsing data like IP address, device info, and site usage</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Process your orders and deliver products</li>
            <li>Provide customer support</li>
            <li>Send order updates and promotional offers (only with your consent)</li>
            <li>Improve our website and services</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Protection</h2>
          <p>
            Your personal data is stored securely. We do not sell, rent, or share your information with third parties, 
            except as needed to complete transactions (like payment or delivery partners).
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies</h2>
          <p>
            We may use cookies to enhance your browsing experience. You can modify your browser settings to disable cookies if you prefer.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
          <p>
            You can contact us anytime to update, correct, or delete your personal information from our records.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
          <p>For any privacy-related questions, feel free to reach us at:</p>
          <p className="mt-2">
            <strong>Email:</strong> <a href="mailto:shrinanugems111@gmail.com" className="text-indigo-600 hover:text-indigo-500">
              shrinanugems111@gmail.com
            </a>
          </p>
          <p className="mt-1">
            <strong>Phone:</strong> <a href="tel:+919782441137" className="text-indigo-600 hover:text-indigo-500">
              +91 9782441137
            </a>
          </p>
          
          <p className="mt-8 italic">
            We may update this policy from time to time. Please check this page periodically for the latest version.
          </p>
        </div>
      </div>
    </Wrapper>
  );
}