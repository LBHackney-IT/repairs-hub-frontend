/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contractor update a job', () => {
  beforeEach(() => {
    cy.loginWithContractorRole()
    cy.server()
    cy.fixture('schedule-of-rates/codes.json').as('sorCodes')
    cy.fixture('work_orders/jobs.json').as('workorderslist')
    cy.fixture('work_orders/tasks.json').as('tasksList')
    cy.route('GET', 'api/repairs/?PageSize=10&PageNumber=1', '@workorderslist')
    cy.route('GET', 'api/repairs/00012346/tasks', '@tasksList').as(
      'taskListRequest'
    )
    cy.route('GET', 'api/schedule-of-rates/codes', '@sorCodes').as(
      'sorCodeRequest'
    )

    cy.route({
      method: 'POST',
      url: '/api/jobStatusUpdate',
      response: '',
    }).as('apiCheck')
  })

  it('throws errors if input values are empty or not valid', () => {
    cy.visit(`${Cypress.env('HOST')}/`)

    cy.get('.govuk-table__cell').within(() => {
      cy.contains('00012346')
      cy.contains('a', 'Update').click()
    })
    cy.contains('Update work order: 00012346')
    cy.get('form').within(() => {
      cy.get('[type="radio"]').check('Update')
      cy.get('[type="submit"]').contains('Next').click()
    })

    cy.wait('@taskListRequest')
    cy.wait('@sorCodeRequest')

    // Update page
    cy.contains('Update work order: 00012346')

    cy.contains('+ Add another SOR code').click()

    cy.get('form').within(() => {
      cy.get('[type="submit"]').contains('Next').click()
    })

    cy.get('form').within(() => {
      cy.contains('Please select an SOR code')
      cy.contains('Please enter a quantity')
    })

    cy.get('#repair-request-form').within(() => {
      // Select SOR Code from dropdown
      cy.get('select[id="sorCodesCollection[0][code]"]').select(
        'DES5R004 - Emergency call out'
      )
      // Enter a non-number quantity
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('x')

      cy.get('[type="submit"]').contains('Next').click()

      cy.contains('Quantity must be a whole number')
      // Enter a quantity more than the maximum
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('60')

      cy.contains('Quantity must be 50 or less')
      // Enter a quantity less then the minimum
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('0')
      cy.contains('Quantity must be 1 or more')

      // Enter a non-integer quantity
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('1.5')
      cy.contains('Quantity must be a whole number')
    })
  })

  it('allows the user to update the job by changing the existing quantity', () => {
    cy.visit(`${Cypress.env('HOST')}/`)
    cy.get('.govuk-table__cell').within(() => {
      cy.contains('00012346')
      cy.contains('a', 'Update').click()
    })
    cy.contains('Update work order: 00012346')
    cy.get('form').within(() => {
      cy.get('[type="radio"]').check('Update')
      cy.get('[type="submit"]').contains('Next').click()
    })
    cy.wait('@taskListRequest')
    cy.wait('@sorCodeRequest')
    cy.get('#repair-request-form').within(() => {
      cy.get('#quantity-0-form-group').within(() => {
        cy.get('input[id="quantity-0"]').clear().type('0')
      })
      cy.get('[type="submit"]').contains('Next').click()
    })
    cy.get('[type="submit"]').contains('Confirm and close').click()
    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '00012346',
          description: '',
          allocatedBy: '',
        },
        typeCode: 8,
        moreSpecificSORCode: {
          rateScheduleItem: [
            {
              customCode: 'XXXXR003',
              customName: 'Immediate call outs',
              quantity: {
                amount: [Number.parseInt('0')],
              },
            },
          ],
        },
      })
  })

  it('allows to update quantity, edit and add new sor codes', () => {
    cy.visit(`${Cypress.env('HOST')}/repairs/jobs/00012346/update-job`)
    cy.wait('@taskListRequest')
    cy.wait('@sorCodeRequest')

    cy.get('#repair-request-form').within(() => {
      cy.get('#quantity-0-form-group').within(() => {
        cy.get('input[id="quantity-0"]').clear().type('12')
      })

      cy.get('[type="submit"]').contains('Next').click()
    })

    cy.contains('Summary of updates to work order')

    cy.get('.govuk-table__body').contains('XXXXR003 - Immediate call outs')
    cy.get('.govuk-table__body').contains('12')
    cy.get('.govuk-table__body').contains('0')
    // Go back and add new SOR code
    cy.get('.govuk-table__row').within(() => {
      cy.contains('Edit').click()
    })

    cy.get('#quantity-0-form-group').within(() => {
      cy.get('input[id="quantity-0"]').clear().type('10')
    })
    cy.get('#repair-request-form').within(() => {
      cy.get('.repairs-hub-link').click()
      // Select SOR Code from dropdown
      cy.get('select[id="sorCodesCollection[0][code]"]').select(
        'DES5R004 - Emergency call out'
      )

      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('15')

      cy.get('[type="submit"]').contains('Next').click()
    })

    cy.contains('Summary of updates to work order')
    cy.get('.govuk-table__body').contains('XXXXR003 - Immediate call outs')
    cy.get('.govuk-table__body').contains('10')
    cy.get('.govuk-table__body').contains('0')
    cy.get('.govuk-table__body').contains('DES5R004 - Emergency call out')
    cy.get('.govuk-table__body').contains('15')

    cy.get('[type="submit"]').contains('Confirm and close').click()

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '00012346',
          description: '',
          allocatedBy: '',
        },
        typeCode: 8,
        moreSpecificSORCode: {
          rateScheduleItem: [
            {
              customCode: 'XXXXR003',
              customName: 'Immediate call outs',
              quantity: {
                amount: [Number.parseInt('10')],
              },
            },
            {
              customCode: 'DES5R004',
              customName: 'Emergency call out',
              quantity: {
                amount: [Number.parseInt('15')],
              },
            },
          ],
        },
      })

    cy.location('pathname').should('eq', '/')
    cy.contains('Manage jobs')

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
