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
const { prepareAudit } = require('cypress-audit')
const dotenvFlowPlugin = require('cypress-dotenv-flow')
const fs = require('fs')
const path = require('path')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

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
}
