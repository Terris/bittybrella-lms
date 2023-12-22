/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "striped-buffalo-57.convex.cloud",
      },
    ],
  },
};

module.exports = nextConfig;
