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
      cy.get('.lbh-heading-h1').contains('Find repair work order or property')
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

          it('displays content in the header', () => {
            // Header component
            cy.get('.lbh-header__service-name').contains('Repairs Hub')
            cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

            // Manage work orders link
            cy.get('#manage')
              .contains('Manage work orders')
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

          it('displays content in the header', () => {
            // Header component
            cy.get('.lbh-header__service-name').contains('Repairs Hub')
            cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

            // Manage work orders link
            cy.get('#manage')
              .contains('Manage work orders')
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

          it('displays content in the header', () => {
            // Header component
            cy.get('.lbh-header__service-name').contains('Repairs Hub')
            cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

            // Manage work orders link
            cy.get('#manage')
              .contains('Manage work orders')
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

            it('displays content in the header', () => {
              // Header component
              cy.get('.lbh-header__service-name').contains('Repairs Hub')
              cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

              // Manage work orders link
              cy.get('#manage')
                .contains('Manage work orders')
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
    }
  )

  context('When an operative is logged in', () => {
    beforeEach(() => {
      cy.loginWithOperativeRole()
    })

    it('Displays content in the header', () => {
      cy.visit('/')

      // Header component
      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      // Manage work orders link
      cy.get('#manage')
        .contains('Manage work orders')
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

    context('When they have work orders attached to them', () => {
      beforeEach(() => {
        cy.clock(new Date('June 11 2021 13:49:15Z'))

        //Stub request with operative's work orders response
        cy.intercept(
          {
            method: 'GET',
            path: '/api/operatives/hu0001/workorders',
          },
          {
            fixture: 'operatives/workOrders.json',
          }
        ).as('operativesWorkOrders')

        cy.visit('/')
        cy.wait('@operativesWorkOrders')
      })

      it('Displays work order appointments slots and priority', () => {
        cy.get('.lbh-heading-h1').contains('Friday, 11 June')

        cy.get('.lbh-list').within(() => {
          cy.get('.appointment-details').within(() => {
            cy.contains('08:00-13:00')
            cy.contains('5 [N] NORMAL')
          })
          cy.get('.appointment-details').within(() => {
            cy.contains('12:00-18:00')
            cy.contains('2 [E] EMERGENCY')
          })
        })
      })
    })

    context("When they don't have work orders attached to them", () => {
      it('Displays a warning info box', () => {
        cy.visit('/')

        cy.get('.warning-info-box').within(() => {
          cy.get('.lbh-body-s').contains('No work orders displayed')
          cy.get('.lbh-body-xs').contains('Please contact your supervisor')
        })
      })
    })
  })
})
