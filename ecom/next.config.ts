/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'plus.unsplash.com',
      'images.unsplash.com',
      'res.cloudinary.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              img-src 'self' https://plus.unsplash.com https://images.unsplash.com https://res.cloudinary.com https://i.ibb.co http://localhost;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://embed.tawk.to;
              frame-src https://embed.tawk.to;
              connect-src 'self' https://embed.tawk.to;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ];
  }
};

export default nextConfig;
