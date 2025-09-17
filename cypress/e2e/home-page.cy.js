/// <reference types="cypress" />

import 'cypress-audit/commands'

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

  context('When a contractor is logged in', () => {
    describe('Show all work orders', () => {
      context(
        'Displays work order details, reference, date raised, last update, priority, property and description',
        () => {
          beforeEach(() => {
            cy.intercept(
              { method: 'GET', path: '/api/filter/WorkOrder' },
              {
                fixture: 'filter/workOrder.json',
              }
            )
            cy.intercept(
              {
                method: 'GET',
                path:
                  '/api/workOrders/?PageSize=10&PageNumber=1&IncludeHistorical=false',
              },
              {
                fixture: 'workOrders/workOrders.json',
              }
            ).as('workOrders')

            cy.loginWithContractorRole()
            cy.visit('/')
            cy.wait('@workOrders')
          })

          it('Displays the first page of repairs', () => {
            cy.get('.govuk-table').within(() => {
              cy.contains('th', 'Reference')
              cy.contains('th', 'Date raised')
              cy.contains('th', 'Priority')
              cy.contains('th', 'Property')
              cy.contains('th', 'Status')
              cy.contains('th', 'Trade')
              cy.contains('th', 'Description')
            })
            // Check the first row
            cy.get('[data-ref=10000040]').within(() => {
              cy.contains('10000040')
              cy.contains('22 Jan 2021')
              cy.contains('[E] EMERGENCY')
              cy.contains('315 Banister House Homerton High Street')
              cy.contains('In progress')
              cy.contains('DOOR ENTRY ENGINEER - DE')
              cy.contains('An emergency repair')
            })
          })

          it('does not display next button when work orders are less than 10', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Next').should('not.exist')
            })
          })

          it('does not display previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })
          })
        }
      )
    })
  })

  context('When a contract manager is logged in', () => {
    describe('Show all work orders', () => {
      context(
        'Displays work order details, reference, date raised, last update, priority, property and description',
        () => {
          beforeEach(() => {
            cy.intercept(
              { method: 'GET', path: '/api/filter/WorkOrder' },
              {
                fixture: 'filter/workOrder.json',
              }
            )
            cy.intercept(
              {
                method: 'GET',
                path:
                  '/api/workOrders/?PageSize=10&PageNumber=1&IncludeHistorical=false',
              },
              {
                fixture: 'workOrders/workOrders.json',
              }
            ).as('workOrders')

            cy.loginWithContractManagerRole()
            cy.visit('/')
            cy.wait('@workOrders')
          })

          it('Displays the first page of repairs', () => {
            cy.get('.govuk-table').within(() => {
              cy.contains('th', 'Reference')
              cy.contains('th', 'Date raised')
              cy.contains('th', 'Priority')
              cy.contains('th', 'Property')
              cy.contains('th', 'Status')
              cy.contains('th', 'Trade')
              cy.contains('th', 'Description')
            })
            // Check the first row
            cy.get('[data-ref=10000040]').within(() => {
              cy.contains('10000040')
              cy.contains('22 Jan 2021')
              cy.contains('[E] EMERGENCY')
              cy.contains('315 Banister House Homerton High Street')
              cy.contains('In progress')
              cy.contains('DOOR ENTRY ENGINEER - DE')
              cy.contains('An emergency repair')
            })
          })

          it('does not display next button when work orders are less than 10', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Next').should('not.exist')
            })
          })

          it('does not display previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })
          })
        }
      )
    })
  })

  context('When an authorisations manager is logged in', () => {
    describe('Show all work orders', () => {
      context(
        'Displays work order details, reference, date raised, last update, priority, property and description',
        () => {
          beforeEach(() => {
            cy.intercept(
              { method: 'GET', path: '/api/filter/WorkOrder' },
              {
                fixture: 'filter/workOrder.json',
              }
            )
            cy.intercept(
              {
                method: 'GET',
                path:
                  '/api/workOrders/?PageSize=10&PageNumber=1&IncludeHistorical=false',
              },
              {
                fixture: 'workOrders/workOrders.json',
              }
            ).as('workOrders')

            cy.loginWithAuthorisationManagerRole()
            cy.visit('/')
            cy.wait('@workOrders')
          })

          it('Displays the first page of repairs', () => {
            cy.get('.govuk-table').within(() => {
              cy.contains('th', 'Reference')
              cy.contains('th', 'Date raised')
              cy.contains('th', 'Priority')
              cy.contains('th', 'Property')
              cy.contains('th', 'Status')
              cy.contains('th', 'Trade')
              cy.contains('th', 'Description')
            })

            // Check the first row
            cy.get('[data-ref=10000040]').within(() => {
              cy.contains('10000040')
              cy.contains('22 Jan 2021')
              cy.contains('[E] EMERGENCY')
              cy.contains('315 Banister House Homerton High Street')
              cy.contains('In progress')
              cy.contains('DOOR ENTRY ENGINEER - DE')
              cy.contains('An emergency repair')
            })
          })

          it('does not display next button when work orders are less than 10', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Next').should('not.exist')
            })
          })

          it('does not display previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })
          })
        }
      )
    })
  })

  context(
    'When a user with both agent and contractor role is logged in',
    () => {
      describe('Show all work orders', () => {
        context(
          'Displays work order details, reference, date raised, last update, priority, property and description',
          () => {
            //Stub request with work orders response
            beforeEach(() => {
              cy.intercept(
                { method: 'GET', path: '/api/filter/WorkOrder' },
                {
                  fixture: 'filter/workOrder.json',
                }
              )
              cy.intercept(
                {
                  method: 'GET',
                  path:
                    '/api/workOrders/?PageSize=10&PageNumber=1&IncludeHistorical=false',
                },
                {
                  fixture: 'workOrders/workOrders.json',
                }
              ).as('workOrders')

              cy.loginWithAgentAndContractorRole()
              cy.visit('/')
              cy.wait('@workOrders')
            })

            it('Displays the first page of repairs', () => {
              cy.get('.govuk-table').within(() => {
                cy.contains('th', 'Reference')
                cy.contains('th', 'Date raised')
                cy.contains('th', 'Priority')
                cy.contains('th', 'Property')
                cy.contains('th', 'Status')
                cy.contains('th', 'Trade')
                cy.contains('th', 'Description')
              })
              // Check the first row
              cy.get('[data-ref=10000040]').within(() => {
                cy.contains('10000040')
                cy.contains('22 Jan 2021')
                cy.contains('[E] EMERGENCY')
                cy.contains('315 Banister House Homerton High Street')
                cy.contains('In progress')
                cy.contains('DOOR ENTRY ENGINEER - DE')
                cy.contains('An emergency repair')
              })
            })

            it('does not display next button when work orders are less than 10', () => {
              cy.get('.page-navigation').within(() => {
                cy.contains('Next').should('not.exist')
              })
            })

            it('does not display previous button', () => {
              cy.get('.page-navigation').within(() => {
                cy.contains('Previous').should('not.exist')
              })
            })
          }
        )
      })
    }
  )
})
