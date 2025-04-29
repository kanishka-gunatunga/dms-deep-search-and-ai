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
};

export default nextConfig;
