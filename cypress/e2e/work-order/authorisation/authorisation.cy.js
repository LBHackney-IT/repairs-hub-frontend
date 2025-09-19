/// <reference types="cypress" />

import 'cypress-audit/commands'

// Mock date
const now = new Date('Fri Jan 22 2021 18:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Authorisation workflow for a work order', () => {
  beforeEach(() => {
    cy.loginWithAuthorisationManagerRole()

    cy.fixture('hubUser/user.json')
      .then((user) => {
        user.raiseLimit = 1000
        cy.intercept({ method: 'GET', path: '/api/hub-user' }, { body: user })
      })
      .as('hubUserRequest')

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012' },
      { fixture: 'workOrders/statusAuthorisationPendingApproval.json' }
    ).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10000012' },
      {
        fixture: 'workOrderAppointments/noAppointment.json',
      }
    )

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
      },
      { body: [] }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { fixture: 'workOrders/task.json' }
    ).as('tasksAndSorsRequest')

    cy.intercept(
      { method: 'POST', url: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('apiCheck')
  })

  context('When logged in as an authorisation manager', () => {
    it('Rejects to authorise work order', () => {
      cy.visit('/work-orders/10000012')

      cy.wait(
        ['@workOrderRequest', '@propertyRequest', '@tasksAndSorsRequest'],
        { requestTimeout: 7000 }
      )

      cy.get('.govuk-grid-column-one-third')
        .contains('a', 'Authorisation')
        .should('have.attr', 'href', '/work-orders/10000012/authorisation')
        .click()

      cy.contains('Authorisation request: 10000012')
      cy.contains('This work order requires your authorisation')
      cy.url().should('contains', '/work-orders/10000012/authorisation')

      cy.wait(['@hubUserRequest', '@tasksAndSorsRequest'])

      // Notes is a mandatory field for a rejection
      cy.get('Add notes').should('not.exist')
      cy.get('[type="radio"]').check('Reject request')
      cy.contains('Add notes')
      cy.get('[type="submit"]').contains('Submit').click()
      cy.contains('Please add notes')

      // Add a note
      cy.get('#note').type('Far too expensive!')
      cy.get('[type="submit"]').contains('Submit').click()

      cy.wait('@apiCheck')

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

      cy.get('.govuk-panel').within(() => {
        cy.get('.govuk-panel__title').contains(
          'Work order cancelled, authorisation request rejected'
        )
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10000012')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li')
        .contains(
          'Raise a new work order for 16 Pitcairn House St Thomass Square'
        )
        .should('have.attr', 'href', '/properties/00012345/raise-repair/new')

      cy.get('.lbh-list li')
        .contains('View work order')
        .should('have.attr', 'href', '/work-orders/10000012')

      cy.get('.lbh-list li')
        .contains('Start a new search')
        .should('have.attr', 'href', '/')
    })

    it('Authorises work order', () => {
      cy.clock(now)

      cy.visit('/work-orders/10000012')

      cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksAndSorsRequest'])

      cy.get('.govuk-grid-column-one-third')
        .contains('a', 'Authorisation')
        .should('have.attr', 'href', '/work-orders/10000012/authorisation')
        .click()

      cy.wait(['@hubUserRequest', '@tasksAndSorsRequest'])

      cy.contains('Authorisation request: 10000012')
      cy.contains('This work order requires your authorisation')
      cy.url().should('contains', '/work-orders/10000012/authorisation')

      cy.get('[type="radio"]').check('Approve request')
      cy.get('[type="submit"]').contains('Submit').click({ force: true })

      cy.wait('@apiCheck', { requestTimeout: 7000 })

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
          'Authorisation request approved'
        )
        cy.get('.lbh-page-announcement__content').within(() => {
          cy.contains('Reference number')
          cy.contains('10000012')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li')
        .contains('Book an appointment on DRS')
        .should('have.attr', 'href', '/work-orders/10000012/appointment/new')

      cy.get('.lbh-list li')
        .contains('View work order')
        .should('have.attr', 'href', '/work-orders/10000012')

      cy.get('.lbh-list li')
        .contains('Manage work orders')
        .should('have.attr', 'href', '/')
    })

    it('No link to authorise work order if status is not authorisation pending approval', () => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/workOrder.json' }
      ).as('nonPendingWorkOrderRequest')

      cy.visit('/work-orders/10000012')

      cy.wait([
        '@nonPendingWorkOrderRequest',
        '@propertyRequest',
        '@tasksAndSorsRequest',
      ])

      cy.get('.govuk-grid-column-one-third')
        .contains('a', 'Authorisation')
        .should('not.exist')
    })

    it('Can not authorise (approve) work order if over raise spend limit', () => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/tasks' },
        { fixture: 'workOrders/highCostTask.json' }
      ).as('highCostTasks')

      cy.visit('/work-orders/10000012/authorisation')

      cy.wait(['@hubUserRequest', '@highCostTasks'])

      cy.contains('Authorisation request: 10000012')
      cy.contains('This work order requires your authorisation')

      // Warning text as work order is above user's raise limit (£1000)
      cy.get('.govuk-warning-text.lbh-warning-text').contains(
        'Work order is over your raise limit of £1000, please contact a manager to approve. You can still reject the authorisation request.'
      )

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
      cy.get('.govuk-panel').within(() => {
        cy.get('.govuk-panel__title').contains(
          'Work order cancelled, authorisation request rejected'
        )
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10000012')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li')
        .contains(
          'Raise a new work order for 16 Pitcairn House St Thomass Square'
        )
        .should('have.attr', 'href', '/properties/00012345/raise-repair/new')

      cy.get('.lbh-list li')
        .contains('View work order')
        .should('have.attr', 'href', '/work-orders/10000012')

      cy.get('.lbh-list li')
        .contains('Start a new search')
        .should('have.attr', 'href', '/')
    })

    it('Can not authorise (approve) work order if over target date', () => {
      cy.visit('/work-orders/10000012/authorisation')

      cy.contains('Authorisation request: 10000012')
      cy.contains('This work order requires your authorisation')

      // Warning text as work order is over target date
      cy.get('.govuk-warning-text.lbh-warning-text').contains(
        'Work order cannot be approved, the target date has expired. Please reject and raise a new work order.'
      )

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
      cy.get('.govuk-panel').within(() => {
        cy.get('.govuk-panel__title').contains(
          'Work order cancelled, authorisation request rejected'
        )
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10000012')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li')
        .contains(
          'Raise a new work order for 16 Pitcairn House St Thomass Square'
        )
        .should('have.attr', 'href', '/properties/00012345/raise-repair/new')

      cy.get('.lbh-list li')
        .contains('View work order')
        .should('have.attr', 'href', '/work-orders/10000012')

      cy.get('.lbh-list li')
        .contains('Start a new search')
        .should('have.attr', 'href', '/')
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
