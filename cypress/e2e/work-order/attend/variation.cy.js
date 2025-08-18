/// <reference types="cypress" />

import 'cypress-audit/commands'

context('when a variation is made', () => {
  beforeEach(() => {
    cy.intercept('/api/workOrders/10000621', {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10000621' },
      {
        fixture: 'workOrderAppointments/noAppointment.json',
      }
    )

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/images/10000621' },
      { body: [] }
    ).as('photosRequest')

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000621/tasks' },
      { fixture: 'workOrders/tasksAndSors.json' }
    ).as('tasksRequest')

    cy.intercept(
      { method: 'POST', path: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('jobStatusUpdateRequest')

    cy.loginWithOperativeRole()
  })

  it('requires a variation reason, makes a jobStatusUpdate request and shows the completion page', () => {
    cy.visit('/operatives/1/work-orders/10000621')

    cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

    cy.get('form').within(() => {
      cy.contains('button', 'Confirm').click()

      cy.get('#variationReason-form-group').contains('Please enter a reason')

      cy.get('textarea').type('x'.repeat(251))

      cy.contains('button', 'Confirm').click()

      cy.contains('You have exceeded the maximum amount of characters')

      cy.get('textarea').clear().type('More work was needed')

      cy.contains('button', 'Confirm').click()
    })

    cy.get('@jobStatusUpdateRequest')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000621',
        },
        comments: 'More work was needed',
        typeCode: '80',
        moreSpecificSORCode: {
          rateScheduleItem: [
            {
              id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbh',
              customCode: 'DES5R013',
              customName: 'Inspect additional sec entrance',
              quantity: {
                amount: [5],
              },
            },
            {
              id: 'bde7c53b-8947-414c-b88f-9c5e3d875cbg',
              customCode: 'DES5R005',
              customName: 'Normal call outs',
              quantity: {
                amount: [4],
              },
            },
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              customCode: 'DES5R006',
              customName: 'Urgent call outs',
              quantity: {
                amount: [2],
              },
            },
          ],
        },
      })

    cy.contains('h1', 'Close work order')
  })
})
