import { defineConfig } from 'cypress'
import { prepareAudit } from 'cypress-audit'
import dotenvFlowPlugin from 'cypress-dotenv-flow'

export default defineConfig({
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress-reporter-config.json',
  },
  e2e: {
    setupNodeEvents(on, config) {
      let testTitle

      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions)

        return launchOptions
      })

      on('task', {
        getTestTitle(message) {
          testTitle = message

          return null
        },
      })

      config = dotenvFlowPlugin(config)

      // Assign some vars so we can access them via Cypress.env
      config.env.GSSO_TOKEN_NAME = process.env.GSSO_TOKEN_NAME

      return config
    },
    baseUrl: 'http://localhost:5001/',
    defaultCommandTimeout: 10000,
    video: false,
    viewportHeight: 1536,
    viewportWidth: 960,
  },
})
