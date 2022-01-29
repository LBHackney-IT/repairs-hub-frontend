/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Show work order page', () => {
  context('When Agent is logged in', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/workOrder.json' }
      ).as('workOrderRequest')

      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      ).as('propertyRequest')

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/notes' },
        { fixture: 'workOrders/notes.json' }
      ).as('notesRequest')

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/tasks' },
        { body: [] }
      ).as('tasksRequest')

      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
        },
        { body: [] }
      ).as('workOrdersRequest')
    })

    it('Shows various details about the work order, property and assigned contractor', () => {
      cy.visit('/work-orders/10000012')

      cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

      cy.get('.lbh-heading-h1').within(() => {
        cy.contains('Work order: 10000012')
      })

      cy.get('.lbh-body-m').within(() => {
        cy.contains('This is an urgent repair description')
      })

      cy.get('.property-details-main-section').within(() => {
        cy.contains('Dwelling')
        cy.contains('16 Pitcairn House').should(
          'have.attr',
          'href',
          '/properties/00012345'
        )
        cy.contains('St Thomass Square').should(
          'have.attr',
          'href',
          '/properties/00012345'
        )
        cy.contains('E9 6PT')
      })

      cy.checkForTenureDetails(
        'Tenure: Secure',
        ['Address Alert: Property Under Disrepair (DIS)'],
        [
          'Contact Alert: No Lone Visits (CV)',
          'Contact Alert: Verbal Abuse or Threat of (VA)',
        ]
      )

      cy.get('.work-order-info').within(() => {
        cy.contains('Status: In Progress')
        cy.contains('Priority: U - Urgent (5 Working days)')
        cy.contains('Raised by Dummy Agent')
        cy.contains('18 Jan 2021, 15:28')
        cy.contains('Target: 23 Jan 2021, 18:30')
        cy.contains('Caller: Jill Smith')
        cy.contains('07700 900999')
      })

      cy.contains('Assigned to: Alphatrack (S) Systems Lt')

      cy.audit()
    })

    context('When the work order has been assigned operatives', () => {
      beforeEach(() => {
        cy.fixture('workOrders/workOrder.json')
          .then((workOrder) => {
            workOrder.operatives = [
              {
                id: 0,
                payrollNumber: '0',
                name: 'Operative 1',
                trades: ['DE'],
              },
              {
                id: 1,
                payrollNumber: '1',
                name: 'Operative 2',
                trades: ['DE'],
              },
            ]

            workOrder.appointment = {
              date: '2021-03-19',
              description: 'PM Slot',
              end: '18:00',
              start: '12:00',
            }

            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000012' },
              { body: workOrder }
            )
          })
          .as('workOrderWithOperativesRequest')
      })

      context('When the appointment is today', () => {
        context('And start time is in the future', () => {
          beforeEach(() => {
            cy.clock(new Date('March 19 2021 11:59:00Z'))
          })

          it('Shows the assigned operatives', () => {
            cy.visit('/work-orders/10000012')

            cy.wait([
              '@workOrderWithOperativesRequest',
              '@propertyRequest',
              '@tasksRequest',
            ])

            cy.get('.appointment-details').within(() => {
              cy.contains('Appointment details')
              cy.contains('19 Mar 2021, 12:00-18:00')
            })

            cy.contains('Operatives: Operative 1, Operative 2')
          })
        })

        context('And start time is in the past', () => {
          beforeEach(() => {
            cy.clock(new Date('March 19 2021 12:01:00Z'))
          })

          it('Shows the assigned operatives', () => {
            cy.visit('/work-orders/10000012')

            cy.wait([
              '@workOrderWithOperativesRequest',
              '@propertyRequest',
              '@tasksRequest',
            ])

            cy.get('.appointment-details').within(() => {
              cy.contains('Appointment details')
              cy.contains('19 Mar 2021, 12:00-18:00')
            })

            cy.contains('Operatives: Operative 1, Operative 2')
          })
        })
      })

      context('And the appointment was before today', () => {
        beforeEach(() => {
          cy.clock(new Date('March 18 2021 11:59:00Z'))
        })

        it('Does not show the assigned operatives', () => {
          cy.visit('/work-orders/10000012')

          cy.wait([
            '@workOrderWithOperativesRequest',
            '@propertyRequest',
            '@tasksRequest',
          ])

          cy.get('.appointment-details').within(() => {
            cy.contains('Appointment details')
            cy.contains('19 Mar 2021, 12:00-18:00')
          })

          cy.contains('Operatives: Operative 1, Operative 2').should(
            'not.exist'
          )
        })
      })
    })

    context('When the associated property has historical work orders', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
          },
          { fixture: 'workOrders/workOrders.json' }
        ).as('workOrdersHistoryRequest')

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040' },
          { fixture: 'workOrders/priorityImmediate.json' }
        ).as('historicalWorkOrderRequest')

        cy.intercept(
          { method: 'GET', path: '/api/properties/00089473' },
          { fixture: 'properties/property.json' }
        ).as('propertyRequest')

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040/tasks' },
          { body: [] }
        ).as('tasksRequest')

        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/workOrders?propertyReference=00089473&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
          },
          { body: [] }
        ).as('workOrdersRequest')
      })

      it('Lists the orders in the history tab', () => {
        cy.visit('/work-orders/10000012')

        cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

        cy.get('.govuk-tabs__list-item--selected a').contains('Tasks and SORs')

        cy.get('a[id="tab_work-orders-history-tab"]').click()

        cy.wait('@workOrdersHistory')

        cy.contains('10000040').should(
          'have.attr',
          'href',
          'work-orders/10000040'
        )
      })
    })
  })

  context('When logged in as an Operative', () => {
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

      cy.loginWithOperativeRole()
      cy.visit('/')
      cy.wait('@operativesWorkOrders')
    })

    it('shows list of cautionary alerts page with highlighted codes', () => {
      cy.visit('/operatives/1/work-orders/10000621')

      cy.wait(['@operativesWorkOrder', '@property', '@task'])
      cy.contains('WO 10000621')
      cy.get('div[class*="Multibutton"]').should('not.exist')
      cy.get('a[id="caut-alerts"]').click()

      cy.contains('Cautionary alerts')
      cy.get('[data-row-id=15]').within(() => {
        cy.get('.text-dark-red').contains('CV')
        cy.get('.text-dark-red').contains('No Lone Visits')
      })

      cy.get('[data-row-id=23]').within(() => {
        cy.get('.text-dark-red').contains('VA')
        cy.get('.text-dark-red').contains('Verbal Abuse or Threat of')
      })
    })

    it('shows list of cautionary alerts page without highlighted codes', () => {
      cy.visit('/')

      cy.get('a[id="cautionary-alerts"]').click()

      cy.contains('Cautionary alerts')
      cy.get('[data-row-id=15]').within(() => {
        cy.get('.text-dark-red').should('not.exist')
        cy.get('.text-dark-red').should('not.exist')
      })

      cy.get('[data-row-id=23]').within(() => {
        cy.get('.text-dark-red').should('not.exist')
        cy.get('.text-dark-red').should('not.exist')
      })
    })

    it('shows links to expand description text, if text is more than 3 lines', () => {
      cy.visit('/operatives/1/work-orders/10000621')

      cy.wait(['@operativesWorkOrder', '@property', '@task'])
      cy.contains('WO 10000621')

      // contains not full description, checks for css class that hides the rest of the text (.truncate-line-3)
      cy.contains('Description')
      cy.get('.truncate-line-3').within(() => {
        cy.contains(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse'
        )
      })
      cy.get('a').contains('show more').click()
      //css class responsible for hiding the rest of the text should not exist
      cy.get('.truncate-line-3').should('not.exist')
      cy.get('a').contains('show more').should('not.exist')
      //full text
      cy.contains(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      )

      cy.get('a').contains('show less').click()
      //hides full text
      cy.get('.truncate-line-3').within(() => {
        cy.contains(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse'
        )
      })
    })
  })
})
