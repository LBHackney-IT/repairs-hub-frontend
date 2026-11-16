/// <reference types="cypress" />

describe('Filter work orders', () => {
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', path: '/api/filter/WorkOrder' },
      { fixture: 'filter/workOrder.json' }
    ).as('filters')

    cy.intercept(
      {
        path:
          '/api/workOrders/?PageSize=10&PageNumber=1&IncludeHistorical=false',
      },
      { fixture: 'workOrders/workOrders.json' }
    ).as('allFiltersRemoved')

    cy.fixture('workOrders/workOrders.json')
      .then((workOrders) => {
        cy.intercept(
          {
            path:
              '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=50&IncludeHistorical=false',
          },
          workOrders.filter((workOrder) => workOrder.status === 'Work complete')
        )
      })
      .as('workOrdersComplete')

    cy.fixture('workOrders/workOrders.json')
      .then((workOrders) => {
        cy.intercept(
          {
            path:
              '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=80&StatusCode=90&Priorities=2&IncludeHistorical=false',
          },
          workOrders.filter(
            (workOrder) =>
              (workOrder.status === 'In progress' ||
                workOrder.status === 'Variation Pending Approval') &&
              workOrder.priority === '2 [E] EMERGENCY'
          )
        )
      })
      .as('workOrdersInProgressVariationPendingApprovalEmergency')
  })

  context('Applying a filter and using the browser back button', () => {
    beforeEach(() => {
      cy.loginWithContractManagerRole()
    })

    it('updates the URL and list, and going back restores the previous list', () => {
      cy.visit('/')
      cy.wait(['@filters', '@allFiltersRemoved'])
      cy.get('[data-ref=10000040]').should('exist')

      cy.get('.govuk-checkboxes').find('[name="StatusCode.50"]').check()
      cy.get('[data-testid=apply-filters]').contains('Apply filters').click()

      cy.url().should('contains', '/?pageNumber=1&StatusCode=50')
      cy.wait('@workOrdersComplete')
      cy.get('[data-ref=10000037]').should('exist')
      cy.get('[data-ref=10000040]').should('not.exist')

      cy.go('back')

      cy.url().should('not.contain', 'StatusCode')
      cy.wait('@allFiltersRemoved')
      cy.get('[data-ref=10000040]').should('exist')
      cy.get('[data-ref=10000037]').should('exist')
    })
  })

  context('Saving and removing default filter options', () => {
    beforeEach(() => {
      cy.loginWithContractManagerRole()
    })

    it('Saves selected filters in localStorage as the default filter preset', () => {
      cy.visit(
        '/?pageNumber=1&StatusCode=80&StatusCode=90&Priorities=2&IncludeHistorical=false'
      )
      cy.wait([
        '@filters',
        '@workOrdersInProgressVariationPendingApprovalEmergency',
      ])

      // Selected filters summary
      cy.get('.selected-filters').within(() => {
        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').within(() => {
          cy.contains('In Progress')
          cy.contains('Variation Pending Approval')
        })
        cy.get('#selected-filters-Priority').within(() => {
          cy.contains('Emergency')
        })
        cy.get('#selected-filters-Trade').should('not.exist')
      })

      // Save selected filters to localStorage
      cy.get('.selected-filters').within(() => {
        cy.contains('Save selected filters as my default preset')
          .click({ force: true })
          .then(() => {
            expect(
              localStorage.getItem('RH - default work order filters')
            ).to.equal(
              '{"pageNumber":"1","StatusCode":["80","90"],"Priorities":["2"],"IncludeHistorical":"false"}'
            )
            cy.on('window:confirm', (string) => {
              expect(string).to.equal(
                'Save my selected filters:\n  Status  [ In Progress , Variation Pending Approval ], Priority  [ Emergency ]  as the default preset?'
              )
            })
          })
      })

      cy.visit('/')

      cy.wait([
        '@filters',
        '@workOrdersInProgressVariationPendingApprovalEmergency',
      ])

      // Selected filters summary
      // Expect saved default filters to be applied
      cy.get('.selected-filters').within(() => {
        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').within(() => {
          cy.contains('In Progress')
          cy.contains('Variation Pending Approval')
        })
        cy.get('#selected-filters-Priority').within(() => {
          cy.contains('Emergency')
        })
        cy.get('#selected-filters-Trade').should('not.exist')
      })

      cy.get('[data-ref=10000040]').within(() => {
        cy.contains('In progress')
        cy.contains('2 [E] EMERGENCY')
      })
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')

      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('be.checked')
    })

    it('Removes selected default filters from localStorage', () => {
      localStorage.setItem(
        'RH - default work order filters',
        '{"pageNumber":"1","StatusCode":["80","90"],"Priorities":"2"}'
      )
      cy.visit('/')
      cy.wait([
        '@filters',
        '@workOrdersInProgressVariationPendingApprovalEmergency',
      ])

      // Save selected filters to localStorage
      cy.get('.selected-filters').within(() => {
        cy.contains('Remove saved default filter preset')
          .click({ force: true })
          .then(() => {
            expect(
              localStorage.getItem('RH - default work order filters')
            ).to.equal(null)
            cy.on('window:confirm', (string) => {
              expect(string).to.equal('Remove my default saved filters?')
            })
          })
      })

      cy.visit('/')

      // Selected filters summary
      cy.get('.selected-filters').within(() => {
        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').should('not.exist')
        cy.get('#selected-filters-Priority').should('not.exist')
        cy.get('#selected-filters-Trade').should('not.exist')
      })

      cy.get('[data-ref=10000040]').should('exist')
      cy.get('[data-ref=10000037]').should('exist')
      cy.get('[data-ref=10000036]').should('exist')
      cy.get('[data-ref=10000035]').should('exist')
      cy.get('[data-ref=10000030]').should('exist')

      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('not.be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('not.be.checked')
    })
  })
})
