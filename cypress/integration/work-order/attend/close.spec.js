/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Closing my own work order', () => {
  const now = new Date('June 11 2021 13:49:15Z')

  beforeEach(() => {
    cy.clock(now)

    cy.intercept('/api/workOrders/10000012', {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.intercept(
      { method: 'POST', path: '/api/workOrderComplete' },
      { body: '' }
    ).as('workOrderCompleteRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/operatives/hu0001/workorders',
      },
      {
        fixture: 'operatives/workOrders.json',
      }
    ).as('workOrderIndex')

    cy.loginWithOperativeRole()
  })

  it('confirms success and returns me to the index', () => {
    cy.visit('work-orders/10000012/close')
    cy.wait('@workOrderRequest')

    cy.get('.govuk-button').contains('Close work order').click()

    cy.get('#notes').type('I attended')

    cy.url().should('match', /work-orders\/10000012\/close$/)

    cy.get('.govuk-form-group--error').contains(
      'Please select a reason for closing the work order'
    )

    cy.get('.lbh-radios input[type="radio"]').check('Work Order Completed') // Checking by value, not text

    cy.get('.govuk-button').contains('Close work order').click()

    cy.get('@workOrderCompleteRequest')
      .its('request.body')
      .should('deep.equal', {
        workOrderReference: {
          id: '10000012',
          description: '',
          allocatedBy: '',
        },
        jobStatusUpdates: [
          {
            typeCode: '0',
            otherType: 'complete',
            comments: 'Work order closed - I attended',
            eventTime: now.toISOString(),
          },
        ],
      })

    cy.get('.modal-window').within(() => {
      cy.contains('Work order 10000012 successfully completed')
    })

    cy.get('.lbh-heading-h1').contains('Friday, 11 June')
  })
})
