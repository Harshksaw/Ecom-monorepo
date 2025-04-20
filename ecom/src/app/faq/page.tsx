

import React from 'react';

import Wrapper from '../components/Wrapper';



const FAQPage = () => {
  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions (FAQ)</h1>
        <p className="text-center mb-10 text-sm text-gray-600">
          Addressing your inquiries about our jewelry and gemstone offerings
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-pink-800">1. What types of jewelry do you sell?</h2>
            <p className="text-gray-700 mt-1">
              We offer a wide range of jewelry including readymade collections and customized pieces, catering to various tastes and preferences.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-pink-800">2. Where is your store located?</h2>
            <p className="text-gray-700 mt-1">
              You can find us at Nathmal Ji Ka Chowk, conveniently situated for all your jewelry needs.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-pink-800">3. What are your working hours?</h2>
            <p className="text-gray-700 mt-1">
              Our store is open from 10 AM to 7 PM, making it easy for you to visit.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-pink-800">4. Can I contact you for inquiries?</h2>
            <p className="text-gray-700 mt-1">
              Absolutely! Feel free to call us at{' '}
              <a href="tel:+919782441137" className="text-pink-700 hover:underline">+91 97824 41137</a>{' '}
              or email us at{' '}
              <a href="mailto:shrinanugems111@gmail.com" className="text-pink-700 hover:underline">
                shrinanugems111@gmail.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-pink-800">5. Do you offer gemstone services?</h2>
            <p className="text-gray-700 mt-1">
              Yes, we provide a variety of gemstones along with expert advice for selection and care.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-pink-800">6. Is customization available for jewelry orders?</h2>
            <p className="text-gray-700 mt-1">
              Yes! We specialize in creating customized jewelry to meet your unique design preferences.
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default FAQPage;
