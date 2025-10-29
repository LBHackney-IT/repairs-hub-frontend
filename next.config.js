const cspHeader = `
  frame-ancestors 'none';
`

async function headers() {
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

const moduleExports = {
  distDir: 'build/_next',
  productionBrowserSourceMaps: false,
  output: 'standalone',
  swcMinify: true,
  images: {
    domains: ['utfs.io'],
  },
  experimental: {
    forceSwcTransforms: true,
  },
  headers: () => headers(),
}

module.exports = moduleExports
