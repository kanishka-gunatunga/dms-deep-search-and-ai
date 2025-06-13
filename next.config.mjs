/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'sites.techvoice.lk', 'dms.genaitech.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sites.techvoice.lk',
        pathname: '/dms-backend/public/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'dms.genaitech.dev',
        pathname: '/dms-backend/uploads/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)', // apply to all routes
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:;",
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
