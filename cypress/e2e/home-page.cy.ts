// Which page each role lands on. What the pages show is covered by the Jest tests.
describe('Home page', () => {
  context('When an agent is logged in', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
      cy.visit('/')
    })

    it('Shows the search page', () => {
      cy.get('.lbh-heading-h1').contains('Find repair work order or property')
      cy.get('.govuk-label').contains(
        'Search by work order reference, postcode or address'
      )
    })
  })

  const rolesThatSeeWorkOrders: Record<
    string,
    () => Cypress.Chainable<void>
  > = {
    contractor: () => cy.loginWithContractorRole(),
    'contract manager': () => cy.loginWithContractManagerRole(),
    'authorisations manager': () => cy.loginWithAuthorisationManagerRole(),
    'agent and contractor': () => cy.loginWithAgentAndContractorRole(),
  }

  Object.entries(rolesThatSeeWorkOrders).forEach(([role, login]) => {
    context(`When a ${role} is logged in`, () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/filter/WorkOrder' },
          { fixture: 'filter/workOrder.json' }
        )
        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/workOrders/?PageSize=10&PageNumber=1&IncludeHistorical=false',
          },
          { fixture: 'workOrders/workOrders.json' }
        ).as('workOrders')

        login()
        cy.visit('/')
        cy.wait('@workOrders')
      })

      it('Shows the list of work orders', () => {
        cy.get('.lbh-heading-h1').contains('Manage work orders')
        cy.get('.govuk-table').within(() => {
          cy.contains('th', 'Reference')
          cy.get('[data-ref=10000040]').contains('10000040')
        })
      })
    })
  })

  const operativeRoles: Record<string, () => Cypress.Chainable<void>> = {
    operative: () => cy.loginWithOperativeRole(),
    'one job at a time operative': () =>
      cy.loginWithOneJobAtATimeOperativeRole(),
  }

  Object.entries(operativeRoles).forEach(([role, login]) => {
    context(`When an ${role} is logged in`, () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/operatives/hu0001/appointments' },
          { body: [] }
        ).as('appointments')

        login()
        cy.visit('/')
        cy.wait('@appointments')
      })

      it('Shows their work orders instead of the work orders list or search', () => {
        cy.get('.warning-info-box').contains('No work orders displayed')
        cy.contains('Manage work orders').should('not.exist')
        cy.contains('Search').should('not.exist')
      })
    })
  })
})
