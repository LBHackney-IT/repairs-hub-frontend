/// <reference types="cypress" />

import 'cypress-audit/commands'

// Mock date
const now = new Date('Mon Jan 18 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Cancel work order', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
    cy.server()
    cy.fixture('repairs/work-order.json').as('workOrder')
    cy.fixture('properties/property.json').as('property')
    cy.fixture('repairs/notes.json').as('notes')

    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/repairs/10000012', '@workOrder')
    cy.route('GET', 'api/repairs/10000012/notes', '@notes')
    cy.route({
      method: 'POST',
      url: '/api/workOrderComplete',
      response: '',
    }).as('apiCheck')

    cy.clock(now)
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
  })

  it('Cancel a work order', () => {
    // Work order view page has a link to cancel work order
    cy.contains('Cancel Works Order')
      .should('have.attr', 'href', '/work-orders/10000012/cancel')
      .click()

    cy.url().should('contains', '/work-orders/10000012/cancel')
    cy.get('.govuk-caption-l').contains('Cancel repair')
    cy.get('.lbh-heading-l').contains('Works order: 10000012')
    cy.get('.govuk-table').within(() => {
      // Property and description
      cy.get('#property').within(() => {
        cy.get('.govuk-table__header').contains('Property')
        cy.get('.govuk-table__cell').contains(
          '16 Pitcairn House St Thomass Square'
        )
      })
      cy.get('#tradeDescription').within(() => {
        cy.get('.govuk-table__header').contains('Trade')
        cy.get('.govuk-table__cell').contains('DOOR ENTRY ENGINEER - DE')
      })
      cy.get('#description').within(() => {
        cy.get('.govuk-table__header').contains('Description')
        cy.get('.govuk-table__cell').contains(
          'This is an urgent repair description'
        )
      })
    })

    // Form section
    cy.get('.lbh-heading-h2').within(() => {
      cy.contains('Reason to cancel')
    })
    // Submit form without entering required fields
    cy.get('[type="submit"]').contains('Cancel repair').click()
    cy.get('#cancelReason-form-group .govuk-error-message').within(() => {
      cy.contains('Please enter a reason')
    })

    // Enter a reason for cancelling the work order
    // Go over the character limit
    cy.get('#cancelReason').get('.govuk-textarea').type('x'.repeat(201))
    cy.get('#cancelReason-form-group .govuk-error-message').within(() => {
      cy.contains('You have exceeded the maximum amount of characters')
    })
    // Within the character limit
    cy.get('#cancelReason')
      .get('.govuk-textarea')
      .clear()
      .type('Made by mistake')
    cy.get('.govuk-hint').within(() => {
      cy.contains('You have 185 characters remaining.')
    })
    // Hidden work order reference input field
    cy.get('#cancel-work-order-form').within(() => {
      cy.get('input[id="workOrderReference"]').should('have.value', '10000012')
    })

    // Submit form
    cy.get('[type="submit"]').contains('Cancel repair').click()
    // Check post request body
    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        workOrderReference: {
          id: '10000012',
        },
        jobStatusUpdates: [
          {
            typeCode: 0,
            otherType: 'cancel',
            comments: 'Cancelled: Made by mistake',
            eventTime: '2021-01-18T16:27:20.000Z',
          },
        ],
      })

    // Cancel work order confirmation screen
    cy.get('.govuk-panel--confirmation').within(() => {
      cy.get('.lbh-heading-xl').contains('Repair cancelled')
      cy.get('.govuk-panel__body').contains(
        'Works order 10000012 has been cancelled'
      )
    })

    cy.get('.govuk-list').within(() => {
      cy.contains('New repair for 16 Pitcairn House St Thomass Square').should(
        'have.attr',
        'href',
        '/properties/00012345/raise-repair/new'
      )

      cy.contains('Start a new search').should('have.attr', 'href', '/')

      cy.contains('Back to work order').should(
        'have.attr',
        'href',
        '/work-orders/10000012'
      )
    })
  })
})
