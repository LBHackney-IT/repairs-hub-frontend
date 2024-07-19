const { withSentryConfig } = require('@sentry/nextjs')

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
  target: 'server',
  experimental: {
    forceSwcTransforms: true,
  },
  headers: () => headers(),
  async rewrites() {
    return [
      {
        source: '/api/yeet/:path*',
        destination:
          'https://repairs-api-images-development.s3.eu-west-2.amazonaws.com/:path*',
      },
    ]
  },
}

const { NODE_ENV, SENTRY_RELEASE } = process.env

const sentryWebpackPluginOptions = {
  dryRun: !(NODE_ENV === 'production'),
  release: SENTRY_RELEASE,
  silent: !(NODE_ENV === 'production'),
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
