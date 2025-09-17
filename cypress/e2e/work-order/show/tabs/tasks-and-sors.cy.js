/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Tasks and SORs', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/new' },
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
      {
        method: 'GET',
        path:
          '/api/workOrders/?propertyReference=00012345&PageSize=50&PageNumber=1',
      },
      { fixture: 'workOrders/workOrders.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { fixture: 'workOrders/tasksAndSors.json' }
    )
  })

  it('Displays tasks, sors and budget code relating to a work order', () => {
    cy.visit('/work-orders/10000012')

    cy.contains('.tabs-button', 'Tasks and SORs')

    cy.get('#tasks-and-sors-tab').within(() => {
      cy.get('.lbh-heading-h2').contains('Tasks and SORs')

      cy.contains('Latest Tasks and SORs Added on 5 Feb 2021, 09:33')
      cy.get('.govuk-table.latest-tasks-and-sors-table').within(() => {
        // Tasks and SORS table headers
        cy.contains('th', 'SOR')
        cy.contains('th', 'Description')
        cy.contains('th', 'Quantity (est.)')
        cy.contains('th', 'Unit cost')
        cy.contains('th', 'Cost (est.)')
        cy.contains('th', 'Total SMV')

        // Tasks and SORS table rows
        cy.get('[data-row-id="0"]').within(() => {
          cy.contains('DES5R013')
          cy.contains('Inspect additional sec entrance')
          cy.contains('5')
          cy.contains('0')
          cy.contains('0')
          cy.contains('75')
        })
        cy.get('[data-row-id="1"]').within(() => {
          cy.contains('DES5R005')
          cy.contains('Normal call outs')
          cy.contains('4')
          cy.contains('0')
          cy.contains('0')
          cy.contains('60')
        })
        cy.get('[data-row-id="2"]').within(() => {
          cy.contains('DES5R006')
          cy.contains('Urgent call outs')
          cy.contains('2')
          cy.contains('10')
          cy.contains('20')
          cy.contains('30')
        })

        cy.get('[data-row-id="3"]').within(() => {
          cy.contains('Total')
          cy.contains('£20.00')
          cy.contains('165')
        })
      })

      cy.contains('Original Tasks and SORs Added on 3 Feb 2021, 09:33')
      cy.get('.govuk-table.original-tasks-and-sors-table').within(() => {
        // Tasks and SORS table headers
        cy.contains('th', 'SOR')
        cy.contains('th', 'Description')
        cy.contains('th', 'Quantity (est.)')
        cy.contains('th', 'Unit cost')
        cy.contains('th', 'Cost (est.)')
        cy.contains('th', 'Total SMV')

        // Tasks and SORS table rows
        cy.get('[data-row-id="0"]').within(() => {
          cy.contains('DES5R006')
          cy.contains('Urgent call outs')
          cy.contains('1')
          cy.contains('10')
          cy.contains('10')
          cy.contains('15')
        })

        cy.get('[data-row-id="1"]').within(() => {
          cy.contains('Total')
          cy.contains('£10.00')
          cy.contains('15')
        })
      })

      cy.contains('Budget code – Subjective:')
      cy.contains('H2555 - 200108 Gutter Clearance')
    })
  })

  it('Navigate directly to tasks and sors tab', () => {
    cy.visit('/work-orders/10000012#tasks-and-sors-tab')
    // Tasks and SORs tab should be active
    cy.contains('.tabs-button', 'Tasks and SORs')
    cy.get('#tasks-and-sors-tab').within(() => {
      cy.get('.lbh-heading-h2').contains('Tasks and SORs')

      cy.get('.govuk-table th').contains('SOR')
      cy.get('.govuk-table th').contains('Description')
      cy.get('.govuk-table th').contains('Quantity (est.)')
      cy.get('.govuk-table th').contains('Unit cost')
      cy.get('.govuk-table th').contains('Cost (est.)')
      cy.get('.govuk-table th').contains('Total SMV')
    })
  })
})
