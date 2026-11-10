import { defineConfig } from 'cypress'
import dotenvFlowPlugin from 'cypress-dotenv-flow'
import { signSessionCookieForRole } from './cypress/plugins/sessionCookie'
import type { E2eRole } from './cypress/plugins/sessionCookie'
import { signRealCognitoSession } from './cypress/plugins/cognitoSession'

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
        signRealCognitoSession: () => signRealCognitoSession(),
      })

      // Next unescapes `\$` to `$` in values it reads from env files, but not in
      // real environment variables, and dotenv-flow never unescapes. Unescape
      // only what comes from a file, so Cypress sees what the app sees.
      const groupRegexes = [
        'AGENTS_GOOGLE_GROUPNAME_REGEX',
        'CONTRACTORS_GOOGLE_GROUPNAME_REGEX',
      ]
      const setBeforeFiles = groupRegexes.filter((name) => process.env[name])

      // The library's JSDoc makes the second argument look required to TypeScript
      config = dotenvFlowPlugin(config, {})

      groupRegexes
        .filter((name) => !setBeforeFiles.includes(name) && process.env[name])
        .forEach((name) => {
          process.env[name] = process.env[name].replace(/\\\$/g, '$')
        })

      return config
    },
    baseUrl: 'http://localhost:5001/',
    defaultCommandTimeout: 10000,
    video: false,
    viewportHeight: 1536,
    viewportWidth: 960,
  },
})
