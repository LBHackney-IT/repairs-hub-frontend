/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contract manager can authorise variation', () => {
  beforeEach(() => {
    cy.loginWithContractManagerRole()
    cy.server()
    // Stub requests
    cy.fixture('properties/property.json').as('property')
    cy.fixture('work-orders/status-variation-pending-approval.json').as(
      'workOrder'
    )
    cy.fixture('work-orders/variation-tasks.json').as('variation-tasks')
    cy.fixture('work-orders/tasks-and-sors.json').as('tasks-and-sors')

    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/workOrders/10000012', '@workOrder')
    cy.route({
      method: 'POST',
      url: '/api/jobStatusUpdate',
      response: '',
    }).as('apiCheck')
    cy.route(
      'GET',
      'api/workOrders/10000012/variation-tasks',
      '@variation-tasks'
    ).as('variation-tasks-request')
    cy.route('GET', 'api/workOrders/10000012/tasks', '@tasks-and-sors').as(
      'tasks-and-sors-request'
    )
  })

  it('Rejects job variation', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    cy.get('[data-testid="details"]')
      .contains('Variation Authorisation')
      .click({ force: true })

    cy.get('.govuk-grid-column-one-third').within(() => {
      cy.contains('a', 'Variation Authorisation')
        .should(
          'have.attr',
          'href',
          '/work-orders/10000012/variation-authorisation'
        )
        .click()
    })

    cy.contains('Authorisation variation request: 10000012')

    // Throws an error when rejected without comments
    // Notes section appears when clicked "reject request"
    cy.get('Add notes').should('not.exist')
    cy.get('[type="radio"]').check('Reject request')
    cy.contains('Add notes')
    cy.get('[type="submit"]').contains('Submit').click({ force: true })
    cy.contains('Please add notes')

    // Rejects with comments post request goes through
    cy.get('#note').type('Can not approve it')
    cy.get('[type="submit"]').contains('Submit').click({ force: true })

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000012',
        },
        comments: 'Variation rejected: Can not approve it',
        typeCode: '125',
      })

    cy.contains('You have rejected a variation for work order 10000012')
  })

  it('Approves job variation', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    cy.get('[data-testid="details"]')
      .contains('Variation Authorisation')
      .click({ force: true })

    cy.get('.govuk-grid-column-one-third').within(() => {
      cy.contains('a', 'Variation Authorisation')
        .should(
          'have.attr',
          'href',
          '/work-orders/10000012/variation-authorisation'
        )
        .click()
    })

    cy.contains('Authorisation variation request: 10000012')

    cy.url().should('contains', '/work-orders/10000012/variation-authorisation')

    // When click approve default comments appear
    cy.get('[type="radio"]').check('Approve request')
    cy.get('[type="submit"]').contains('Submit').click({ force: true })

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000012',
        },
        typeCode: '100-20',
      })

    cy.contains('You have approved a variation for work order 10000012')
  })

  // summary page and calculation
  it('shows summary page and calculation of variation cost', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    cy.get('[data-testid="details"]')
      .contains('Variation Authorisation')
      .click({ force: true })

    cy.get('.govuk-grid-column-one-third').within(() => {
      cy.contains('a', 'Variation Authorisation')
        .should(
          'have.attr',
          'href',
          '/work-orders/10000012/variation-authorisation'
        )
        .click()
    })

    cy.contains('Authorisation variation request: 10000012')
    cy.contains('Summary of Tasks and SORs')

    cy.get('.original-sor-summary').within(() => {
      cy.contains('td', 'DES5R006 - Urgent call outs')
      cy.contains('td', '1')
      cy.contains('td', '£10')
    })

    cy.contains('Updated Tasks SORs')
    cy.contains('Updated by: John Johnson (Alphatrack)')
    cy.contains('Tuesday, 11 May 2021')

    cy.contains('Variation reason: More work needed')

    cy.get('.updated-tasks-table').within(() => {
      // Increased task
      cy.contains('td', 'Increase')
      cy.contains('td', 'DES5R005')
      cy.contains('p', 'Normal Call outs')
      cy.contains('td', '£4')
      cy.contains('td', '1')
      cy.contains('td', '£4')
      cy.contains('td', '4000')
      cy.contains('td', '£1600')

      //Reduced task
      cy.contains('td', 'Reduced')
      cy.contains('td', 'DES5R006')
      cy.contains('p', 'Normal Call outs')
      cy.contains('td', '£19')
      cy.contains('td', '10')
      cy.contains('td', '£190')
      cy.contains('td', '2')
      cy.contains('td', '£38')

      //New task
      cy.contains('td', 'Reduced')
      cy.contains('td', 'DES5R007')
      cy.contains('p', 'Normal Call outs')
      cy.contains('td', '£25')
      cy.contains('td', '0')
      cy.contains('td', '£0')
      cy.contains('td', '2')
      cy.contains('td', '£50')

      //Unchanged task
      cy.contains('td', 'Unchanged')
      cy.contains('td', 'DES5R006')
      cy.contains('p', 'Normal Call outs')
      cy.contains('td', '£10')
      cy.contains('td', '1')
      cy.contains('td', '£10')
      cy.contains('td', '1')
      cy.contains('td', '£10')

      // Cost calculation
      cy.get('#cost-before-variation').within(() => {
        cy.contains('td', 'Cost before variation')
        cy.contains('td', '£204.00')
      })
      cy.get('#change-in-cost').within(() => {
        cy.contains('td', 'Change in cost')
        cy.contains('td', '£15894.00')
      })
      cy.get('#total-cost-after-variation').within(() => {
        cy.contains('td', 'Total cost after variation')
        cy.contains('td', '£16098.00')
      })
    })
  })
})
