/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contractor closing a job', () => {
  beforeEach(() => {
    cy.loginWithContractorRole()
    cy.server()
    cy.fixture('work-orders/work-order.json')
      .as('workOrder')
      .then((workOrder) => {
        workOrder.reference = 10000040
      })
    cy.fixture('work-orders/work-orders.json').as('workOrdersList')
    cy.fixture('hub-user/user.json').then((user) => {
      cy.intercept('GET', 'api/hub-user', user)
    })

    cy.route(
      'GET',
      'api/workOrders/?PageSize=10&PageNumber=1',
      '@workOrdersList'
    )
    cy.route('GET', 'api/workOrders/10000040', '@workOrder')
    cy.route(
      'GET',
      'api/workOrders/?propertyReference=00012345&PageSize=50&PageNumber=1',
      []
    )
    cy.route({
      method: 'POST',
      url: '/api/workOrderComplete',
      response: '',
    }).as('apiCheck')

    // Viewing the work order page
    cy.fixture('properties/property.json').then((property) => {
      cy.intercept('GET', 'api/properties/00012345', property)
    })
    cy.fixture('work-orders/work-orders.json').then((workOrders) => {
      cy.intercept('GET', 'api/workOrders/10000040', workOrders[0])
    })
  })

  it('takes you to close page', () => {
    cy.visit(`${Cypress.env('HOST')}/`)

    cy.get('.govuk-table__cell').within(() => {
      cy.contains('a', '10000040').click()
    })

    cy.get('[data-testid="details"]').contains('Close').click({ force: true })

    cy.get('.govuk-grid-column-one-third').within(() => {
      cy.contains('a', 'Close')
        .should('have.attr', 'href', '/work-orders/10000040/close')
        .click()
    })
  })

  it('shows errors when submit with no inputs', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000040/close`)
    cy.get('form').within(() => {
      cy.get('[type="submit"]').contains('Submit').click()
    })
    cy.contains('Summary of updates to work order').should('not.exist')
    cy.get('form').within(() => {
      cy.contains('Please pick completion date')
      cy.contains('Please enter a valid time')
    })
  })

  it('submits the form with inputs that are invalid', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000040/close`)
    cy.get('form').within(() => {
      cy.get('#date').type('2028-01-15')
      cy.get('#time').within(() => {
        cy.get('#time-time').type('32')
        cy.get('#time-minutes').type('66')
      })
      cy.get('#notes').type('test')
      cy.get('[type="submit"]').contains('Submit').click()
    })
    // Check validation or similar messages - to check, reuse existing if possible
    cy.get('form').within(() => {
      cy.contains('Please select a date that is in the past')
      cy.contains('Please enter a valid time')
    })
  })

  it('submits the form with valit inputs and edit them fron summary page', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000040/close`)
    // Enter 5 October 2021 at 14:45
    cy.get('form').within(() => {
      cy.get('#date').type('2020-10-05')
      cy.get('#time').within(() => {
        cy.get('#time-time').clear()
        cy.get('#time-minutes').clear()
        cy.get('#time-time').type('14')
        cy.get('#time-minutes').type('45')
      })
      cy.get('#notes').type('This has been repaired.')
      cy.get('[type="submit"]').contains('Submit').click()
    })
    cy.contains('Summary of updates to work order')
    cy.get('.govuk-table__row').contains('Completion time')
    cy.get('.govuk-table__row').contains('2020/10/05')
    cy.get('.govuk-table__row').contains('14:45')
    cy.get('.govuk-table__row').contains('Notes')
    cy.get('.govuk-table__row').contains('This has been repaired.')
    // Go back and edit some inputs
    cy.get('.govuk-table__row').within(() => {
      cy.contains('Edit').click()
    })
    // Enter 6 November 2020 at 13:01
    cy.get('form').within(() => {
      cy.get('#date').type('2020-11-06')
      cy.get('#time').within(() => {
        cy.get('#time-time').clear()
        cy.get('#time-minutes').clear()
        cy.get('#time-time').type('13')
        cy.get('#time-minutes').type('01')
      })
      cy.get('#notes').type(
        'This has been repaired and I forgot I did it on a completely different date and time.'
      )
      cy.get('[type="submit"]').contains('Submit').click()
    })
    cy.get('.govuk-table__row').contains('Completion time')
    cy.get('.govuk-table__row').contains('2020/11/06')
    cy.get('.govuk-table__row').contains('13:01')
    cy.get('.govuk-table__row').contains('Notes')
    cy.get('.govuk-table__row').contains(
      'This has been repaired and I forgot I did it on a completely different date and time.'
    )
    cy.get('[type="submit"]').contains('Confirm and close').click()

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        workOrderReference: {
          id: '10000040',
          description: '',
          allocatedBy: '',
        },
        jobStatusUpdates: [
          {
            typeCode: 0,
            otherType: 'complete',
            comments:
              'Work order closed - This has been repaired.This has been repaired and I forgot I did it on a completely different date and time.',
            eventTime: '2020-11-06T13:01:00.000Z',
          },
        ],
      })

    cy.location('pathname').should('eq', '/')
    cy.contains('Manage jobs')
    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
