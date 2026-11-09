import type { NextConfig } from 'next'
import type { Header } from 'next/dist/lib/load-custom-routes'

const cspHeader = `
  frame-ancestors 'none';
`

async function headers(): Promise<Header[]> {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: cspHeader.replace(/\n/g, ''),
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
      ],
    },
  ]
}

const nextConfig: NextConfig = {
  distDir: 'build/_next',
  productionBrowserSourceMaps: false,
  output: 'standalone',
  images: {
    domains: ['utfs.io'],
  },
  headers: () => headers(),
  allowedDevOrigins: ['localdev.hackney.gov.uk'],
}

export default nextConfig
