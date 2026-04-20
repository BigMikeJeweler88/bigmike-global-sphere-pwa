import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'a.espncdn.com',
      'www.instagram.com',
      'cdninstagram.com',
      'scontent.cdninstagram.com',
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}

export default nextConfig
