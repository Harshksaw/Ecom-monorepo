
'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Providers } from './store/provider'


import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/authcontext'


import Script from 'next/script'
import React, { useEffect } from 'react'
import { CategoryService } from './lib/api'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shri Nanu Gems | Authentic Gemstones',
  description: 'Shri Nanu Gems offers authentic, high-quality gemstones sourced ethically. Explore our collection now!',
  metadataBase: new URL('https://shrinanugems.com'),
  alternates: {
    canonical: '/',
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [categories, setCategories] = React.useState<any[]>([]);


    useEffect(() => {
      (async () => {
        try {
          const res = await CategoryService.getAllCategories();
          //@ts-ignore
          setCategories(res.categories);
        } catch (e) {
          console.error('Error fetching categories', e);
        }
      })();
    }, []);
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

        {/* ✅ Tawk.to Script added correctly */}
  {/* ✅ Tawk.to Script added, but hidden on load */}
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
