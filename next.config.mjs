/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
    ignoreBuildErrors: true,
  },
  api: {
    responseTimeout: 20000, // 20 seconds
  },
};

export default nextConfig;
