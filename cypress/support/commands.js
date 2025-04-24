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

Cypress.Commands.add('loginWithFollowOnAdminRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_FOLLOWON_ADMIN')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/user.json' }
  )
})

Cypress.Commands.add('loginWithAgentRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_AGENT')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/user.json' }
  )
})

Cypress.Commands.add('loginWithContractorRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_CONTRACTOR_ALPHATRACK')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/contractor.json' }
  )
})

Cypress.Commands.add('loginWithAgentAndContractorRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_DLO_CONTRACTOR')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/operative.json' }
  )
})

Cypress.Commands.add('loginWithMultipleContractorRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_MULTIPLE_CONTRACTOR')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/multipleContractor.json' }
  )
})

Cypress.Commands.add('loginWithContractManagerRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_CONTRACT_MANAGER')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/user.json' }
  )
})

Cypress.Commands.add('loginWithAuthorisationManagerRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_AUTHORISATION_MANAGER')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/user.json' }
  )
})

Cypress.Commands.add('loginWithOperativeRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_OPERATIVE')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/operative.json' }
  )
})

Cypress.Commands.add('loginWithOneJobAtATimeOperativeRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_OPERATIVE')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/operative-onejob.json' }
  )
})

Cypress.Commands.add('loginWithAgentAndBudgetCodeOfficerRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_BUDGET_CODE_OFFICER')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/user.json' }
  )
})

Cypress.Commands.add('loginWithDataAdminRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_DATA_ADMIN')

  cy.getCookies().should('be.empty')
  cy.setCookie(Cypress.env('GSSO_TOKEN_NAME'), gssoTestKey)
  cy.getCookie(Cypress.env('GSSO_TOKEN_NAME')).should(
    'have.property',
    'value',
    gssoTestKey
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: 'hubUser/user.json' }
  )
})

Cypress.Commands.add('requestsCountByUrl', (url) =>
  cy.wrap().then(() => {
    const requests = cy.state('requests') || []
    return requests.filter((req) => req.xhr.url.match(new RegExp(`${url}`)))
      .length
  })
)

Cypress.Commands.add(
  'checkForTenureDetails',
  (tenure, addressAlerts, contactAlerts) => {
    // Tenure
    cy.get('.hackney-property-alerts li.bg-dark-green').within(() => {
      cy.contains(tenure)
    })

    // Alerts
    cy.get('.hackney-property-alerts').within(() => {
      // Location alerts
      addressAlerts.forEach((alert) => {
        cy.contains(alert)
      })

      // Person alerts
      contactAlerts.forEach((alert) => {
        cy.contains(alert)
      })
    })
  }
)
