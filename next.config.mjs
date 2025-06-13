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
        ],
      },
    ];
  },
};

export default nextConfig;
