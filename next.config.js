/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    NFT_ADDRESS: process.env.NFT_ADDRESS,
    NFT_MARKETPLACE_ADDRESS: process.env.NFT_MARKETPLACE_ADDRESS,
  },
};

module.exports = nextConfig;
