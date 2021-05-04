/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Authorisation workflow for a work order', () => {
  beforeEach(() => {
    cy.loginWithAuthorisationManagerRole()

    cy.server()
    // Stub requests
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.fixture('work-orders/status-authorisation-pending-approval.json').as(
      'workOrder'
    )
    cy.route('GET', 'api/workOrders/10000012', '@workOrder')
    cy.route({
      method: 'POST',
      url: '/api/jobStatusUpdate',
      response: '',
    }).as('apiCheck')

    // Visit work order page
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
  })

  context('When logged in as an authorisation manager', () => {
    it('Rejects to authorise work order', () => {
      cy.contains('a', 'Authorise Works Order').click()
      cy.contains('Authorisation request: 10000012')
      cy.contains('This job requires your authorisation')
      cy.url().should('contains', '/work-orders/10000012/authorisation')

      // Notes is a mandatory field for a rejection
      cy.get('Add notes').should('not.exist')
      cy.get('[type="radio"]').check('Reject request')
      cy.contains('Add notes')
      cy.get('[type="submit"]').contains('Submit').click()
      cy.contains('Please add notes')

      // Add a note
      cy.get('#note').type('Far too expensive!')
      cy.get('[type="submit"]').contains('Submit').click()

      cy.get('@apiCheck')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000012',
          },
          comments: 'Authorisation rejected: Far too expensive!',
          typeCode: '22',
        })

      // Confirmation screen
      cy.get('.lbh-page-announcement').within(() => {
        cy.get('.lbh-announcement__content').within(() => {
          cy.contains(
            'You have rejected the authorisation request for work order 10000012'
          )
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li').within(() => {
        cy.contains('View work order').should(
          'have.attr',
          'href',
          '/work-orders/10000012'
        )
        cy.contains('Back to dashboard').should('have.attr', 'href', '/')
      })

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('Authorises work order', () => {
      cy.contains('a', 'Authorise Works Order').click()
      cy.contains('Authorisation request: 10000012')
      cy.contains('This job requires your authorisation')
      cy.url().should('contains', '/work-orders/10000012/authorisation')

      cy.get('[type="radio"]').check('Approve request')
      cy.get('[type="submit"]').contains('Submit').click()

      cy.get('@apiCheck')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000012',
          },
          typeCode: '23',
        })

      // Confirmation screen
      cy.get('.lbh-page-announcement').within(() => {
        cy.get('.lbh-announcement__content').within(() => {
          cy.contains(
            'You have approved the authorisation request for work order 10000012'
          )
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li').within(() => {
        cy.contains('View work order').should(
          'have.attr',
          'href',
          '/work-orders/10000012'
        )
        cy.contains('Back to dashboard').should('have.attr', 'href', '/')
      })
    })

    it('No link to authorise works order if status is not authorisation pending approval', () => {
      cy.fixture('work-orders/work-order.json').as('workOrder')
      cy.route('GET', 'api/workOrders/10000012', '@workOrder')
      // Visit work order page
      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)

      cy.contains('a', 'Authorise Works Order').should('not.exist')
    })
  })
})

describe('When an agent tries to authorise using the UI', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
  })

  it('rejects the request and shows the access-denied page instead', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012/authorisation`)

    cy.contains('a', 'Authorise Works Order').should('not.exist')
    cy.contains('Authorisation request: 10000012').should('not.exist')
    cy.url().should('not.contain', 'work-orders/10000012/authorisation')

    cy.contains('Access denied')
    cy.url().should('contain', 'access-denied')
  })
})
