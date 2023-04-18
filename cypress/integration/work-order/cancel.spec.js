/// <reference types="cypress" />

import 'cypress-audit/commands'

// Mock date
const now = new Date('Mon Jan 18 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Work order cancellations', () => {
  describe('when submitting a work order cancellation', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()

      // Viewing the work order page
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/workOrder.json' }
      ).as('workOrder')
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      )
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/tasks' },
        { body: [] }
      )
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
        },
        { body: [] }
      )

      // Submitting the update
      cy.intercept(
        { method: 'POST', path: '/api/workOrderComplete' },
        { body: '' }
      ).as('apiCheck')

      cy.clock(now)
      cy.visit('/work-orders/10000012')
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
      cy.get('.lbh-heading-h1').contains('Work order: 10000012')
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
      cy.wait('@apiCheck')

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
      cy.get('.lbh-panel').within(() => {
        cy.get('.govuk-panel__title').contains('Work order cancelled')
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10000012')
        })
      })

      cy.get('.lbh-list').within(() => {
        cy.contains(
          'Raise a new work order for 16 Pitcairn House St Thomass Square'
        ).should('have.attr', 'href', '/properties/00012345/raise-repair/new')

        cy.contains('Start a new search').should('have.attr', 'href', '/')

        cy.contains('View work order').should(
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

        cy.fixture('workOrders/workOrder.json').then((workOrder) => {
          // an internally-scheduled contractor ref
          workOrder.contractorReference = 'H01'
          // emergency priority code
          workOrder.priorityCode = 2

          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000012' },
            { body: workOrder }
          )
        })

        cy.clock(now)
        cy.visit('/work-orders/10000012/cancel')
      })

      it('shows warning text on the form', () => {
        cy.get('.lbh-warning-text')
          .contains(
            'For immediate or emergency work orders contact planner first.'
          )
          .should('exist')

        cy.get('.lbh-warning-text')
          .contains(
            'For next day work orders contact planners if before 3pm, contact repairs admin if after 3pm.'
          )
          .should('exist')

        cy.get('.lbh-warning-text')
          .contains(
            'For work orders on the current day contact the operative first. If they have already started work do not cancel.'
          )
          .should('exist')
      })
    })

    describe('when the order is scheduled outside of Hackney', () => {
      beforeEach(() => {
        cy.loginWithAgentRole()

        cy.fixture('workOrders/workOrder.json').then((workOrder) => {
          // an externally-scheduled contractor ref
          workOrder.contractorReference = 'HCK'

          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000012' },
            { body: workOrder }
          )
        })

        cy.clock(now)
        cy.visit('/work-orders/10000012/cancel')
      })

      it('does not show warning text on the form', () => {
        cy.get('.lbh-warning-text').should('not.exist')
      })
    })
  })
})
