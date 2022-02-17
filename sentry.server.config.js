// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const {
  SENTRY_DSN,
  SENTRY_RELEASE,
  SENTRY_ENVIRONMENT,
  SENTRY_DEBUG,
  NODE_ENV,
} = process.env

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: SENTRY_ENVIRONMENT,
  release: SENTRY_RELEASE,
  debug: SENTRY_DEBUG === 'true',
  enabled: NODE_ENV === 'production',
})

export { Sentry }
