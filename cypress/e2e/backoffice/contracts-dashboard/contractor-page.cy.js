/// <reference types="cypress" />

import 'cypress-audit/commands'

function contractsRequest() {
  cy.intercept(
    {
      method: 'GET',
      path: '/api/backoffice/contracts?',
    },
    { fixture: 'contracts/contractsDashboard.json' }
  ).as('contractsRequest')
}

function activeContractsRequest() {
  cy.fixture('contracts/contractsDashboard.json').then((contracts) => {
    const filtered = contracts.filter(
      (contract) =>
        contract.contractorReference === 'SYC' &&
        contract.terminationDate > new Date().toISOString()
    )

    cy.intercept(
      {
        method: 'GET',
        path: `/api/backoffice/contracts?&isActive=true&contractorReference=SYC`,
      },
      filtered
    ).as('activeContractsRequest')
  })
}

function inactiveContractsRequest() {
  cy.fixture('contracts/contractsDashboard.json').then((contracts) => {
    const filtered = contracts.filter(
      (contract) =>
        contract.contractorReference === 'SYC' &&
        contract.terminationDate > '2020' &&
        contract.terminationDate < new Date().toISOString()
    )

    cy.intercept(
      {
        method: 'GET',
        path: `/api/backoffice/contracts?&isActive=false&contractorReference=SYC`,
      },
      filtered
    ).as('inactiveContractsRequest')
  })
}

describe('contractor page - when user unauthorised', () => {
  it("shows access denied when user doesn't have correct permissions", () => {
    cy.loginWithOperativeRole()
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    cy.contains('Access denied')
  })
})

describe('contractor page - when user has data admin permissions', () => {
  beforeEach(() => {
    cy.loginWithDataAdminRole()
  })

  it('triggers a GET requests on page load to retrieve all relevant contracts', () => {
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    activeContractsRequest()
    inactiveContractsRequest()
    cy.wait('@activeContractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
    cy.wait('@inactiveContractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })

  it('goes from backoffice to contracts dashboard to contractor page to contract dashboard then back to backoffice', () => {
    cy.visit('/backoffice')
    cy.contains('a', 'Contracts Dashboard').click()
    cy.url().should('include', '/backoffice/contracts-dashboard')
    contractsRequest()
    cy.wait('@contractsRequest')
    cy.get('[data-test-id="contractors-list"]')
      .contains('li', 'Sycous Limited')
      .click()
    activeContractsRequest()
    inactiveContractsRequest()
    cy.wait('@activeContractsRequest')
    cy.wait('@inactiveContractsRequest')
    cy.url().should('include', 'backoffice/contractors/SYC')
    cy.get('.govuk-back-link').click()
    cy.url().should('include', '/backoffice/contracts-dashboard')
    cy.get('.govuk-back-link').click()
    cy.url().should('include', '/backoffice')
  })

  it('should display correct amount of active and inactive contracts related to the contractor', () => {
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    activeContractsRequest()
    inactiveContractsRequest()
    cy.wait('@activeContractsRequest').then((interception) => {
      const activeContractsLength = interception.response.body.length
      cy.get('[data-test-id="active-contracts-list"]')
        .children()
        .should('have.length', activeContractsLength)
    })
    cy.wait('@inactiveContractsRequest').then((interception) => {
      const inactiveContractsLength = interception.response.body.length
      cy.get('[data-test-id="active-contracts-list"]')
        .children()
        .should('have.length', inactiveContractsLength)
    })
  })

  it('diplays inactive contracts and no active contracts warning boxes when no active contracts are found', () => {
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    inactiveContractsRequest()
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contracts?&isActive=true&contractorReference=SYC',
      },
      { body: [] }
    )
    cy.wait('@inactiveContractsRequest')
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No active contracts found for Sycous Limited.')
    cy.contains('No inactive contracts found for Sycous Limited.').should(
      'not.exist'
    )
  })

  it('diplays active contracts and no inactive contracts warning boxes when no active contracts are found', () => {
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    activeContractsRequest()
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contracts?&isActive=false&contractorReference=SYC',
      },
      { body: [] }
    )
    cy.wait('@activeContractsRequest')
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No inactive contracts found for Sycous Limited.')
    cy.contains('No active contracts found for Sycous Limited.').should(
      'not.exist'
    )
  })

  it('diplays no active and inactive contracts warning boxes when no active and inactive contracts are found', () => {
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contracts?&isActive=true&contractorReference=SYC',
      },
      { body: [] }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contracts?&isActive=false&contractorReference=SYC',
      },
      { body: [] }
    )
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No active contracts found')
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No inactive contracts found')
  })
})
