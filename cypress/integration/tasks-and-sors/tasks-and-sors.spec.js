/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Tasks and SORs', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    // Stub requests
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012' },
      { fixture: 'workOrders/workOrder.json' }
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

  it('Displays tasks and sors relating to a work order', () => {
    cy.visit('/work-orders/10000012')

    cy.get('.govuk-tabs__list-item--selected a').contains('Tasks and SORs')
    cy.get('#tasks-and-sors-tab').within(() => {
      cy.get('.lbh-heading-h2').contains('Tasks and SORs')

      cy.contains('Latest Tasks and SORs')
      cy.get('.govuk-table.latest-tasks-and-sors-table').within(() => {
        // Tasks and SORS table headers
        cy.contains('th', 'SOR')
        cy.contains('th', 'Description')
        cy.contains('th', 'Date added')
        cy.contains('th', 'Quantity (est.)')
        cy.contains('th', 'Unit cost')
        cy.contains('th', 'Cost (est.)')

        // Tasks and SORS table rows
        cy.get('[data-row-id="0"]').within(() => {
          cy.contains('DES5R013')
          cy.contains('Inspect additional sec entrance')
          cy.contains('3 Feb 2021, 11:33')
          cy.contains('5')
          cy.contains('0')
          cy.contains('0')
        })
        cy.get('[data-row-id="1"]').within(() => {
          cy.contains('DES5R005')
          cy.contains('Normal call outs')
          cy.contains('3 Feb 2021, 11:23')
          cy.contains('4')
          cy.contains('0')
          cy.contains('0')
        })
        cy.get('[data-row-id="2"]').within(() => {
          cy.contains('DES5R006')
          cy.contains('Urgent call outs')
          cy.contains('3 Feb 2021, 09:33')
          cy.contains('2')
          cy.contains('10')
          cy.contains('20')
        })
      })

      cy.contains('Original Tasks and SORs')
      cy.get('.govuk-table.original-tasks-and-sors-table').within(() => {
        // Tasks and SORS table headers
        cy.contains('th', 'SOR')
        cy.contains('th', 'Description')
        cy.contains('th', 'Date added')
        cy.contains('th', 'Quantity (est.)')
        cy.contains('th', 'Unit cost')
        cy.contains('th', 'Cost (est.)')

        // Tasks and SORS table rows
        cy.get('[data-row-id="0"]').within(() => {
          cy.contains('DES5R006')
          cy.contains('Urgent call outs')
          cy.contains('3 Feb 2021, 09:33')
          cy.contains('1')
          cy.contains('10')
          cy.contains('10')
        })
      })
    })

    // Run lighthouse audit for accessibility report
    cy.audit()
  })

  it('Navigate directly to tasks and sors tab', () => {
    cy.visit('/work-orders/10000012#tasks-and-sors-tab')
    // Tasks and SORs tab should be active
    cy.get('.govuk-tabs__list-item--selected a').contains('Tasks and SORs')
    cy.get('#tasks-and-sors-tab').within(() => {
      cy.get('.lbh-heading-h2').contains('Tasks and SORs')

      cy.get('.govuk-table').within(() => {
        // Tasks and SORS table headers
        cy.contains('th', 'SOR')
        cy.contains('th', 'Description')
        cy.contains('th', 'Date added')
        cy.contains('th', 'Quantity (est.)')
        cy.contains('th', 'Unit cost')
        cy.contains('th', 'Cost (est.)')
      })
    })

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
