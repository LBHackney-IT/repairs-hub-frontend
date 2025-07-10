/// <reference types="cypress" />

import 'cypress-audit/commands'

function contractsRequest() {
  cy.intercept(
    {
      method: 'GET',
      path: '/api/backoffice/contracts?isActive=&contractorReference=&sorCode=',
    },
    { fixture: 'contracts/contractsDashboard.json' }
  ).as('contractsRequest')
}

function contractsContractorsRequest(isActive) {
  cy.fixture('contracts/contractsDashboard.json').then((contracts) => {
    let filtered = []
    if (isActive === true) {
      filtered = contracts.filter(
        (contract) =>
          contract.contractorReference === 'SYC' &&
          contract.terminationDate > new Date().toISOString()
      )
    }
    if (isActive === false) {
      filtered = contracts.filter(
        (contract) =>
          contract.contractorReference === 'SYC' &&
          contract.terminationDate > '2020' &&
          contract.terminationDate < new Date().toISOString()
      )
    }
    cy.intercept(
      {
        method: 'GET',
        path: `/api/backoffice/contracts?isActive=${isActive}&contractorReference=SYC`,
      },
      filtered
    ).as(`${isActive ? 'active' : 'inactive'}ContractorContractsRequest`)
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
    contractsContractorsRequest(true)
    contractsContractorsRequest(false)
    cy.wait('@activeContractorContractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
    cy.wait('@inactiveContractorContractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })

  it('goes from backoffice to contracts dashboard to contractor page to contract dashboard then back to backoffice', () => {
    cy.visit('/backoffice')
    cy.contains('a', 'Contracts Dashboard').click()
    cy.url().should('include', '/backoffice/contracts-dashboard')
    contractsRequest()
    cy.wait('@contractsRequest')
    cy.contains('li', 'Sycous Limited').click()
    contractsContractorsRequest(true)
    contractsContractorsRequest(false)
    cy.wait('@activeContractorContractsRequest')
    cy.wait('@inactiveContractorContractsRequest')
    cy.url().should(
      'include',
      'backoffice/contractors/SYC?contractorName=Sycous+Limited'
    )
    cy.get('.govuk-back-link').click()
    cy.url().should('include', '/backoffice/contracts-dashboard')
    cy.get('.govuk-back-link').click()
    cy.url().should('include', '/backoffice')
  })

  it('should display correct amount of active and inactive contracts related to the contractor', () => {
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    contractsContractorsRequest(true)
    contractsContractorsRequest(false)
    cy.wait('@activeContractorContractsRequest').then((interception) => {
      const activeContractsLength = interception.response.body.length
      cy.get('[data-test-id="active-contracts-list"]')
        .children()
        .should('have.length', activeContractsLength)
    })
    cy.wait('@inactiveContractorContractsRequest').then((interception) => {
      const inactiveContractsLength = interception.response.body.length
      cy.get('[data-test-id="active-contracts-list"]')
        .children()
        .should('have.length', inactiveContractsLength)
    })
  })

  it('diplays inactive contracts and no active contracts warning boxes when no active contracts are found', () => {
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    contractsContractorsRequest(false)
    cy.intercept(
      {
        method: 'GET',
        path: '/api/backoffice/contracts?isActive=true&contractorReference=SYC',
      },
      { body: [] }
    )
    cy.wait('@inactiveContractorContractsRequest')
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No active contracts found for Sycous Limited.')
    cy.contains('No inactive contracts found for Sycous Limited.').should(
      'not.exist'
    )
  })

  it('diplays active contracts and no inactive contracts warning boxes when no active contracts are found', () => {
    cy.visit('/backoffice/contractors/SYC?contractorName=Sycous+Limited')
    contractsContractorsRequest(true)
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contracts?isActive=false&contractorReference=SYC',
      },
      { body: [] }
    )
    cy.wait('@activeContractorContractsRequest')
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
        path: '/api/backoffice/contracts?isActive=true&contractorReference=SYC',
      },
      { body: [] }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contracts?isActive=false&contractorReference=SYC',
      },
      { body: [] }
    )
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No active contracts found for Sycous Limited.')
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No inactive contracts found for Sycous Limited.')
  })
})
