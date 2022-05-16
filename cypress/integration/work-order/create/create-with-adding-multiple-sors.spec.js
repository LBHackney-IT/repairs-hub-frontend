const now = new Date('2022-02-11T12:00:00')
describe('Raise repair form', () => {
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/contractors?propertyReference=00012345&tradeCode=PL',
      },
      { fixture: 'contractors/contractors.json' }
    ).as('contractorsRequest')

    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/priorities' },
      { fixture: 'scheduleOfRates/priorities.json' }
    ).as('sorPrioritiesRequest')

    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/trades?propRef=00012345' },
      { fixture: 'scheduleOfRates/trades.json' }
    ).as('tradesRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders?*',
      },
      { body: [] }
    ).as('workOrdersRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders/budget-codes?contractorReference=PCL',
      },
      { fixture: 'scheduleOfRates/budgetCodes.json' }
    ).as('budgetCodesRequest')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=PCL&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
    ).as('sorCodesRequest')

    cy.intercept(
      { method: 'GET', path: '/api/toggles' },
      {
        body: [
          {
            featureToggles: { MultiTradeSORIncrementalSearch: true },
          },
        ],
      }
    ).as('featureToggle')

    cy.clock(now, ['Date'])
  })
  context('When choosing to add multiple SOR codes option', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('allows to add multiple SORs', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait('@contractorsRequest')

        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')
        cy.contains('+ Add multiple SOR codes').click()
      })

      cy.get('#repair-request-form').should('not.exist')

      cy.contains('Add multiple SOR codes')
      cy.get('#adding-multiple-sors-form').within(() => {
        cy.contains('Enter SOR codes as a list:')
      })
    })

    it('throws an error', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait('@contractorsRequest')

        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')
        cy.contains('+ Add multiple SOR codes').click()
      })

      //when submitting without entering SOR codes
      cy.get('#adding-multiple-sors-form').within(() => {
        cy.contains('Enter SOR codes as a list:')
        cy.contains('Submit').click()
        cy.contains('Please enter SOR codes')
      })
    })
  })
})
