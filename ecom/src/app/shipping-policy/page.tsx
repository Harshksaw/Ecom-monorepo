// pages/shipping-policy.tsx

import React from 'react';
import Wrapper from '../components/Wrapper';

const ShippingPolicy = () => {
  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Shipping Policy</h1>

        <p className="mb-6">
          At Shri Nanu Gems, we ensure that every piece is crafted with precision and packed with care before it reaches you.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Dispatch Time:</h2>
          <p>
            All orders are processed and dispatched within <strong>7–10 working days</strong> after order confirmation. Since our jewellery is handcrafted, we take this time to ensure top quality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Delivery Time:</h2>
          <p>
            Once dispatched, delivery usually takes <strong>7 -10 working days</strong>, depending on your location and courier service availability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Shipping Charges:</h2>
          <p>
            We offer <strong>free shipping across India</strong>. For international shipping, charges may vary depending on the destination.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Tracking Your Order:</h2>
          <p>
            You will receive a tracking number via <strong>SMS or email</strong> once your order is shipped, so you can follow its journey to your doorstep.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Delays:</h2>
          <p>
            Delays may occur due to unforeseen circumstances, holidays, or logistic issues. We appreciate your patience and will keep you updated in such cases.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
          <p>
            For any shipping-related queries, feel free to contact us at{' '}
            <a href="mailto:shrinanugems111@gmail.com" className="text-blue-600 hover:underline">
              shrinanugems111@gmail.com
            </a>{' '}
            or call us at{' '}
            <a href="tel:+919782441137" className="text-blue-600 hover:underline">
              +91 97824 41137
            </a>.
          </p>
        </section>
      </div>
    </Wrapper>
  );
};

export default ShippingPolicy;
