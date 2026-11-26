/// <reference types="cypress" />

describe('Closing a work order that needs approval - when logged in as a contract manager closing on behalf of an operative', () => {
  beforeEach(() => {
    cy.loginWithContractManagerRole()

    cy.intercept({ method: 'GET', path: '/api/workOrders?*' }, { body: [] }).as(
      'workOrders'
    )

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000040/tasks' },
      { body: [] }
    )

    cy.fixture('workOrders/workOrder.json').then((workOrder) => {
      workOrder.reference = 10000040
      workOrder.paymentType = null
      workOrder.startTime = null
      workOrder.contractorReference = 'H06'
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000040' },
        { body: workOrder }
      ).as('workOrder')
    })

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10000040' },
      { fixture: 'workOrderAppointments/noAppointment.json' }
    )

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )

    cy.intercept(
      { method: 'POST', path: '/api/workOrderComplete' },
      { body: '' }
    ).as('workOrderCompleteRequest')

    cy.intercept(
      { method: 'GET', path: '/api/simple-feature-toggle' },
      { body: { enableCompletionApprovalStep: true } }
    )
  })

  it('shows the approval notice on the summary page when the visit is completed', () => {
    cy.visit('/work-orders/10000040/close')
    cy.wait('@workOrder')

    cy.get('form').within(() => {
      cy.contains('Reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'Visit completed').click()
          cy.contains('label', 'No further work required').click()
        })

      cy.get('#completionDate').type('2021-01-18')
      cy.get('[data-testid=completionTime-hour]').type('12')
      cy.get('[data-testid=completionTime-minutes]').type('45')
      cy.get('[type="submit"]').contains('Close work order').click()
    })

    cy.contains('Summary of updates to work order')
    cy.get('[data-testid=completion-approval-notice]').within(() => {
      cy.contains('This job needs approval before it is completed')
    })

    cy.get('[type="submit"]').contains('Confirm and close').click()

    cy.wait('@workOrderCompleteRequest')
    cy.get('.govuk-panel--confirmation').within(() => {
      cy.contains('Work order closed, completion pending approval')
    })
  })

  it('does not show the approval notice when closed with no access', () => {
    cy.visit('/work-orders/10000040/close')
    cy.wait('@workOrder')

    cy.get('form').within(() => {
      cy.contains('Reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'No access').click()
        })

      cy.get('#completionDate').type('2021-01-18')
      cy.get('[data-testid=completionTime-hour]').type('12')
      cy.get('[data-testid=completionTime-minutes]').type('45')
      cy.get('[type="submit"]').contains('Close work order').click()
    })

    cy.contains('Summary of updates to work order')
    cy.get('[data-testid=completion-approval-notice]').should('not.exist')
  })
})
