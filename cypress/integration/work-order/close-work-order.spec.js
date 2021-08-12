/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Closing a work order', () => {
  describe('When the work order does not require operative assignment', () => {
    beforeEach(() => {
      cy.loginWithContractorRole()

      // Viewing the home page
      cy.intercept(
        { method: 'GET', path: '/api/filter/WorkOrder' },
        {
          fixture: 'filter/workOrder.json',
        }
      ).as('workOrderFilters')

      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders/?PageSize=10&PageNumber=1&IncludeHistorical=false',
        },
        { fixture: 'workOrders/workOrders.json' }
      ).as('workOrders')

      // Viewing the work order page
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000040
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040' },
          { body: workOrder }
        )
      })
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      )
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&IncludeHistorical=false',
        },
        { body: [] }
      )

      // Submitting the update
      cy.intercept(
        { method: 'POST', path: '/api/workOrderComplete' },
        { body: '' }
      ).as('apiCheck')
    })

    it('takes you to close page', () => {
      cy.visit('/')

      cy.get('.govuk-table__cell').within(() => {
        cy.contains('a', '10000040').click()
      })

      cy.get('[data-testid="details"]').contains('Close').click({ force: true })

      cy.get('.govuk-grid-column-one-third').within(() => {
        cy.contains('a', 'Close')
          .should('have.attr', 'href', '/work-orders/10000040/close')
          .click()
      })
    })

    it('shows errors when submit with no inputs', () => {
      cy.visit('/work-orders/10000040/close')

      cy.get('form').within(() => {
        cy.get('[type="submit"]').contains('Submit').click()
      })
      cy.contains('Summary of updates to work order').should('not.exist')
      cy.get('form').within(() => {
        cy.contains('Please select a reason for closing the work order')
        cy.contains('Please pick completion date')
        cy.contains('Please enter a valid time')
      })
    })

    it('shows errors when the raised date is after the completed date', () => {
      cy.visit('/work-orders/10000040/close')

      cy.get('form').within(() => {
        cy.get('#date').type('2021-01-17') //Raised on 2021-01-18
        cy.get('#time').within(() => {
          cy.get('#time-time').type('32')
          cy.get('#time-minutes').type('66')
        })
        cy.get('#notes').type('test')
        cy.get('[type="submit"]').contains('Submit').click()
      })

      cy.get('form').within(() => {
        cy.contains('Completion date must be on or after 18/01/2021')
      })
    })

    it('submits the form with inputs that are invalid', () => {
      cy.visit('/work-orders/10000040/close')

      cy.get('form').within(() => {
        cy.get('#date').type('2028-01-15')
        cy.get('#time').within(() => {
          cy.get('#time-time').type('32')
          cy.get('#time-minutes').type('66')
        })
        cy.get('#notes').type('test')
        cy.get('[type="submit"]').contains('Submit').click()
      })
      // Check validation or similar messages - to check, reuse existing if possible
      cy.get('form').within(() => {
        cy.contains('Please select a date that is in the past')
        cy.contains('Please enter a valid time')
      })
    })

    it('submits the form with valid inputs and allows to edit them from summary page', () => {
      cy.visit('/work-orders/10000040/close')

      cy.get('.operatives').should('not.exist')

      // Enter 19 Janurary 2021 at 14:45
      cy.get('form').within(() => {
        cy.get('[type="radio"]')
          .first()
          .should('have.value', 'Work Order Completed')
        cy.get('[type="radio"]').last().should('have.value', 'No Access')
        //choose No Access reason
        cy.get('[type="radio"]').last().check()
        cy.get('#date').type('2021-01-19')
        cy.get('#time').within(() => {
          cy.get('#time-time').clear()
          cy.get('#time-minutes').clear()
          cy.get('#time-time').type('14')
          cy.get('#time-minutes').type('45')
        })
        cy.get('#notes').type('This has been repaired.')
        cy.get('[type="submit"]').contains('Submit').click()
      })
      cy.contains('Summary of updates to work order')
      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/01/19')
      cy.get('.govuk-table__row').contains('14:45')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('No Access')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains('This has been repaired.')
      // Go back and edit some inputs
      cy.get('.govuk-table__row').within(() => {
        cy.contains('Edit').click()
      })
      // Enter 19 February 2021 at 13:01
      cy.get('form').within(() => {
        cy.get('[type="radio"]').first().check()
        cy.get('#date').type('2021-02-19')
        cy.get('#time').within(() => {
          cy.get('#time-time').clear()
          cy.get('#time-minutes').clear()
          cy.get('#time-time').type('13')
          cy.get('#time-minutes').type('01')
        })
        cy.get('#notes').type(
          'This has been repaired and I forgot I did it on a completely different date and time.'
        )
        cy.get('[type="submit"]').contains('Submit').click()
      })
      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/02/19')
      cy.get('.govuk-table__row').contains('13:01')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('Work Order Completed')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains(
        'This has been repaired and I forgot I did it on a completely different date and time.'
      )

      cy.get('.govuk-table__row').contains('Operatives').should('not.exist')

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.get('@apiCheck')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: '10000040',
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '0',
              otherType: 'complete',
              comments:
                'Work order closed - This has been repaired.This has been repaired and I forgot I did it on a completely different date and time.',
              eventTime: '2021-02-19T13:01:00.000Z',
            },
          ],
        })

      cy.wait(['@workOrderFilters', '@workOrders'])

      cy.location('pathname').should('equal', '/')
      cy.contains('Manage work orders')

      cy.requestsCountByUrl('/api/jobStatusUpdate').should('eq', 0)

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    // Closing work order becasue of No Access

    it('submits the form with closing reason: No Access', () => {
      cy.visit('/work-orders/10000040/close')

      // Enter 19 January 2021 at 13:01
      cy.get('form').within(() => {
        cy.get('[type="radio"]')
          .first()
          .should('have.value', 'Work Order Completed')
        cy.get('[type="radio"]').last().should('have.value', 'No Access')
        //choose No Access reason
        cy.get('[type="radio"]').last().check()
        cy.get('#date').type('2021-01-19')
        cy.get('#time').within(() => {
          cy.get('#time-time').clear()
          cy.get('#time-minutes').clear()
          cy.get('#time-time').type('13')
          cy.get('#time-minutes').type('01')
        })
        cy.get('#notes').type('Tenant was not at home')
        cy.get('[type="submit"]').contains('Submit').click()
      })
      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/01/19')
      cy.get('.govuk-table__row').contains('13:01')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('No Access')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains('Tenant was not at home')
      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.get('@apiCheck')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: '10000040',
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '70',
              otherType: 'complete',
              comments: 'Work order closed - Tenant was not at home',
              eventTime: '2021-01-19T13:01:00.000Z',
            },
          ],
        })

      cy.location('pathname').should('equal', '/')
      cy.contains('Manage work orders')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  describe('When the order requires operative assignment', () => {
    describe('And the workorder has existing operatives assigned', () => {
      beforeEach(() => {
        cy.loginWithContractorRole()

        // Viewing the home page
        cy.intercept(
          { method: 'GET', path: '/api/filter/WorkOrder' },
          {
            fixture: 'filter/workOrder.json',
          }
        ).as('workOrderFilters')
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/?PageSize=10&PageNumber=1' },
          { fixture: 'workOrders/workOrders.json' }
        ).as('workOrders')

        // Viewing the work order page
        cy.fixture('workOrders/workOrder.json').then((workOrder) => {
          workOrder.reference = 10000040
          workOrder.canAssignOperative = true
          workOrder.operatives = [
            {
              id: 1,
              name: 'Operative A',
            },
            {
              id: 2,
              name: 'Operative B',
            },
            {
              id: 3,
              name: 'Operative C',
            },
          ]
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000040' },
            { body: workOrder }
          ).as('workOrder')
        })

        cy.intercept(
          { method: 'GET', path: '/api/operatives' },
          {
            body: [
              {
                id: 1,
                name: 'Operative A',
              },
              {
                id: 2,
                name: 'Operative B',
              },
              {
                id: 3,
                name: 'Operative C',
              },
              {
                id: 25,
                name: 'Operative Y',
              },
              {
                id: 26,
                name: 'Operative Z',
              },
            ],
          }
        ).as('operatives')

        // Submitting the update
        cy.intercept(
          { method: 'POST', path: '/api/workOrderComplete' },
          { body: '' }
        ).as('workOrderCompleteRequest')

        cy.intercept(
          { method: 'POST', path: '/api/jobStatusUpdate' },
          { body: '' }
        ).as('jobStatusUpdateRequest')
      })

      it('requires the submission of at least one operative', () => {
        cy.visit('/work-orders/10000040/close')

        cy.wait('@workOrder')
        cy.wait('@operatives')

        cy.get('[type="radio"]').last().check()
        cy.get('#date').type('2021-01-19')
        cy.get('#time').within(() => {
          cy.get('#time-time').type('13')
          cy.get('#time-minutes').type('01')
        })
        cy.get('#notes').type('A note')

        cy.get('.operatives').within(() => {
          cy.get('input[list]').should('have.length', 3)

          cy.get('input[list]').eq(0).should('have.value', 'Operative A [1]')
          cy.get('input[list]').eq(1).should('have.value', 'Operative B [2]')
          cy.get('input[list]').eq(2).should('have.value', 'Operative C [3]')
        })

        cy.get('.operatives').within(() => {
          cy.get('input[list]').should('have.length', 3)

          cy.get('input[list]').eq(0).should('have.value', 'Operative A [1]')
          cy.get('input[list]').eq(1).should('have.value', 'Operative B [2]')
          cy.get('input[list]').eq(2).should('have.value', 'Operative C [3]')
        })

        cy.get('[type="submit"]').contains('Submit').click()

        cy.get('.govuk-table__row')
          .contains('Operatives')
          .parent()
          .within(() => {
            cy.contains('Operative A, Operative B, Operative C')
            cy.get('a').contains('Edit').click()
          })

        cy.get('.operatives').within(() => {
          cy.get('input[list]').eq(0).clear()
          cy.get('input[list]').eq(1).clear()
          cy.get('input[list]').eq(2).clear()
        })

        cy.get('[type="submit"]').contains('Submit').click()

        cy.get('.operatives').within(() => {
          cy.get('#operative-0-form-group').contains(
            'Please select an operative'
          )
          cy.get('#operative-1-form-group').contains(
            'Please select an operative'
          )
          cy.get('#operative-2-form-group').contains(
            'Please select an operative'
          )
        })

        cy.get('.operatives').within(() => {
          cy.get('[aria-label="Remove operative"]').click()
          cy.get('[aria-label="Remove operative"]').click()

          cy.get('input[list]').should('have.length', 1)

          cy.get('input[list]').eq(0).type('Operative Y [25]')
        })

        cy.get('[type="submit"]').contains('Submit').click() |
          cy
            .get('.govuk-table__row')
            .contains('Operatives')
            .parent()
            .within(() => {
              cy.contains('Operative Y')
              cy.get('a').contains('Edit').click()
            })

        cy.get('.operatives').within(() => {
          cy.get('a')
            .contains(/Add operative from list/)
            .click()

          cy.get('a')
            .contains(/Add operative from list/)
            .click()

          cy.get('input[list]').should('have.length', 3)

          cy.get('input[list]').eq(1).type('Operative Z [26]')
          cy.get('input[list]').eq(2).type('Operative Z [26]') // Intentional duplicate
        })

        cy.get('[type="submit"]').contains('Submit').click()

        cy.get('.govuk-table__row')
          .contains('Operatives')
          .parent()
          .within(() => {
            cy.contains('Operative Y, Operative Z')
          })

        cy.get('[type="submit"]').contains('Confirm and close').click()

        cy.wait('@jobStatusUpdateRequest')

        cy.get('@jobStatusUpdateRequest')
          .its('request.body')
          .should('deep.equal', {
            relatedWorkOrderReference: {
              id: '10000040',
            },
            operativesAssigned: [
              {
                identification: {
                  number: 25,
                },
              },
              {
                identification: {
                  number: 26,
                },
              },
            ],
            typeCode: '10',
          })

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should('deep.equal', {
            workOrderReference: {
              id: '10000040',
              description: '',
              allocatedBy: '',
            },
            jobStatusUpdates: [
              {
                typeCode: '70',
                otherType: 'complete',
                comments:
                  'Work order closed - A note - Assigned operatives Operative Y, Operative Z',
                eventTime: '2021-01-19T13:01:00.000Z',
              },
            ],
          })

        cy.requestsCountByUrl('api/jobStatusUpdate').should('eq', 1)

        cy.audit()
      })
    })

    describe('And the workorder has no existing operatives assigned', () => {
      beforeEach(() => {
        cy.loginWithContractorRole()

        // Viewing the work order page
        cy.fixture('workOrders/workOrder.json').then((workOrder) => {
          workOrder.reference = 10000040
          workOrder.contractorReference = 'H10' // DLO contractor reference
          workOrder.canAssignOperative = true
          workOrder.operatives = []
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000040' },
            { body: workOrder }
          ).as('workOrder')
        })

        cy.intercept(
          { method: 'GET', path: '/api/operatives' },
          {
            body: [],
          }
        ).as('operatives')
      })

      it('requires the submission of at least one operative', () => {
        cy.visit('/work-orders/10000040/close')

        cy.wait('@workOrder')
        cy.wait('@operatives')

        cy.get('.operatives').within(() => {
          cy.get('input[list]').should('have.length', 1)

          cy.get('input[list]').eq(0).should('have.value', '')
        })

        cy.get('[type="submit"]').contains('Submit').click()

        cy.get('.operatives').within(() => {
          cy.get('#operative-0-form-group').contains(
            'Please select an operative'
          )
        })
      })
    })
  })
})
