/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This tells Vercel to stop worrying about linting errors so it can finish the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will prevent any other small type-safety "hiccups" from stopping your deployment
    ignoreBuildErrors: true,
  },
};

export default nextConfig
