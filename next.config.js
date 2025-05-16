/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
