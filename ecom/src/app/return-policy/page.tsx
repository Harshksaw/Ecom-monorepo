
import React from 'react';

import Wrapper from '../components/Wrapper';



const ReturnPolicy = () => {
  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Return Policy</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Order Cancellations:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              In the event you cancel your order <strong>after we have started making your jewellery but before it has shipped</strong>, a <strong>restocking fee of 20%</strong> will be charged.
            </li>
            <li>
              To cancel an order, you must contact Shri Nanu Gems Customer Service to obtain a <strong>Return Authorization Number (RA#)</strong> or call us at <a href="tel:+919782441137" className="text-blue-600 hover:underline">+91 97824 41137</a>.
            </li>
            <li>
              Once an item has shipped, <strong>the order cannot be cancelled.</strong>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">No Returns After Shipment</h2>
          <p>
            Please note that due to the custom nature of our products, <strong>returns are not accepted once the item has been shipped.</strong>
          </p>
        </section>
      </div>
    </Wrapper>
  );
};

export default ReturnPolicy;
