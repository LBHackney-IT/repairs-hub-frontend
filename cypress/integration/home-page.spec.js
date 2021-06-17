/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Home page', () => {
  context('When user is not logged in', () => {
    it('Redirects on the sign in page', () => {
      cy.visit('/')

      // Header component
      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      // UserLogin component
      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('When an agent is logged in', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
      cy.visit('/')
    })

    it('Shows the search page', () => {
      // Header component
      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      // Search link
      cy.get('#search')
        .contains('Search')
        .should('have.attr', 'href', '/search')

      // Logout component
      cy.get('#signout')
        .contains('Sign out')
        .should('have.attr', 'href', '/logout')

      // Search for property component
      cy.get('.lbh-heading-h1').contains('Find repair job or property')
      cy.get('.govuk-label').contains(
        'Search by work order reference, postcode or address'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('Redirects to sign in page once logout is clicked and the cookies are cleared', () => {
      cy.logout()
      cy.visit('/')

      // UserLogin component
      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('When a contractor is logged in', () => {
    describe('Show all work orders', () => {
      context(
        'Displays work order details, reference, date raised, last update, priority, property and description',
        () => {
          //Stub request with work orders response
          beforeEach(() => {
            cy.intercept(
              { method: 'GET', path: '/api/filter/WorkOrder' },
              {
                fixture: 'filter/work-order.json',
              }
            )
            cy.intercept(
              {
                method: 'GET',
                path: '/api/workOrders/?PageSize=10&PageNumber=1',
              },
              {
                fixture: 'work-orders/work-orders.json',
              }
            ).as('workOrders')

            cy.loginWithContractorRole()
            cy.visit('/')
            cy.wait('@workOrders')
          })

          it('displays content in the header', () => {
            // Header component
            cy.get('.lbh-header__service-name').contains('Repairs Hub')
            cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

            // Manage jobs link
            cy.get('.lbh-header__links a').eq(0).contains('Manage jobs')
            cy.get('.lbh-header__links a')
              .eq(0)
              .should('have.attr', 'href', '/')

            // Search link
            cy.get('#search')
              .contains('Search')
              .should('have.attr', 'href', '/search')

            // Logout component
            cy.get('#signout')
              .contains('Sign out')
              .should('have.attr', 'href', '/logout')
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
            // Run lighthouse audit for accessibility report
            cy.audit()
          })

          it('does not display previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })
            // Run lighthouse audit for accessibility report
            cy.audit()
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
          //Stub request with work orders response
          beforeEach(() => {
            cy.intercept(
              { method: 'GET', path: '/api/filter/WorkOrder' },
              {
                fixture: 'filter/work-order.json',
              }
            )
            cy.intercept(
              {
                method: 'GET',
                path: '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=90',
              },
              {
                fixture: 'work-orders/work-orders.json',
              }
            ).as('workOrders')

            cy.loginWithContractManagerRole()
            cy.visit('/')
            cy.wait('@workOrders')
          })

          it('displays content in the header', () => {
            // Header component
            cy.get('.lbh-header__service-name').contains('Repairs Hub')
            cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

            // Manage jobs link
            cy.get('.lbh-header__links a').eq(0).contains('Manage jobs')
            cy.get('.lbh-header__links a')
              .eq(0)
              .should('have.attr', 'href', '/')

            // Search link
            cy.get('#search')
              .contains('Search')
              .should('have.attr', 'href', '/search')

            // Logout component
            cy.get('#signout')
              .contains('Sign out')
              .should('have.attr', 'href', '/logout')
          })

          it('Checks the status checkbox', () => {
            cy.get('.govuk-checkboxes')
              .find('[name="StatusCode.90"]')
              .should('be.checked')
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
            // Run lighthouse audit for accessibility report
            cy.audit()
          })

          it('does not display previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })
            // Run lighthouse audit for accessibility report
            cy.audit()
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
          //Stub request with work orders response
          beforeEach(() => {
            cy.intercept(
              { method: 'GET', path: '/api/filter/WorkOrder' },
              {
                fixture: 'filter/work-order.json',
              }
            )
            cy.intercept(
              {
                method: 'GET',
                path:
                  '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=1010',
              },
              {
                fixture: 'work-orders/work-orders.json',
              }
            ).as('workOrders')

            cy.loginWithAuthorisationManagerRole()
            cy.visit('/')
            cy.wait('@workOrders')
          })

          it('displays content in the header', () => {
            // Header component
            cy.get('.lbh-header__service-name').contains('Repairs Hub')
            cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

            // Manage jobs link
            cy.get('.lbh-header__links a').eq(0).contains('Manage jobs')
            cy.get('.lbh-header__links a')
              .eq(0)
              .should('have.attr', 'href', '/')

            // Search link
            cy.get('#search')
              .contains('Search')
              .should('have.attr', 'href', '/search')

            // Logout component
            cy.get('#signout')
              .contains('Sign out')
              .should('have.attr', 'href', '/logout')
          })

          it('Checks the status checkbox', () => {
            cy.get('.govuk-checkboxes')
              .find('[name="StatusCode.1010"]')
              .should('be.checked')
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
            // Run lighthouse audit for accessibility report
            cy.audit()
          })

          it('does not display previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })
            // Run lighthouse audit for accessibility report
            cy.audit()
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
                  fixture: 'filter/work-order.json',
                }
              )
              cy.intercept(
                {
                  method: 'GET',
                  path:
                    '/api/workOrders/?PageSize=10&PageNumber=1&ContractorReference=H01',
                },
                {
                  fixture: 'work-orders/work-orders.json',
                }
              ).as('workOrders')

              cy.loginWithAgentAndContractorRole()
              cy.visit('/')
              cy.wait('@workOrders')
            })

            it('displays content in the header', () => {
              // Header component
              cy.get('.lbh-header__service-name').contains('Repairs Hub')
              cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

              // Search link
              cy.get('#search')
                .contains('Search')
                .should('have.attr', 'href', '/search')

              // Logout component
              cy.get('#signout')
                .contains('Sign out')
                .should('have.attr', 'href', '/logout')
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

            it('Checks the contractor checkbox', () => {
              cy.get('.govuk-checkboxes')
                .find('[name="ContractorReference.H01"]')
                .should('be.checked')
            })

            it('does not display next button when work orders are less than 10', () => {
              cy.get('.page-navigation').within(() => {
                cy.contains('Next').should('not.exist')
              })
              // Run lighthouse audit for accessibility report
              cy.audit()
            })

            it('does not display previous button', () => {
              cy.get('.page-navigation').within(() => {
                cy.contains('Previous').should('not.exist')
              })
              // Run lighthouse audit for accessibility report
              cy.audit()
            })
          }
        )
      })
    }
  )
})
