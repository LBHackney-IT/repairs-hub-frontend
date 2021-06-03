// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-audit/commands'

const host = Cypress.env('HOST')

Cypress.Commands.add('loginWithAgentRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_AGENT')

  cy.getCookies().should('be.empty')
  cy.setCookie('hackneyToken', gssoTestKey)
  cy.getCookie('hackneyToken').should('have.property', 'value', gssoTestKey)
  cy.visit(host)
})

Cypress.Commands.add('loginWithContractorRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_CONTRACTOR_ALPHATRACK')

  cy.getCookies().should('be.empty')
  cy.setCookie('hackneyToken', gssoTestKey)
  cy.getCookie('hackneyToken').should('have.property', 'value', gssoTestKey)
  cy.visit(host)
})

Cypress.Commands.add('loginWithMultipleContractorRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_MULTIPLE_CONTRACTOR')

  cy.getCookies().should('be.empty')
  cy.setCookie('hackneyToken', gssoTestKey)
  cy.getCookie('hackneyToken').should('have.property', 'value', gssoTestKey)
  cy.visit(host)
})

Cypress.Commands.add('loginWithContractManagerRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_CONTRACT_MANAGER')

  cy.getCookies().should('be.empty')
  cy.setCookie('hackneyToken', gssoTestKey)
  cy.getCookie('hackneyToken').should('have.property', 'value', gssoTestKey)
  cy.visit(host)
})

Cypress.Commands.add('loginWithAuthorisationManagerRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_AUTHORISATION_MANAGER')

  cy.getCookies().should('be.empty')
  cy.setCookie('hackneyToken', gssoTestKey)
  cy.getCookie('hackneyToken').should('have.property', 'value', gssoTestKey)
  cy.visit(host)
})

Cypress.Commands.add('logout', () => {
  cy.get('#logout').contains('Logout')
  cy.clearCookie('hackneyToken')

  cy.getCookies().should('be.empty')
  cy.visit(host)
})
