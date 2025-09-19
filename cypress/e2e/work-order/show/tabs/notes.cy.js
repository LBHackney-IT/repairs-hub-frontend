/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Notes', () => {
  beforeEach(() => {
    // Stub requests
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
      { method: 'GET', path: '/api/workOrders/10000012/notes' },
      { fixture: 'workOrders/notes.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { body: [] }
    )
    cy.intercept(
      { method: 'POST', path: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('apiCheck')

    cy.loginWithAgentRole()
  })

  it('Fill out notes form and update the work order status', () => {
    cy.visit('/work-orders/10000012')
    // Tasks and SORs tab should be active
    cy.contains('.tabs-button', 'Tasks and SORs').click()

    // Now select Notes tab
    cy.contains('.tabs-button', 'Notes').click()
    cy.get('#notes-tab').within(() => {
      cy.get('.lbh-heading-h2').contains('Notes')
      // Form hidden by default
      cy.get('#note-form-group').should('not.exist')
      // Click to reveal form
      cy.contains('Add a new note').click()

      // Try submit form with no note
      cy.get('[type="submit"]').contains('Publish note').click()
      cy.get('#note-form-group .govuk-error-message').within(() => {
        cy.contains('Please enter a note')
      })

      // Enter a valid note
      cy.get('.govuk-textarea').clear().type('A note about the repair')
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
  })

  it('Displays notes as a timeline', () => {
    cy.visit('/work-orders/10000012')

    cy.contains('.tabs-button', 'Notes').click()

    cy.get('#notes-tab').within(() => {
      cy.get('.lbh-heading-h2').contains('Notes')

      cy.get('[data-note-id="0"]').within(() => {
        cy.get('.note-info').within(() => {
          cy.contains('8 Feb 2021, 15:06')
          cy.contains('by Random User (random.user@hackney.gov.uk)')
        })
      })
      cy.get('[data-note-id="1"]').within(() => {
        cy.get('.note-info').within(() => {
          cy.contains('8 Feb 2021, 15:05')
          cy.contains('by Random User (random.user@hackney.gov.uk)')
        })
      })
    })
  })

  it('Displays no notes message when there are no notes', () => {
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/notes' },
      { body: [] }
    )

    cy.visit('/work-orders/10000012')
    cy.contains('.tabs-button', 'Notes').click()

    cy.get('#notes-tab').within(() => {
      cy.get('.lbh-heading-h2').contains('Notes')
      cy.get('.lbh-body-s').contains('There are no notes for this work order.')
    })
  })

  it('Navigate directly to notes tab', () => {
    cy.visit('/work-orders/10000012?currentTab=notes-tab')
    // Notes tab should be active

    cy.contains('.tabs-button', 'Notes').should('have.class', 'active')

    cy.get('#notes-tab').within(() => {
      cy.get('.lbh-heading-h2').contains('Notes')
    })
  })
})
