/// <reference types="cypress" />

import 'cypress-audit/commands'
const today = new Date()
const aMonthInTheFuture = new Date(
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate()
)
const twoMonthsInTheFuture = new Date(
  today.getFullYear(),
  today.getMonth() + 2,
  today.getDate()
)

function contractsRequest() {
  cy.intercept(
    {
      method: 'GET',
      path: '/api/backoffice/contracts?isActive=&contractorReference=&sorCode=',
    },
    { fixture: 'contracts/contractsDashboard.json' }
  ).as('contractsRequest')
}

function modifiedContractsRequest() {
  cy.fixture('contracts/contractsDashboard.json').then((contracts) => {
    contracts[3].terminationDate = aMonthInTheFuture.toISOString()
    contracts[4].terminationDate = aMonthInTheFuture.toISOString()
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contracts?isActive=&contractorReference=&sorCode=',
      },
      contracts
    ).as('modifiedContractsRequest')
  })
}

describe('Contracts dashboard - when user unauthorised', () => {
  it("shows access denied when user doesn't have correct permissions", () => {
    cy.loginWithOperativeRole()
    cy.visit('/backoffice/contracts-dashboard')
    cy.contains('Access denied')
  })
})

describe('Contracts dashboard page - when user has data admin permissions', () => {
  beforeEach(() => {
    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/contracts-dashboard')
  })

  it('triggers a GET request on page load to retrieve all relevant contracts', () => {
    contractsRequest()
    cy.wait('@contractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })

  it('goes from backoffice to contracts dashboard then back to backoffice', () => {
    cy.visit('/backoffice')
    cy.contains('a', 'Contracts Dashboard').click()
    cy.url().should('include', '/backoffice/contracts-dashboard')
    contractsRequest()
    cy.wait('@contractsRequest')
    cy.get('.govuk-back-link').click()
    cy.url().should('include', '/backoffice')
  })

  it('displays contracts that are expiring in the next two months', () => {
    modifiedContractsRequest()
    cy.wait('@modifiedContractsRequest')
    cy.get('@modifiedContractsRequest').then((interception) => {
      const contracts = interception.response.body
      const contractsExpiringInTwoMonths = contracts.filter((contract) => {
        return (
          new Date(contract.terminationDate) > today &&
          new Date(contract.terminationDate) < twoMonthsInTheFuture
        )
      })
      const contractsExpiringInTwoMonthsLength =
        contractsExpiringInTwoMonths.length
      cy.get('[data-test-id="contract-list"]')
        .children()
        .should('have.length', contractsExpiringInTwoMonthsLength)
    })
  })

  it('displays contractors that have relevant contracts in alphabetical order', () => {
    modifiedContractsRequest()
    cy.wait('@modifiedContractsRequest')
    cy.get('@modifiedContractsRequest').then((interception) => {
      const contracts = interception.response.body
      const relevantContracts = contracts.filter(
        (c) => c.terminationDate > '2020'
      )
      const contractors = new Set(
        relevantContracts.map((contract) => {
          return contract.contractorName
        })
      )
      const sortedContractors = [...contractors].sort((a, b) =>
        a.localeCompare(b)
      )
      cy.get('[data-test-id="contractors-list"]')
        .children()
        .should('have.length', contractors.size)
      cy.get('[data-test-id="contractors-list"]')
        .children()
        .each(($el, index) => {
          cy.wrap($el).invoke('text').should('equal', sortedContractors[index])
        })
    })
  })

  it.only('diplays no contracts warning box when no contracts expire in the next two months', () => {
    contractsRequest()
    cy.wait('@contractsRequest')
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No contracts expiring in the next two months.')
  })

  it('diplays no contractors warning box when no contractors are found', () => {
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contracts?isActive=&contractorReference=&sorCode=',
      },
      { body: [] }
    )
    cy.get('[data-testid="no-contractors-found"]')
      .should('be.visible')
      .should('contain', 'Problem loading contractors.')
  })

  it('displays an error message if api params have no matching contracts', () => {
    cy.intercept({
      method: 'GET',
      path:
        '/api/backoffice/contracts?isActive=blah&contractorReference=blah&sorCode=blah',
    }).as('contractErrorRequest')

    cy.get('[data-testid="error-message"]').should('be.visible')
  })
})
