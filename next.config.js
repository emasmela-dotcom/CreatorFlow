/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      // Allow API routes to work without trailing slashes
      // This rewrites /api/route to /api/route/ internally
      {
        source: '/api/:path*',
        destination: '/api/:path*/',
      },
    ]
  },
}

module.exports = nextConfig
