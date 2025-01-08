/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'https://127.0.0.1:5328/:path*'
            : '/api/',
      },
    ]
  },
}

module.exports = nextConfig
