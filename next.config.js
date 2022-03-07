const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = {
  distDir: 'build/_next',
  target: 'server',
}

const { NODE_ENV, SENTRY_RELEASE } = process.env

const sentryWebpackPluginOptions = {
  dryRun: !(NODE_ENV === 'production'),
  release: SENTRY_RELEASE,
  silent: !(NODE_ENV === 'production'),
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
