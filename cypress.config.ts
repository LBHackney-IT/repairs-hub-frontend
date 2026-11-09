import { defineConfig } from 'cypress'
import dotenvFlowPlugin from 'cypress-dotenv-flow'
import { signSessionCookieForRole } from './cypress/plugins/sessionCookie'
import type { E2eRole } from './cypress/plugins/sessionCookie'

export default defineConfig({
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress-reporter-config.json',
  },
  e2e: {
    setupNodeEvents(on, config) {
      let testTitle

      on('task', {
        getTestTitle(message) {
          testTitle = message

          return null
        },
        signSessionCookie: (role: E2eRole) => signSessionCookieForRole(role),
      })

      config = dotenvFlowPlugin(config)

      // Next unescapes `\$` to `$` when it reads the env files, but dotenv-flow
      // keeps the backslash, so these regexes would never match a group name
      for (const name of [
        'AGENTS_GOOGLE_GROUPNAME_REGEX',
        'CONTRACTORS_GOOGLE_GROUPNAME_REGEX',
      ]) {
        if (process.env[name]) {
          process.env[name] = process.env[name].replace(/\\\$/g, '$')
        }
      }

      return config
    },
    baseUrl: 'http://localhost:5001/',
    defaultCommandTimeout: 10000,
    video: false,
    viewportHeight: 1536,
    viewportWidth: 960,
  },
})
