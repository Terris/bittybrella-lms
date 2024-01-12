/** @type {import('next').NextConfig} */
const nextConfig = {
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
