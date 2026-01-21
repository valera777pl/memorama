/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.warpcast.com',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
      },
    ],
  },
  // Allow building with external packages
  transpilePackages: ['@coinbase/onchainkit', '@farcaster/miniapp-sdk'],
};

export default nextConfig;
