/// <reference types="cypress" />

function contractsRequest() {
  cy.intercept(
    {
      method: 'GET',
      path: '/api/backoffice/contracts?&isActive=true',
    },
    { fixture: 'contracts/contractsDashboard.json' }
  ).as('contractsRequest')
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
    cy.visit('/contractors/SYC?contractorName=Sycous+Limited')
    cy.contains('Access denied')
  })
})

describe('contractor page - when user has data admin permissions', () => {
  beforeEach(() => {
    cy.loginWithDataAdminRole()
  })

  it('triggers a GET requests on page load to retrieve all relevant contracts', () => {
    cy.visit('/contractors/SYC?contractorName=Sycous+Limited')
    activeContractsRequest()
    inactiveContractsRequest()
    cy.wait('@activeContractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
    cy.wait('@inactiveContractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })

  it.only('goes from homepage to contracts dashboard to contractor page to contract dashboard then back to homepage', () => {
    cy.visit('/')
    cy.contains('a', 'Contracts Dashboard').click()
    cy.url().should('include', '/contracts-dashboard')
    contractsRequest()
    contractorsRequest()
    cy.wait('@contractsRequest')
    cy.wait('@contractorsRequest')
    cy.get('[data-test-id="contractors-list"]')
      .contains('li', 'Sycous Limited')
      .click()
    activeContractsRequest()
    inactiveContractsRequest()
    cy.wait('@activeContractsRequest')
    cy.wait('@inactiveContractsRequest')
    cy.url().should('include', '/contractors/SYC')
    cy.get('.govuk-back-link').click()
    cy.url().should('include', '/contracts-dashboard')
    cy.get('.govuk-back-link').click()
    cy.url().should('include', '/')
  })

  describe('Active and inactive contracts', () => {
    it('should display correct amount of active and inactive contracts related to the contractor', () => {
      cy.visit('/contractors/SYC?contractorName=Sycous+Limited')
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

    it('displays inactive contracts and no active contracts warning boxes when no active contracts are found', () => {
      cy.visit('/contractors/SYC?contractorName=Sycous+Limited')
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

    it('displays active contracts and no inactive contracts warning boxes when no active contracts are found', () => {
      cy.visit('/contractors/SYC?contractorName=Sycous+Limited')
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

    it('displays no active and inactive contracts warning boxes when no active and inactive contracts are found', () => {
      cy.visit('/contractors/SYC?contractorName=Sycous+Limited')
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

  describe('sor code search', () => {
    it('searches for an sor code and displays contracts that have it', () => {
      cy.visit('/contractors/SYC?contractorName=Syc')
      activeContractsRequest()
      inactiveContractsRequest()
      cy.get('[data-testid="input-search"]').type('ABC1240')
      cy.get('[data-testid="submit-search"]').click()
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/backoffice/contracts?&contractorReference=SYC&sorCode=ABC1240',
        },
        {
          body: [
            {
              contractReference: '127-127-1277',
              terminationDate: '2025-06-15T23:00:00Z',
              effectiveDate: '2023-09-15T23:00:00Z',
              contractorReference: 'SCC',
              contractorName: 'Alphatrack (S) Systems Lt',
              isRaisable: true,
              sorCount: 0,
              sorCost: 0,
            },
            {
              contractReference: '128-128-1288',
              terminationDate: '2026-03-31T00:00:00Z',
              effectiveDate: '2024-01-04T00:00:00Z',
              contractorReference: 'SYC',
              contractorName: 'Sycous Limited',
              isRaisable: true,
              sorCount: 34,
              sorCost: 5958.38,
            },
            {
              contractReference: '129-129-1299',
              terminationDate: '2026-03-31T23:00:00Z',
              effectiveDate: '2024-08-01T00:00:00Z',
              contractorReference: 'WIG',
              contractorName: 'THE WIGGETT GROUP LTD',
              isRaisable: true,
              sorCount: 3441,
              sorCost: 544898.23,
            },
          ],
        }
      ).as('sorContracts')
      cy.wait('@sorContracts').then((interception) => {
        const sorContractsLength = interception.response.body.length
        cy.get('[data-test-id="contract-list"]')
          .children()
          .should('have.length', sorContractsLength)
      })
    })
    it('searches for an sor code and displays no contracts have that sor code message', () => {
      cy.visit('/contractors/SYC?contractorName=Syc')
      activeContractsRequest()
      inactiveContractsRequest()
      cy.get('[data-testid="input-search"]').type('ABC1240')
      cy.get('[data-testid="submit-search"]').click()
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/backoffice/contracts?&contractorReference=SYC&sorCode=ABC1240',
        },
        {
          body: [],
        }
      ).as('sorContracts')
      cy.wait('@sorContracts')
      cy.get('[data-test-id="contract-list"]').should('not.exist')
      cy.contains('No contracts with ABC1240 SOR code')
    })

    it('displays error when sor request does not contain sor code', () => {
      cy.visit('/contractors/SYC?contractorName=Syc')
      activeContractsRequest()
      inactiveContractsRequest()
      cy.get('[data-testid="input-search"]').type('ABC1240')
      cy.get('[data-testid="submit-search"]').click()
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/backoffice/contracts?&contractorReference=SYC&sorCode=ABC1240',
        },
        {
          forceNetworkError: true,
        }
      ).as('sorContractsBadRequest')
      cy.wait('@sorContractsBadRequest')
      cy.get('[data-testid="error-message"]').should('be.visible')
    })
  })
})
