/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const { lighthouse, pa11y, prepareAudit } = require('cypress-audit')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

const storeData = async (data, filepath) => {
  try {
    await mkdirp(path.dirname(filepath))
    // Paste JSON file into https://googlechrome.github.io/lighthouse/viewer/
    // for Lighthouse Report Viewer
    fs.writeFile(filepath, JSON.stringify(data))
  } catch (error) {
    console.error(error)
  }
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('before:browser:launch', (browser = {}, launchOptions) => {
    prepareAudit(launchOptions)
  })

  on('task', {
    lighthouse: lighthouse((report) => {
      const requestedUrl = report.lhr.requestedUrl.replace(config.baseUrl, '')
      const filepath = path.resolve(
        'cypress',
        `reports/lighthouse/${requestedUrl || 'home-page'}.json`
      )
      storeData(report, filepath)
    }),
  })
}
