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
// import { SpeedInsights } from '@vercel/speed-insights/next';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shri Nanu Gems |Jewellery and Gemstone',
  description: 'Shri Nanu Gems offers Jewellery and Gemstone, certified gemstones crafted with premium quality. Discover timeless jewelry and stunning gemstones that elevate your elegance. Shop our exclusive collection today and experience true brilliance',
  metadataBase: new URL('https://shrinanugems.com'),
  alternates: {
    canonical: '/',
  },

  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png', sizes: 'any' }
    ],
    other: [
      {
        rel: 'logo',
        url: 'https://res.cloudinary.com/dbnnlqq5v/image/upload/v1746508540/jewelry-ecommerce/r1l9wkcblfmjacphpfdi.png',
        type: 'image/png'
      }
    ]
  },

   openGraph: {
    title: 'Shri Nanu Gems | Jewellery and Gemstone',
    description:  'Shri Nanu Gems offers Jewellery and Gemstone, certified gemstones crafted with premium quality. Discover timeless jewelry and stunning gemstones that elevate your elegance. Shop our exclusive collection today and experience true brilliance',
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
    title: 'Shri Nanu Gems | Jewellery and Gemstone',
    description: 'Shri Nanu Gems offers Jewellery and Gemstone, certified gemstones crafted with premium quality.',
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
      <head>
        <title>Shri Nanu Gems | Jewellery and Gemstone</title>
        <meta name="description" content="Shri Nanu Gems offers Jewellery and Gemstone, certified gemstones crafted with premium quality. Discover timeless jewelry and stunning gemstones that elevate your elegance." />
         <link rel="icon" href="/favicon.ico" />
 <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon.svg"
      />

      {/* Fallback ICO: */}
      <link
        rel="shortcut icon"
        href="/favicon.ico"
      />

      {/* PNGs at specific sizes: */}
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Shri Nanu Gems",
              "url": "https://shrinanugems.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://res.cloudinary.com/dbnnlqq5v/image/upload/v1746508540/jewelry-ecommerce/r1l9wkcblfmjacphpfdi.png",
                "width": "512",
                "height": "512"
              },
              "image": {
                "@type": "ImageObject",
                "url": "https://res.cloudinary.com/dbnnlqq5v/image/upload/v1746508540/jewelry-ecommerce/r1l9wkcblfmjacphpfdi.png",
                "width": "512",
                "height": "512"
              },
              "description": "Shri Nanu Gems offers Jewellery and Gemstone, certified gemstones crafted with premium quality. Discover timeless jewelry and stunning gemstones that elevate your elegance.",
              "sameAs": [
                "https://www.facebook.com/shrinanugems",
                "https://www.instagram.com/shrinanugems"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              }
            })
          }}
        />
      </head>
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

        <Script
        id="tawk-to-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6836b1010f6bcf190fc272ab/1isaq6rm0';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      />
      </body>
    </html>
  )
}
