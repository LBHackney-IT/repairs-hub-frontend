/// <reference types="cypress" />

describe('Closing a work order that needs approval - when logged in as an operative', () => {
  const workOrderReference = '10000621'
  const propertyReference = '00012345'

  beforeEach(() => {
    cy.fixture('workOrders/workOrder.json').then((workOrder) => {
      workOrder.contractorReference = 'H06'
      cy.intercept(`/api/workOrders/${workOrderReference}`, {
        body: workOrder,
      }).as('workOrderRequest')
    })

    cy.intercept(
      {
        method: 'GET',
        path: `/api/workOrders/appointments/${workOrderReference}`,
      },
      { fixture: 'workOrderAppointments/noAppointment.json' }
    )

    cy.intercept(
      { method: 'GET', path: `/api/properties/${propertyReference}` },
      { fixture: 'properties/property.json' }
    )

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/images/${workOrderReference}` },
      { body: [] }
    )

    cy.intercept(
      { method: 'GET', path: `/api/properties/${propertyReference}/alerts` },
      { body: { alerts: [] } }
    )

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/${workOrderReference}/tasks` },
      { fixture: 'workOrders/tasksAndSorsUnvaried.json' }
    )

    cy.intercept(
      { method: 'GET', path: '/api/operatives/hu0001/workorders' },
      { body: [] }
    )

    cy.intercept(
      { method: 'GET', path: '/api/simple-feature-toggle' },
      { body: { enableCompletionApprovalStep: true } }
    )

    cy.loginWithOperativeRole()
    Cypress.expose('IsCurrentOperativeOvertime', false)
    cy.clearFilesDatabase()
  })

  it('shows the approval notice on the close form only when the visit is completed', () => {
    cy.visit(`/operatives/1/work-orders/${workOrderReference}`)
    cy.wait('@workOrderRequest')

    cy.contains('button', 'Confirm').click()

    cy.get('[data-testid=completion-approval-notice]').should('not.exist')

    cy.contains('label', 'Visit completed').click()

    cy.get('[data-testid=completion-approval-notice]').within(() => {
      cy.contains('This job needs approval before it is completed')
    })

    cy.contains('label', 'No access').click()

    cy.get('[data-testid=completion-approval-notice]').should('not.exist')
  })
})
