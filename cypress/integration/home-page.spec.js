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

      cy.audit()
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

            cy.audit()
          })

          it('does not display previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })

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

            cy.audit()
          })

          it('does not display previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })

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

              cy.audit()
            })

            it('does not display previous button', () => {
              cy.get('.page-navigation').within(() => {
                cy.contains('Previous').should('not.exist')
              })

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

      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.contains('Manage work orders').should('not.exist')

      cy.contains('Search').should('not.exist')

      cy.get('#signout')
        .contains('Sign out')
        .should('have.attr', 'href', '/logout')
    })

    context('When they have work orders attached to them', () => {
      beforeEach(() => {
        cy.clock(new Date('June 11 2021 13:49:15Z'))

        cy.intercept(
          {
            method: 'GET',
            path: '/api/operatives/hu0001/workorders',
          },
          {
            fixture: 'operatives/workOrders.json',
          }
        ).as('operativesWorkOrders')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders/10000621',
          },
          {
            fixture: 'operatives/workOrder.json',
          }
        ).as('operativesWorkOrder')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/properties/00012345',
          },
          {
            fixture: 'properties/property.json',
          }
        ).as('property')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders/10000621/tasks',
          },
          {
            fixture: 'workOrders/task.json',
          }
        ).as('task')
      })

      it('Displays work order appointments, priority and any closed status', () => {
        cy.visit('/')
        cy.wait('@operativesWorkOrders')

        cy.get('.lbh-heading-h2').contains('Friday 11 June')

        cy.get('.appointment-details').should('have.length', 4)

        cy.get('.lbh-list').within(() => {
          cy.get('li')
            .eq(0)
            .within(() => {
              cy.contains('12:00 – 18:00')
              cy.contains('emergency')
              cy.contains('18 Pitcairn House St Thomass Square')
              cy.contains('L53 GS')
              cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
            })

          cy.get('li')
            .eq(1)
            .within(() => {
              cy.contains('08:00 – 13:00')
              cy.contains('normal')
              cy.contains('17 Pitcairn House St Thomass Square')
              cy.contains('L53 GS')
              cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
            })

          cy.get('li')
            .eq(2)
            .within(() => {
              cy.contains('16:00 – 18:00')
              cy.contains('emergency')
              cy.contains('Completed')
              cy.contains('19 Pitcairn House St Thomass Square')
              cy.contains('L53 GS')
              cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
            })

          cy.get('li')
            .eq(3)
            .within(() => {
              cy.contains('17:00 – 18:00')
              cy.contains('emergency')
              cy.contains('Closed')
              cy.contains('20 Pitcairn House St Thomass Square')
              cy.contains('L53 GS')
              cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
            })

          cy.get('li').eq(1).click()
        })

        cy.wait(['@operativesWorkOrder', '@property', '@task'])
        cy.contains('WO 10000621')
        cy.get('div[class*="Multibutton"]').should('not.exist')
      })
    })

    context("When they don't have work orders attached to them", () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/operatives/hu0001/workorders',
          },
          {
            body: [],
          }
        ).as('operativesWorkOrders')
      })

      it('Displays a warning info box', () => {
        cy.visit('/')
        cy.wait('@operativesWorkOrders')

        cy.get('.warning-info-box').within(() => {
          cy.get('.lbh-body-s').contains('No work orders displayed')
          cy.get('.lbh-body-xs').contains('Please contact your supervisor')
        })
      })
    })
  })
})
