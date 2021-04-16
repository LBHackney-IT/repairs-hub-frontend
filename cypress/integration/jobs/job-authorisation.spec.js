/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contract manager can authorise variation', () => {
  beforeEach(() => {
    cy.loginWithContractManagerRole()

    cy.server()
    // Stub requests
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.fixture('repairs/work-order-pending-approval.json').as('workOrder')
    cy.route('GET', 'api/repairs/10000012', '@workOrder')
    cy.route({
      method: 'POST',
      url: '/api/jobStatusUpdate',
      response: '',
    }).as('apiCheck')
  })

  it('Rejects job variation', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    cy.contains('a', 'Update Works Order').click()
    cy.contains('Authorisation request: 10000012')

    // Throws an error when rejected without comments
    // Notes section appears when clicked "reject request"
    cy.get('Add notes').should('not.exist')
    cy.get('[type="radio"]').check('Reject request')
    cy.contains('Add notes')
    cy.get('[type="submit"]').contains('Submit').click()
    cy.contains('Please add notes')

    // Rejects with comments post request goes through
    cy.get('#note').type('Can not approve it')
    cy.get('[type="submit"]').contains('Submit').click()

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000012',
        },
        comments: 'Variation rejected: Can not approve it',
        typeCode: '125',
      })
  })

  it('Approves job variation', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    cy.contains('a', 'Update Works Order').click()
    cy.contains('Authorisation request: 10000012')

    // When click approve default comments appear
    cy.get('[type="radio"]').check('Approve request')
    cy.get('[type="submit"]').contains('Submit').click()

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000012',
        },
        typeCode: '100-20',
      })
  })
})
