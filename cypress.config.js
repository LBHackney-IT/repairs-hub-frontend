import { defineConfig } from 'cypress'
import { lighthouse, prepareAudit } from 'cypress-audit'
import dotenvFlowPlugin from 'cypress-dotenv-flow'
import fs from 'fs'
import path from 'path'

const storeData = async (data, filepath) => {
  try {
    const dirpath = path.dirname(filepath)
    await fs.promises.mkdir(dirpath, { recursive: true })
    // Paste JSON file into https://googlechrome.github.io/lighthouse/viewer/
    // for Lighthouse Report
    fs.writeFile(filepath, JSON.stringify(data), (err) => {
      if (err) throw err
    })
  } catch (error) {
    console.error(error)
  }
}

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

      on('task', {
        lighthouse: lighthouse((report) => {
          const requestedUrl = report.lhr.requestedUrl.replace(
            config.baseUrl,
            ''
          )
          const filepath = path.resolve(
            'cypress',
            `reports/lighthouse/${
              requestedUrl || 'home-page'
            } (${testTitle}).json`
          )

          storeData(report, filepath)
        }),
      })

      config = dotenvFlowPlugin(config)

      // Assign some vars so we can access them via Cypress.env
      config.env.GSSO_TOKEN_NAME = process.env.GSSO_TOKEN_NAME

      return config
    },
    baseUrl: 'http://localhost:5001/',
    defaultCommandTimeout: 10000,
    video: false,

    lighthouse: {
      accessibility: 90,
    },

    viewportHeight: 1536,
    viewportWidth: 960,
  },
})
