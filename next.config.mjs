/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    images: {
        domains: ['img.freepik.com'], // Add external image domains here
  },
    eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
