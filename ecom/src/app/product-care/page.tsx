// src/app/product-care/page.tsx
import React from 'react';
import Wrapper from '../components/Wrapper';

const ProductCarePage: React.FC = () => {
  return (
    <Wrapper>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Product Care</h1>
        <p className="mb-6">
          Every piece from Shri Nanu Gems is crafted with care, and with the right attention, it can shine for years to come. Follow these simple care tips to maintain the beauty and quality of your jewellery:
        </p>
        <ol className="list-decimal list-inside space-y-4 text-gray-700">
          <li>
            <strong>Store with Care</strong><br />
            Keep your jewellery in a soft pouch or separate box to avoid scratches and tangling. Storing items separately also protects delicate gemstones and metal finishes.
          </li>
          <li>
            <strong>Gentle Cleaning</strong><br />
            Wipe your jewellery with a soft, dry cloth after every use to remove dust and skin oils. For a deeper clean, use lukewarm water with mild soap and a soft brush. Make sure to dry it completely before storing.
          </li>
          <li>
            <strong>Handle Carefully</strong><br />
            Jewellery is delicate by nature. Avoid dropping or pulling it roughly. When wearing or removing, do so gently to protect its shape and setting.
          </li>
          <li>
            <strong>Regular Checkups</strong><br />
            If your jewellery includes gemstones, check the setting once in a while. Loose stones or clasps should be brought to a professional for repair.
          </li>
        </ol>
        <p className="mt-6 text-gray-800">
          At Shri Nanu Gems, we believe in lasting beauty. If you ever need help with cleaning, polishing, or repair, our team is just a message away.
        </p>
      </div>
    </Wrapper>
  );
};

export default ProductCarePage;
