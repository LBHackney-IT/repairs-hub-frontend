/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Printing', () => {
  beforeEach(() => {
    cy.loginWithContractorRole()

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012' },
      { fixture: 'workOrders/workOrder.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10000012' },
      {
        fixture: 'workOrderAppointments/noAppointment.json',
      }
    )
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/notes' },
      { fixture: 'workOrders/notes.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { body: [] }
    )
    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders?propertyReference=00012345*',
      },
      { body: [] }
    )
  })

  it('Shows a print option for a work order', () => {
    cy.visit('/work-orders/10000012')

    cy.get('[data-testid=details] > .govuk-button').click()
    cy.get('[data-testid="details"]').contains('Print').click({ force: true })

    cy.contains('[href$=print]', 'Print')
  })
})
