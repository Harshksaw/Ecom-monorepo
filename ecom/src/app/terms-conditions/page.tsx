// pages/terms-and-conditions.tsx


import React from 'react';
import Wrapper from '../components/Wrapper';



const TermsAndConditions = () => {
  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>

        <p className="mb-6">
          Welcome to Shri Nanu Gems. By using our website and placing an order, you agree to the following terms and conditions:
        </p>

        <ol className="list-decimal list-inside space-y-6">
          <li>
            <strong>Product Information</strong><br />
            We make every effort to display our products as accurately as possible. However, slight variations in color, design, or size may occur due to screen differences or the handcrafted nature of our jewellery.
          </li>

          <li>
            <strong>Pricing & Payment</strong><br />
            We reserve the right to change prices at any time. Payments must be made in full before your order can be processed.
          </li>

          <li>
            <strong>Order Confirmation</strong><br />
            Once you place an order, you will receive a confirmation email or SMS. Orders cannot be cancelled after 24 hours of placement as production may begin.
          </li>

          <li>
            <strong>Shipping & Delivery</strong><br />
            Orders are dispatched within 7–10 working days and delivered within 10–15 working days. Delivery timelines may vary based on location and unforeseen delays.
          </li>

          <li>
            <strong>Returns</strong><br />
            Due to the customized and handcrafted nature of our jewellery, we do not offer returns.
          </li>

          <li>
            <strong>Intellectual Property</strong><br />
            All content, including images, designs, logos, and text on this website, is the property of Shri Nanu Gems. Unauthorized use or reproduction is strictly prohibited.
          </li>

          <li>
            <strong>Privacy</strong><br />
            We respect your privacy. Please refer to our{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> for more details on how we handle your data.
          </li>

          <li>
            <strong>Contact Us</strong><br />
            For any questions, feel free to reach out to us at:<br />
            Email: <a href="mailto:shrinanugems111@gmail.com" className="text-blue-600 hover:underline">shrinanugems111@gmail.com</a><br />
            Phone: <a href="tel:+919782441137" className="text-blue-600 hover:underline">+91 97824 41137</a>
          </li>
        </ol>

        <p className="mt-8">
          By using our website, you agree to follow these terms. We may update them from time to time, so please check this page periodically.
        </p>
      </div>
    </Wrapper>
  );
};

export default TermsAndConditions;
