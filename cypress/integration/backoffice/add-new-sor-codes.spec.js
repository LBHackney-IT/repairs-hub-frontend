/// <reference types="cypress" />

import 'cypress-audit/commands'

function contractorsRequest() {
  cy.intercept(
    { method: 'GET', path: '/api/contractors?getAllContractors=true' },
    { fixture: 'contractors/contractors.json' }
  ).as('contractorsRequest')
}

function tradesRequest() {
  cy.intercept(
    { method: 'GET', path: '/api/schedule-of-rates/trades?getAllTrades=true' },
    { fixture: 'scheduleOfRates/trades.json' }
  ).as('tradesRequest')
}

function contractsRequest() {
  cy.intercept(
    {
      method: 'GET',
      path: '/api/backoffice/contracts?contractorReference=FPS',
    },
    { fixture: 'contractors/contracts.json' }
  ).as('contractsRequest')
}

describe('Add New Sor Codes - when user unauthorized', () => {
  it("Shows access denied when user doesn't have correct permissions", () => {
    cy.loginWithOperativeRole()

    cy.visit('/backoffice/add-sor-codes')
    cy.contains('Access denied')
  })
})

describe('Add New SOR Codes', () => {
  beforeEach(() => {
    cy.loginWithDataAdminRole()
    contractorsRequest()
    tradesRequest()
    contractsRequest()

    cy.visit('/backoffice/add-sor-codes')
  })

  it('a GET request is triggered on page loads to retrieve contractors', () => {
    cy.wait('@contractorsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })

  it('a GET request is triggered on page loads to retrieve trades', () => {
    cy.wait('@tradesRequest').its('request.method').should('deep.equal', 'GET')
  })

  it('a GET request is triggered on page loads to retrieve available contracts when a contractor is selected', () => {
    cy.wait('@contractorsRequest')
    cy.wait('@tradesRequest')

    cy.get('[data-testid="contractor"]').type('Fairway Property Services')

    cy.wait('@contractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })
})
