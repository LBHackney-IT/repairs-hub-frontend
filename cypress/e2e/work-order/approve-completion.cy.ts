/// <reference types="cypress" />

describe('Approving the completion of a work order', () => {
  beforeEach(() => {
    cy.loginWithCompletionApprovalManagerRole()

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012' },
      { fixture: 'workOrders/statusCompletionPendingApproval.json' }
    ).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10000012' },
      { fixture: 'workOrderAppointments/noAppointment.json' }
    )

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { fixture: 'workOrders/task.json' }
    ).as('tasksRequest')

    cy.intercept(
      { method: 'POST', path: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('jobStatusUpdateRequest')
  })

  it('approves the completion from the work order page', () => {
    cy.visit('/work-orders/10000012')

    cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

    cy.get('[data-testid=details] summary').click()
    cy.contains('label', 'Approve Completion').click()
    cy.contains('a', 'Approve Completion')
      .should('have.attr', 'href', '/work-orders/10000012/approve-completion')
      .click()

    cy.url().should('contain', '/work-orders/10000012/approve-completion')
    cy.contains('Approving will complete this work order')

    cy.get('#note').type('Certificate checked')
    cy.get('[type="submit"]').contains('Approve completion').click()

    cy.wait('@jobStatusUpdateRequest')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: { id: '10000012' },
        comments: 'Certificate checked',
        typeCode: '0',
        otherType: 'approveCompletion',
      })

    cy.get('.govuk-panel').within(() => {
      cy.get('.govuk-panel__title').contains('Work order completion approved')
    })
  })
})
