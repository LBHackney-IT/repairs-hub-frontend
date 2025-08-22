/// <reference types="cypress" />
import 'cypress-audit/commands'

declare global {
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable {
      state(key: string): unknown
      loginWithFollowOnAdminRole(): Chainable<void>
      loginWithAgentRole(): Chainable<void>
      loginWithContractorRole(): Chainable<void>
      loginWithAgentAndContractorRole(): Chainable<void>
      loginWithMultipleContractorRole(): Chainable<void>
      loginWithContractManagerRole(): Chainable<void>
      loginWithAuthorisationManagerRole(): Chainable<void>
      loginWithOperativeRole(): Chainable<void>
      loginWithOneJobAtATimeOperativeRole(): Chainable<void>
      loginWithAgentAndBudgetCodeOfficerRole(): Chainable<void>
      loginWithDataAdminRole(): Chainable<void>
      requestsCountByUrl(url: string): Cypress.Chainable<number>
      checkForTenureDetails(
        tenure: string,
        addressAlerts: string[],
        contactAlerts: string[]
      ): Cypress.Chainable<void>
      ensureCompressedFileInIndexedDb(filename: string): Cypress.Chainable<void>
    }
  }
}

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
  cy.wrap(null).then(() => {
    const requests = (cy.state('requests') || []) as Array<{
      xhr: { url: string }
    }>
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

Cypress.Commands.add('ensureCompressedFileInIndexedDb', (filename: string) => {
  return cy.window().then((win) => {
    const dbName = 'repairs-hub-files'
    const tableName = 'files'
    return new Cypress.Promise<void>((resolve, reject) => {
      const dbRequest = win.indexedDB.open(dbName, 1)

      dbRequest.onerror = () => reject(dbRequest.error)

      dbRequest.onsuccess = () => {
        const db = dbRequest.result
        try {
          const transaction = db.transaction(tableName, 'readonly')
          const store = transaction.objectStore(tableName)
          const getRequest = store.get(`compressed-${filename}`)

          getRequest.onerror = () => reject(getRequest.error)
          getRequest.onsuccess = () => {
            const res = getRequest.result
            expect(res).to.exist
            expect(res.name || res.blob?.name).to.equal(filename)
            resolve()
          }
        } catch (e) {
          reject(e)
        }
      }
    })
  })
})
