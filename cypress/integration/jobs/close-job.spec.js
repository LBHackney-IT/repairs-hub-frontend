/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contractor closing a job', () => {
  beforeEach(() => {
    cy.loginWithContractorRole()
    cy.server()
    cy.fixture('repairs/work-orders.json').as('workorderslist')
    cy.route('GET', 'api/repairs/?PageSize=10&PageNumber=1', '@workorderslist')
    cy.route({
      method: 'POST',
      url: '/api/workOrderComplete',
      response: '',
    }).as('apiCheck')
  })

  it('takes you to close-job page', () => {
    cy.visit(`${Cypress.env('HOST')}/`)
    cy.get('.govuk-table__cell').within(() => {
      cy.contains('10000040')
      cy.contains('a', 'Update').click()
    })
    cy.contains('Update work order: 10000040')
    cy.get('form').within(() => {
      cy.get('[type="radio"]').check('Close job')
      cy.get('[type="submit"]').contains('Next').click()
    })
    cy.contains('Update work order: 10000040')
  })

  it('shows errors when submit with no inputs', () => {
    cy.visit(`${Cypress.env('HOST')}/repairs/jobs/10000040/close-job`)
    cy.get('form').within(() => {
      cy.get('[type="submit"]').contains('Submit').click()
    })
    cy.contains('Summary of updates to work order').should('not.exist')
    cy.get('form').within(() => {
      cy.contains('Please pick completion date')
      cy.contains('Please enter a valid time')
      cy.contains('Please add notes')
    })
  })

  it('submits the form with inputs that are invalid', () => {
    cy.visit(`${Cypress.env('HOST')}/repairs/jobs/10000040/close-job`)
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
    cy.visit(`${Cypress.env('HOST')}/repairs/jobs/10000040/close-job`)
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
              'This has been repaired.This has been repaired and I forgot I did it on a completely different date and time.',
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
