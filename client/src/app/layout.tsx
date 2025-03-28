import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Import providers
import { Providers } from './store/provider'

// Import components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/authcontext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Online Shoe Store',
  description: 'Shop the latest collection of designer shoes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>

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

            <Footer />
          </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}