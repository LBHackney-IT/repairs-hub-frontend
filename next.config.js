const { withSentryConfig } = require('@sentry/nextjs')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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
  swcMinify: true,
  // target: 'serverless',
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    domains: ['utfs.io'],
  },
  headers: () => headers(),
}

const { NODE_ENV, SENTRY_RELEASE } = process.env

const sentryWebpackPluginOptions = {
  dryRun: !(NODE_ENV === 'production'),
  release: SENTRY_RELEASE,
  silent: !(NODE_ENV === 'production'),
}

module.exports = withBundleAnalyzer(
  withSentryConfig(moduleExports, sentryWebpackPluginOptions)
)
