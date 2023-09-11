/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://backend.billowing-truth-38ad.workers.dev/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
