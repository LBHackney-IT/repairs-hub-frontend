/// <reference types="cypress" />

import 'cypress-audit/commands'

// Mock date
const now = new Date('Fri Jan 22 2021 18:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Authorisation workflow for a work order', () => {
  beforeEach(() => {
    cy.loginWithAuthorisationManagerRole()

    cy.fixture('hub-user/user.json').then((user) => {
      user.raiseLimit = 1000
      cy.intercept({ method: 'GET', path: '/api/hub-user' }, { body: user })
    })

    // Stub requests
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012' },
      { fixture: 'work-orders/status-authorisation-pending-approval.json' }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
      },
      { body: [] }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { fixture: 'work-orders/task.json' }
    ).as('tasks-and-sors-request')

    cy.intercept(
      { method: 'POST', url: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('apiCheck')
  })

  context('When logged in as an authorisation manager', () => {
    it('Rejects to authorise work order', () => {
      // Visit work order page
      cy.visit('/work-orders/10000012')

      cy.wait('@tasks-and-sors-request')

      cy.get('.govuk-grid-column-one-third').within(() => {
        cy.contains('a', 'Authorisation')
          .should('have.attr', 'href', '/work-orders/10000012/authorisation')
          .click()
      })

      cy.contains('Authorisation request: 10000012')
      cy.contains('This work order requires your authorisation')
      cy.url().should('contains', '/work-orders/10000012/authorisation')

      cy.wait('@tasks-and-sors-request')

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
        cy.get('.lbh-page-announcement__title').contains(
          'You have rejected the authorisation request'
        )
        cy.get('.lbh-page-announcement__content').within(() => {
          cy.contains('Work order number')
          cy.contains('10000012')
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
      cy.clock(now)
      // Visit work order page
      cy.visit('/work-orders/10000012')

      cy.get('.govuk-grid-column-one-third').within(() => {
        cy.contains('a', 'Authorisation')
          .should('have.attr', 'href', '/work-orders/10000012/authorisation')
          .click()
      })

      cy.contains('Authorisation request: 10000012')
      cy.contains('This work order requires your authorisation')
      cy.url().should('contains', '/work-orders/10000012/authorisation')

      cy.get('[type="radio"]').check('Approve request')
      cy.get('[type="submit"]').contains('Submit').click()

      cy.wait('@apiCheck')
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
        cy.get('.lbh-page-announcement__title').contains(
          'You have approved the authorisation request'
        )
        cy.get('.lbh-page-announcement__content').within(() => {
          cy.contains('Work order number')
          cy.contains('10000012')
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

    it('No link to authorise work order if status is not authorisation pending approval', () => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'work-orders/work-order.json' }
      )

      // Visit work order page
      cy.visit('/work-orders/10000012')

      cy.get('.govuk-grid-column-one-third').within(() => {
        cy.contains('a', 'Authorisation').should('not.exist')
      })
    })

    it('Can not authorise (approve) work order if over raise spend limit', () => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/tasks' },
        { fixture: 'work-orders/high-cost-task.json' }
      ).as('highCostTasks')

      cy.visit('/work-orders/10000012/authorisation')
      cy.wait('@highCostTasks')

      cy.contains('Authorisation request: 10000012')
      cy.contains('This work order requires your authorisation')

      // Warning text as work order is above user's raise limit (£1000)
      cy.get('.govuk-warning-text.lbh-warning-text').within(() => {
        cy.contains(
          'Work order is over your raise limit of £1000, please contact a manager to approve. You can still reject the authorisation request.'
        )
      })

      cy.get('[type="radio"]').contains('Approve request').should('not.exist')
      cy.get('[type="radio"]').check('Reject request')
      cy.get('#note').type('Rejecting!')
      cy.get('[type="submit"]').contains('Submit').click()

      cy.wait('@apiCheck')

      cy.get('@apiCheck')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000012',
          },
          comments: 'Authorisation rejected: Rejecting!',
          typeCode: '22',
        })

      // Confirmation screen
      cy.get('.lbh-page-announcement').within(() => {
        cy.get('.lbh-page-announcement__title').contains(
          'You have rejected the authorisation request'
        )
        cy.get('.lbh-page-announcement__content').within(() => {
          cy.contains('Work order number')
          cy.contains('10000012')
        })
      })
    })

    it('Can not authorise (approve) work order if over target date', () => {
      // Visit work order page
      cy.visit('/work-orders/10000012/authorisation')

      cy.contains('Authorisation request: 10000012')
      cy.contains('This work order requires your authorisation')

      // Warning text as work order is over target date
      cy.get('.govuk-warning-text.lbh-warning-text').within(() => {
        cy.contains(
          'Work order cannot be approved, the target date has expired. Please reject and raise a new work order.'
        )
      })

      cy.get('[type="radio"]').contains('Approve request').should('not.exist')
      cy.get('[type="radio"]').check('Reject request')
      cy.get('#note').type('Rejecting!')
      cy.get('[type="submit"]').contains('Submit').click()

      cy.wait('@apiCheck')

      cy.get('@apiCheck')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000012',
          },
          comments: 'Authorisation rejected: Rejecting!',
          typeCode: '22',
        })

      // Confirmation screen
      cy.get('.lbh-page-announcement').within(() => {
        cy.get('.lbh-page-announcement__title').contains(
          'You have rejected the authorisation request'
        )
        cy.get('.lbh-page-announcement__content').within(() => {
          cy.contains('Work order number')
          cy.contains('10000012')
        })
      })

      // Shows the new work order link
      cy.get('.lbh-link').within(() => {
        cy.contains('Raise a new work order')
      })
    })
  })
})

describe('When an agent tries to authorise using the UI', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
  })

  it('rejects the request and shows the access-denied page instead', () => {
    cy.visit('/work-orders/10000012/authorisation')

    cy.contains('a', 'Authorise Work Order').should('not.exist')
    cy.contains('Authorisation request: 10000012').should('not.exist')
    cy.url().should('not.contain', 'work-orders/10000012/authorisation')

    cy.contains('Access denied')
    cy.url().should('contain', 'access-denied')
  })
})
