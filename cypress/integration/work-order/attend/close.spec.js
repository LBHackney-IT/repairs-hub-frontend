/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Closing my own work order', () => {
  const now = new Date('Friday June 11 2021 13:49:15Z')

  beforeEach(() => {
    cy.intercept('/api/workOrders/10000621', {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000621/tasks' },
      { fixture: 'workOrders/tasksAndSorsUnvaried.json' }
    ).as('tasksRequest')

    cy.intercept(
      { method: 'POST', path: '/api/workOrderComplete' },
      { body: '' }
    ).as('workOrderCompleteRequest')

    cy.intercept(
      { method: 'GET', path: '/api/operatives/hu0001/workorders' },
      { body: [] }
    )

    cy.loginWithOperativeRole()
  })

  context('during normal working hours', () => {
    beforeEach(() => {
      cy.clock(new Date(now).setHours(12, 0, 0))
    })

    it('overtime selection is not possible', () => {
      cy.visit('/operatives/1/work-orders/10000621')

      cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

      cy.get('[data-testid=isOvertime]').should('not.exist')
    })
  })

  context('when outside working hours (overtime could apply)', () => {
    beforeEach(() => {
      cy.clock(new Date(now).setHours(16, 0, 1))
    })

    context('and the overtime payment type is chosen', () => {
      it('makes a POST request for completion with overtime, confirms success, and returns me to the index', () => {
        cy.visit('/operatives/1/work-orders/10000621')

        cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

        cy.get('[data-testid=isOvertime]').should('not.be.checked')

        cy.get('[data-testid=isOvertime]').check()

        cy.contains('button', 'Confirm').click()

        cy.get('.govuk-button').contains('Close work order').click()

        cy.get('#notes').type('I attended')

        cy.get('.govuk-form-group--error').contains(
          'Please select a reason for closing the work order'
        )

        cy.get('.lbh-radios input[type="radio"]').check('Work Order Completed') // Checking by value, not text

        cy.get('.govuk-button').contains('Close work order').click()

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should('deep.equal', {
            workOrderReference: {
              id: '10000621',
              description: '',
              allocatedBy: '',
            },
            jobStatusUpdates: [
              {
                typeCode: '0',
                otherType: 'complete',
                comments: 'Work order closed - I attended - Overtime',
                eventTime: new Date(now.setHours(16, 0, 1)).toISOString(),
                isOvertime: true,
              },
            ],
          })

        cy.get('.modal-container').within(() => {
          cy.contains('Work order 10000621 successfully completed')

          cy.get('[data-testid="modal-close"]').click()
        })

        cy.get('.modal-container').should('not.exist')

        cy.get('.lbh-heading-h2').contains('Friday 11 June')
      })
    })

    context('when no particular payment type is chosen', () => {
      it('makes a POST request for completion without overtime, confirm success, and returns me to the index', () => {
        cy.visit('/operatives/1/work-orders/10000621')

        cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

        cy.get('[data-testid=isOvertime]').should('not.be.checked')

        cy.contains('button', 'Confirm').click()

        cy.get('.govuk-button').contains('Close work order').click()

        cy.get('#notes').type('I attended')

        cy.get('.govuk-form-group--error').contains(
          'Please select a reason for closing the work order'
        )

        cy.get('.lbh-radios input[type="radio"]').check('Work Order Completed') // Checking by value, not text

        cy.get('.govuk-button').contains('Close work order').click()

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should('deep.equal', {
            workOrderReference: {
              id: '10000621',
              description: '',
              allocatedBy: '',
            },
            jobStatusUpdates: [
              {
                typeCode: '0',
                otherType: 'complete',
                comments: 'Work order closed - I attended',
                eventTime: new Date(now.setHours(16, 0, 1)).toISOString(),
                isOvertime: false,
              },
            ],
          })

        cy.get('.modal-container').within(() => {
          cy.contains('Work order 10000621 successfully completed')

          cy.get('[data-testid="modal-close"]').click()
        })

        cy.get('.modal-container').should('not.exist')

        cy.get('.lbh-heading-h2').contains('Friday 11 June')
      })
    })
  })
})
