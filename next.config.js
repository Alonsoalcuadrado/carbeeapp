/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://url-de-tu-api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
