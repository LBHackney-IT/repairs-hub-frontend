/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Tasks and SORs', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.server()
    // Stub requests
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.fixture('work-orders/work-orders.json').as('workOrders')
    cy.route('GET', 'api/workOrders/?propertyReference=00012345', '@workOrders')
    cy.fixture('work-orders/notes.json').as('notes')
    cy.route('GET', 'api/workOrders/10000012/notes', '@notes')
    cy.fixture('work-orders/work-order.json').as('workOrder')
    cy.route('GET', 'api/workOrders/10000012', '@workOrder')
    cy.fixture('work-orders/tasks-and-sors.json').as('tasksAndSors')
    cy.route('GET', 'api/workOrders/10000012/tasks', '@tasksAndSors')
  })

  it('Displays tasks and sors relating to a work order', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    // Repairs history tab should be active
    cy.get('.govuk-tabs__list-item--selected a').contains('Repairs history')
    // Now select Tasks and SORs tab
    cy.get('a[id="tab_tasks-and-sors-tab"]').click()
    cy.get('#tasks-and-sors-tab').within(() => {
      cy.get('.lbh-heading-l').contains('Tasks and SORs')

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
          cy.contains('3 Feb 2021, 11:33 am')
          cy.contains('5')
          cy.contains('0')
          cy.contains('0')
        })
        cy.get('[data-row-id="1"]').within(() => {
          cy.contains('DES5R005')
          cy.contains('Normal call outs')
          cy.contains('3 Feb 2021, 11:23 am')
          cy.contains('4')
          cy.contains('0')
          cy.contains('0')
        })
        cy.get('[data-row-id="2"]').within(() => {
          cy.contains('DES5R006')
          cy.contains('Urgent call outs')
          cy.contains('3 Feb 2021, 9:33 am')
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
          cy.contains('3 Feb 2021, 9:33 am')
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
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012#tasks-and-sors-tab`)
    // Tasks and SORs tab should be active
    cy.get('.govuk-tabs__list-item--selected a').contains('Tasks and SORs')

    cy.get('#tasks-and-sors-tab').within(() => {
      cy.get('.lbh-heading-l').contains('Tasks and SORs')

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
  })
})
