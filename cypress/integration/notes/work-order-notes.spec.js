/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Tasks and SORs', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.server()
    // Stub requests
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.fixture('repairs/work-orders.json').as('workOrders')
    cy.route('GET', 'api/repairs/?propertyReference=00012345', '@workOrders')
    cy.fixture('repairs/work-order.json').as('workOrder')
    cy.route('GET', 'api/repairs/10000012', '@workOrder')
    cy.route({
      method: 'POST',
      url: '/api/jobStatusUpdate',
      response: '',
    }).as('apiCheck')
  })

  it('Fill out notes form and update the job status', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    // Repairs history tab should be active
    cy.get('.govuk-tabs__list-item--selected a').contains('Repairs history')
    // Now select Notes tab
    cy.get('a[id="tab_notes-tab"]').click()
    cy.get('#notes-tab').within(() => {
      cy.get('.govuk-heading-l').contains('Notes')
      cy.contains('Add a new note').click()

      // Try submit form with no note
      cy.get('[type="submit"]').contains('Publish note').click()
      cy.get('#note-form-group .govuk-error-message').within(() => {
        cy.contains('Please enter a note')
      })

      // Enter a valid note
      cy.get('#note')
        .get('.govuk-textarea')
        .clear()
        .type('A note about the repair')
      // Submit form
      cy.get('[type="submit"]').contains('Publish note').click()
    })

    // Check body of post request
    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000012',
        },
        comments: 'A note about the repair',
        typeCode: '0',
        otherType: 'addNote',
      })

    // Run lighthouse audit for accessibility report
    cy.audit()
  })

  it('Navigate directly to notes tab', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012#notes-tab`)
    // Notes tab should be active
    cy.get('.govuk-tabs__list-item--selected a').contains('Notes')

    cy.get('#notes-tab').within(() => {
      cy.get('.govuk-heading-l').contains('Notes')
    })
  })
})
