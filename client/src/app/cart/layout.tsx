// src/app/cart/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | Jewelry Store',
  description: 'Review and manage the items in your shopping cart'
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
}