import {
  monthsOffset,
  today,
} from '@/root/src/components/BackOffice/ContractsDashboard/utils'

/// <reference types="cypress" />

function contractsRequest(mapper = null) {
  cy.fixture('contracts/contractsDashboard.json').then((contracts) => {
    cy.intercept(
      {
        method: 'GET',
        path: `/api/backoffice/contracts?&isActive=true`,
      },
      mapper ? mapper(contracts) : contracts
    ).as('contractsRequest')
  })
}

function inactiveContractsRequest(mapper = null) {
  cy.fixture('contracts/contractsDashboard.json').then((contracts) => {
    cy.intercept(
      {
        method: 'GET',
        path: `/api/backoffice/contracts?&isActive=false`,
      },
      mapper ? mapper(contracts) : contracts
    ).as('inactiveContractsRequest')
  })
}

function contractorsRequest() {
  cy.fixture('contractors/contractsDashboardContractorData').then(
    (contractors) => {
      const alphabeticalContractors = contractors.sort((a, b) =>
        a.contractorName.localeCompare(b.contractorName)
      )
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/backoffice/contractors?&contractsExpiryFilterDate=2020-01-01T00:00:00.000Z',
        },
        alphabeticalContractors
      ).as('contractorsRequest')
    }
  )
}

function modifiedActiveContractsRequest() {
  cy.fixture('contracts/contractsDashboard.json').then((contracts) => {
    contracts[3].terminationDate = monthsOffset(1, today).toISOString()
    contracts[4].terminationDate = monthsOffset(2, today).toISOString()
    cy.intercept(
      {
        method: 'GET',
        path: '/api/backoffice/contracts?&isActive=true',
      },
      contracts
    ).as('modifiedActiveContractsRequest')
  })
}

function modifiedInactiveContractsRequest() {
  cy.fixture('contracts/contractsDashboard.json').then((contracts) => {
    contracts[3].terminationDate = monthsOffset(-1, today).toISOString()
    cy.intercept(
      {
        method: 'GET',
        path: '/api/backoffice/contracts?&isActive=false',
      },
      contracts
    ).as('modifiedInactiveContractsRequest')
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

  it('triggers GET requests on page load to retrieve all relevant contracts and contractors', () => {
    contractsRequest()
    contractorsRequest()
    cy.wait('@contractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
    cy.wait('@contractorsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })

  it('goes from backoffice to contracts dashboard then back to backoffice', () => {
    cy.visit('/backoffice')
    cy.contains('a', 'Contracts Dashboard').click()
    cy.url().should('include', '/backoffice/contracts-dashboard')
    contractsRequest()
    contractorsRequest()
    cy.wait('@contractorsRequest')
    cy.wait('@contractsRequest')
    cy.get('.govuk-back-link').click()
    cy.url().should('include', '/backoffice')
  })

  it('displays contracts that are expiring in the next two months', () => {
    modifiedActiveContractsRequest()
    cy.wait('@modifiedActiveContractsRequest')
    cy.get('@modifiedActiveContractsRequest').then((interception) => {
      const contracts = interception.response.body
      const contractsExpiringInTwoMonths = contracts.filter((contract) => {
        return (
          new Date(contract.terminationDate) > today &&
          new Date(contract.terminationDate) < monthsOffset(2, today)
        )
      })
      cy.get('[data-test-id="contract-list"]')
        .children()
        .should('have.length', contractsExpiringInTwoMonths.length)
    })
  })

  it('displays contracts that expired within the last month', () => {
    modifiedInactiveContractsRequest()
    cy.wait('@modifiedInactiveContractsRequest')
    cy.get('@modifiedInactiveContractsRequest').then((interception) => {
      const contracts = interception.response.body
      const contractsExpiredInLastMonth = contracts.filter((contract) => {
        return (
          new Date(contract.terminationDate) < today &&
          new Date(contract.terminationDate) > monthsOffset(-1, today)
        )
      })
      cy.get('[data-test-id="contract-list"]')
        .children()
        .should('have.length', contractsExpiredInLastMonth.length)
    })
  })

  it('displays contractors in alphabetical order', () => {
    contractorsRequest()
    contractsRequest()
    cy.wait('@contractorsRequest').then((interception) => {
      const data = interception.response.body
      const alphabeticalContractors = data.sort((a, b) =>
        a.contractorName.localeCompare(b.contractorName)
      )
      const contractorsLength = data.length

      cy.get('[data-test-id="contractors-list"]')
        .children()
        .should('have.length', contractorsLength)
      cy.get('[data-test-id="contractors-list"]')
        .children()
        .each(($el, index) => {
          cy.wrap($el)
            .invoke('text')
            .should('contain', alphabeticalContractors[index].contractorName)
            .should(
              'contain',
              alphabeticalContractors[index].activeContractCount
            )
        })
    })
  })

  it('displays no contracts warning box when no contracts expire in the next two months', () => {
    const dateInOneYear = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    )

    contractsRequest((x) => {
      return x.map((c) => ({
        ...c,
        terminationDate: dateInOneYear,
      }))
    })

    cy.wait('@contractsRequest')
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No contracts expiring in the next two months.')
  })

  it('displays no contracts warning box when no contracts have expired in the last month', () => {
    const dateTwoMonthsAgo = new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    )

    inactiveContractsRequest((x) => {
      return x.map((c) => ({
        ...c,
        terminationDate: dateTwoMonthsAgo,
      }))
    })

    cy.wait('@inactiveContractsRequest')
    cy.get('[data-testid="no-contracts-found"]')
      .should('be.visible')
      .should('contain', 'No contracts have expired in the last month.')
  })

  it('displays no contractors warning box when no contractors are found', () => {
    contractsRequest()
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/backoffice/contractors?&contractsExpiryFilterDate=2020-01-01T00:00:00.000Z',
      },
      []
    ).as('contractorsRequestEmpty')

    cy.get('[data-testid="no-contractors-found"]')
      .should('be.visible')
      .should('contain', 'No contractors found!')
  })

  it('displays an error messages if api params have no matching data', () => {
    cy.intercept({
      method: 'GET',
      path: '/api/backoffice/contracts?isActive={hello}',
    }).as('contractErrorRequest')

    cy.intercept({
      method: 'GET',
      path: '/api/backoffice/contractors?hello',
    }).as('contractorErrorRequest')

    cy.get('[data-testid="error-message"]')
      .should('have.length', 3)
      .each(($el) => {
        cy.wrap($el).should('be.visible')
      })
  })
})
