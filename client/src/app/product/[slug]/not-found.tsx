// src/app/product/[slug]/not-found.tsx
import Link from 'next/link';
import Wrapper from '../../../app/components/Wrapper';

export default function ProductNotFound() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Product Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:opacity-80 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    </Wrapper>
  );
}