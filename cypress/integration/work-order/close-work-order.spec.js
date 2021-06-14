/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contractor closing a job', () => {
  beforeEach(() => {
    cy.loginWithContractorRole()

    // Viewing the home page
    cy.intercept(
      { method: 'GET', path: '/api/filter/WorkOrder' },
      {
        fixture: 'filter/work-order.json',
      }
    ).as('workOrderFilters')
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/?PageSize=10&PageNumber=1' },
      { fixture: 'work-orders/work-orders.json' }
    ).as('workOrders')

    // Viewing the work order page
    cy.fixture('work-orders/work-order.json').then((workOrder) => {
      workOrder.reference = 10000040
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000040' },
        { body: workOrder }
      )
    })
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
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
  })

  it('takes you to close page', () => {
    cy.visit('/')

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
    cy.visit('/work-orders/10000040/close')

    cy.get('form').within(() => {
      cy.get('[type="submit"]').contains('Submit').click()
    })
    cy.contains('Summary of updates to work order').should('not.exist')
    cy.get('form').within(() => {
      cy.contains('Please select a reason for closing the job')
      cy.contains('Please pick completion date')
      cy.contains('Please enter a valid time')
    })
  })

  it('submits the form with inputs that are invalid', () => {
    cy.visit('/work-orders/10000040/close')

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

  it('submits the form with valid inputs and allows to edit them from summary page', () => {
    cy.visit('/work-orders/10000040/close')

    // Enter 5 October 2021 at 14:45
    cy.get('form').within(() => {
      cy.get('[type="radio"]').first().should('have.value', 'Job Completed')
      cy.get('[type="radio"]').last().should('have.value', 'No Access')
      //choose No Access reason
      cy.get('[type="radio"]').last().check()
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
    cy.get('.govuk-table__row').contains('Reason')
    cy.get('.govuk-table__row').contains('No Access')
    cy.get('.govuk-table__row').contains('Notes')
    cy.get('.govuk-table__row').contains('This has been repaired.')
    // Go back and edit some inputs
    cy.get('.govuk-table__row').within(() => {
      cy.contains('Edit').click()
    })
    // Enter 6 November 2020 at 13:01
    cy.get('form').within(() => {
      cy.get('[type="radio"]').first().check()
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
    cy.get('.govuk-table__row').contains('Reason')
    cy.get('.govuk-table__row').contains('Job Completed')
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
            typeCode: '0',
            otherType: 'complete',
            comments:
              'Work order closed - This has been repaired.This has been repaired and I forgot I did it on a completely different date and time.',
            eventTime: '2020-11-06T13:01:00.000Z',
          },
        ],
      })

    cy.wait(['@workOrderFilters', '@workOrders'])

    cy.location('pathname').should('equal', '/')
    cy.contains('Manage jobs')

    // Run lighthouse audit for accessibility report
    cy.audit()
  })

  // Closing job becasue of No Access

  it('submits the form with closing reason: No Access', () => {
    cy.visit('/work-orders/10000040/close')

    // Enter 6 November 2020 at 13:01
    cy.get('form').within(() => {
      cy.get('[type="radio"]').first().should('have.value', 'Job Completed')
      cy.get('[type="radio"]').last().should('have.value', 'No Access')
      //choose No Access reason
      cy.get('[type="radio"]').last().check()
      cy.get('#date').type('2020-11-06')
      cy.get('#time').within(() => {
        cy.get('#time-time').clear()
        cy.get('#time-minutes').clear()
        cy.get('#time-time').type('13')
        cy.get('#time-minutes').type('01')
      })
      cy.get('#notes').type('Tenant was not at home')
      cy.get('[type="submit"]').contains('Submit').click()
    })
    cy.get('.govuk-table__row').contains('Completion time')
    cy.get('.govuk-table__row').contains('2020/11/06')
    cy.get('.govuk-table__row').contains('13:01')
    cy.get('.govuk-table__row').contains('Reason')
    cy.get('.govuk-table__row').contains('No Access')
    cy.get('.govuk-table__row').contains('Notes')
    cy.get('.govuk-table__row').contains('Tenant was not at home')
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
            typeCode: '70',
            otherType: 'complete',
            comments: 'Work order closed - Tenant was not at home',
            eventTime: '2020-11-06T13:01:00.000Z',
          },
        ],
      })

    cy.location('pathname').should('equal', '/')
    cy.contains('Manage jobs')

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
