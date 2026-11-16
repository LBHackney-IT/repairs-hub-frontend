/// <reference types="cypress" />
export {}

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
      loginWithContractAdminRole(): Chainable<void>
      loginWithRealCognito(): Chainable<string[]>
      requestsCountByUrl(url: string): Cypress.Chainable<number>
      checkForTenureDetails(
        tenure: string,
        alerts: string[]
      ): Cypress.Chainable<void>
      ensureCompressedFileInIndexedDb(filename: string): Cypress.Chainable<void>
      clearFilesDatabase(): Cypress.Chainable<void>
    }
  }
}

// Signs in as `role` with a session cookie minted by the `signSessionCookie`
// task, and stubs /api/hub-user with `hubUserFixture`
const loginAs = (role: string, hubUserFixture: string) => {
  cy.getCookies().should('be.empty')

  cy.task('signSessionCookie', role).then(
    ({ name, value }: { name: string; value: string }) => {
      cy.setCookie(name, value)
      cy.getCookie(name).should('have.property', 'value', value)
    }
  )

  cy.intercept(
    { method: 'GET', path: '/api/hub-user' },
    { fixture: `hubUser/${hubUserFixture}` }
  )
}

Cypress.Commands.add('loginWithFollowOnAdminRole', () =>
  loginAs('followOnAdmin', 'user.json')
)
Cypress.Commands.add('loginWithAgentRole', () => loginAs('agent', 'user.json'))
Cypress.Commands.add('loginWithContractorRole', () =>
  loginAs('contractor', 'contractor.json')
)
Cypress.Commands.add('loginWithAgentAndContractorRole', () =>
  loginAs('agentAndContractor', 'operative.json')
)
Cypress.Commands.add('loginWithMultipleContractorRole', () =>
  loginAs('multipleContractor', 'multipleContractor.json')
)
Cypress.Commands.add('loginWithContractManagerRole', () =>
  loginAs('contractManager', 'user.json')
)
Cypress.Commands.add('loginWithAuthorisationManagerRole', () =>
  loginAs('authorisationManager', 'user.json')
)
Cypress.Commands.add('loginWithOperativeRole', () =>
  loginAs('operative', 'operative.json')
)
Cypress.Commands.add('loginWithOneJobAtATimeOperativeRole', () =>
  loginAs('operative', 'operative-onejob.json')
)
Cypress.Commands.add('loginWithAgentAndBudgetCodeOfficerRole', () =>
  loginAs('agentAndBudgetCodeOfficer', 'user.json')
)
Cypress.Commands.add('loginWithDataAdminRole', () =>
  loginAs('dataAdmin', 'user.json')
)
Cypress.Commands.add('loginWithContractAdminRole', () =>
  loginAs('contractAdmin', 'user.json')
)

// Signs in with the Cognito test user (see cypress/plugins/cognitoSession.ts)
// and yields the groups the app read from the real id token
Cypress.Commands.add('loginWithRealCognito', () => {
  cy.getCookies().should('be.empty')

  return cy
    .task('signRealCognitoSession')
    .then(
      ({
        name,
        value,
        groups,
      }: {
        name: string
        value: string
        groups: string[]
      }) => {
        cy.setCookie(name, value)
        cy.intercept(
          { method: 'GET', path: '/api/hub-user' },
          { fixture: 'hubUser/user.json' }
        )

        return cy.wrap(groups)
      }
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

Cypress.Commands.add('checkForTenureDetails', (tenure, alerts) => {
  // Tenure
  cy.get('.hackney-property-alerts li.bg-dark-green').within(() => {
    cy.contains(tenure)
  })

  // Alerts
  cy.get('.hackney-property-alerts').each(() => {
    alerts.forEach((alert) => {
      cy.contains(alert)
    })
  })
})

Cypress.Commands.add('ensureCompressedFileInIndexedDb', (filename: string) => {
  return cy.window().then((win) => {
    const dbName = 'repairs-hub-files'
    const tableName = 'files'
    return new Cypress.Promise<void>((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 5

      function tryOpenDb() {
        const dbRequest = win.indexedDB.open(dbName, 1)

        dbRequest.onerror = () => reject(dbRequest.error)

        dbRequest.onsuccess = () => {
          const db = dbRequest.result
          try {
            const transaction = db.transaction(tableName, 'readonly')
            const store = transaction.objectStore(tableName)
            const getRequest = store.get(`cached-${filename}`)

            getRequest.onerror = () => reject(getRequest.error)
            getRequest.onsuccess = () => {
              const res = getRequest.result
              if (!res && attempts < maxAttempts) {
                attempts++
                setTimeout(tryOpenDb, 1000)
              } else {
                expect(res).to.exist
                resolve()
              }
            }
          } catch (e) {
            if (attempts < maxAttempts) {
              attempts++
              setTimeout(tryOpenDb, 1000)
            } else {
              reject(e)
            }
          }
        }
      }

      tryOpenDb()
    })
  })
})

Cypress.Commands.add('clearFilesDatabase', () => {
  return cy.window().then(async (win) => {
    const dbName = 'repairs-hub-files'
    const tableName = 'files'

    const databases = await win.indexedDB.databases()
    if (!databases.some((db) => db.name === dbName)) {
      return
    }

    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = win.indexedDB.open(dbName)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })

    if (!db.objectStoreNames.contains(tableName)) {
      db.close()
      return
    }

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(tableName, 'readwrite')
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)

      const store = transaction.objectStore(tableName)
      store.clear()
    })

    db.close()
  })
})
