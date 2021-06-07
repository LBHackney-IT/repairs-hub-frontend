/// <reference types="cypress" />

import 'cypress-audit/commands'

// Mock date
const now = new Date('Mon Jan 18 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Work order cancellations', () => {
  describe('when submitting a work order cancellation', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
      cy.server()
      cy.fixture('work-orders/work-order.json').as('workOrder')
      cy.fixture('properties/property.json').as('property')
      cy.fixture('work-orders/notes.json').as('notes')

      cy.route('GET', 'api/properties/00012345', '@property')
      cy.route('GET', 'api/workOrders/10000012', '@workOrder').as('workOrder')
      cy.route('GET', 'api/workOrders/?propertyReference=*', [])
      cy.route({
        method: 'POST',
        url: '/api/workOrderComplete',
        response: '',
      }).as('apiCheck')

      cy.clock(now)
      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
      cy.wait('@workOrder')
    })

    it('shows the confirmation page after a successful form submission', () => {
      // Work order view page has a link to cancel work order
      cy.get('.govuk-grid-column-one-third').within(() => {
        cy.contains('a', 'Cancel')
          .should('have.attr', 'href', '/work-orders/10000012/cancel')
          .click()
      })

      cy.wait('@workOrder')

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
        cy.get('input[id="workOrderReference"]').should(
          'have.value',
          '10000012'
        )
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
        cy.contains(
          'New repair for 16 Pitcairn House St Thomass Square'
        ).should('have.attr', 'href', '/properties/00012345/raise-repair/new')

        cy.contains('Start a new search').should('have.attr', 'href', '/')

        cy.contains('Back to work order').should(
          'have.attr',
          'href',
          '/work-orders/10000012'
        )
      })
    })
  })

  describe('Warning text', () => {
    describe('when the order is for a contractor scheduled internally', () => {
      beforeEach(() => {
        cy.loginWithAgentRole()
        cy.server()
        cy.fixture('work-orders/work-order.json')
          .then((workOrder) => {
            workOrder.contractorReference = 'H01' // an internally-scheduled contractor ref
          })
          .as('workOrder')

        cy.route('GET', 'api/workOrders/10000012', '@workOrder')

        cy.clock(now)
        cy.visit(`${Cypress.env('HOST')}/work-orders/10000012/cancel`)
      })

      it('shows warning text on the form', () => {
        cy.get('.lbh-warning-text')
          .contains('For immediate or emergency jobs contact planner first.')
          .should('exist')

        cy.get('.lbh-warning-text')
          .contains(
            'For next day jobs contact planners if before 3pm, contact repairs admin if after 3pm.'
          )
          .should('exist')

        cy.get('.lbh-warning-text')
          .contains(
            'For jobs on the current day contact the operative first. If they have already started work do not cancel.'
          )
          .should('exist')
      })
    })

    describe('when the order is scheduled outside of Hackney', () => {
      beforeEach(() => {
        cy.loginWithAgentRole()
        cy.server()
        cy.fixture('work-orders/work-order.json')
          .then((workOrder) => {
            workOrder.contractorReference = 'HCK' // an externally-scheduled contractor ref
          })
          .as('workOrder')

        cy.route('GET', 'api/workOrders/10000012', '@workOrder')

        cy.clock(now)
        cy.visit(`${Cypress.env('HOST')}/work-orders/10000012/cancel`)
      })

      it('does not show warning text on the form', () => {
        cy.get('.lbh-warning-text').should('not.exist')
      })
    })
  })
})
