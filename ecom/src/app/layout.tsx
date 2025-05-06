import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Providers } from './store/provider'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/authcontext'
import Script from 'next/script'
import { CategoryService } from './lib/api'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shri Nanu Gems | Authentic Gemstones',
  description: 'Shri Nanu Gems offers authentic, certified gemstones crafted with premium quality. Discover timeless jewelry and stunning gemstones that elevate your elegance. Shop our exclusive collection today and experience true brilliance',
  metadataBase: new URL('https://shrinanugems.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Shri Nanu Gems | Authentic Gemstones',
    description:  'Shri Nanu Gems offers authentic, certified gemstones crafted with premium quality. Discover timeless jewelry and stunning gemstones that elevate your elegance. Shop our exclusive collection today and experience true brilliance',
    url: 'https://shrinanugems.com',
    siteName: 'Shri Nanu Gems',
    images: [
      {
        url: 'https://res.cloudinary.com/dbnnlqq5v/image/upload/v1746508540/jewelry-ecommerce/r1l9wkcblfmjacphpfdi.png', // <-- Your real image link (replace)
        width: 1200,
        height: 630,
        alt: 'Shri Nanu Gems Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shri Nanu Gems | Authentic Gemstones',
    description: 'Shri Nanu Gems offers authentic, certified gemstones crafted with premium quality.',
    images: ['https://res.cloudinary.com/dbnnlqq5v/image/upload/v1746508540/jewelry-ecommerce/r1l9wkcblfmjacphpfdi.png'], // <-- Same image for Twitter
  },
};


// Server component function to fetch categories
async function fetchCategories() {
  try {
    const res = await CategoryService.getAllCategories();
    // @ts-ignore
    return res.categories || [];
  } catch (e) {
    console.error('Error fetching categories', e);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch categories at the server level
  const categories = await fetchCategories();
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header categories={categories} />
              <main className="">{children}</main>

              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                    maxWidth: '500px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#4CAF50',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#F44336',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              <Footer categories={categories} />
            </div>
          </AuthProvider>
        </Providers>

        {/* Tawk.to Script */}
        <Script
          id="tawk-to-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API = Tawk_API || {};
              // as soon as it loads, hide the widget
              Tawk_API.onLoad = function() {
                Tawk_API.minimize(); // Ensures chat window is not open
              };

              (function(){
                var s1 = document.createElement("script"),
                    s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = 'https://embed.tawk.to/6801d026c31dfa190da6b641/1ip3ha67o';
                s1.charset = 'UTF-8';
                s1.setAttribute('crossorigin', '*');
                s0.parentNode.insertBefore(s1, s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
