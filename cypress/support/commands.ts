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

Cypress.Commands.add('loginWithContractAdminRole', () => {
  const gssoTestKey = Cypress.env('GSSO_TEST_KEY_CONTRACT_ADMIN')

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
