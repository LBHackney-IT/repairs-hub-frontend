/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('SOR-Contracts - when user unauthorized', () => {
  it("Shows access denied when user doesn't have correct permissions", () => {
    cy.loginWithOperativeRole()
    cy.visit('/backoffice/sor-contracts')
    cy.contains('Access denied')
  })
})

describe('SOR-Contracts - When Copy selected', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/contractors?getAllContractors=true',
      },
      {
        fixture: 'contractors/contractors.json',
      }
    ).as('contractorsRequest')

    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/sor-contracts')

    cy.wait('@contractorsRequest')
  })

  it('Shows error messages when form fields invalid', () => {
    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'You must enter a source property reference'
    )
    cy.get('.govuk-error-message.lbh-error-message').contains(
      'You must enter a destination property reference'
    )
  })

  it('shows error messages when property references invalid', () => {
    const invalidPropertyReference = 'abc1234'
    cy.get('[data-test="sourcePropertyReference"]').type(
      invalidPropertyReference
    )
    cy.get('[data-test="destinationPropertyReference"]').type(
      invalidPropertyReference
    )

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message')
      .filter(':contains("PropertyReference is invalid")')
      .should('have.length', 2)
  })

  it('shows an error message when both property references match', () => {
    const validPropertyReference = '12345678'
    cy.get('[data-test="sourcePropertyReference"]').type(validPropertyReference)
    cy.get('[data-test="destinationPropertyReference"]').type(
      validPropertyReference
    )

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'The destination property reference cannot match source property reference'
    )
  })

  it('sends request to /sor-contracts', () => {
    cy.intercept(
      {
        method: 'POST',
        path: '/api/backOffice/sor-contracts',
      },
      {
        body: '',
      }
    ).as('sorContractRequest')

    const propertyReference1 = '12345678'
    const propertyReference2 = '87654321'
    cy.get('[data-test="sourcePropertyReference"]').type(propertyReference1)
    cy.get('[data-test="destinationPropertyReference"]').type(
      propertyReference2
    )
    cy.get("[data-test='submit-button']").click()

    cy.wait('@sorContractRequest')

    cy.contains('SOR Contract Modification')
    cy.contains('SOR contracts modified successfully!')
  })
})

describe('SOR-Contracts - When Add selected', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/contractors?getAllContractors=true',
      },
      {
        fixture: 'contractors/contractors.json',
      }
    ).as('contractorsRequest')

    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/sor-contracts')

    cy.wait('@contractorsRequest')

    cy.get('#selectedOption_Add').click()
  })

  it('Shows error messages when form fields invalid', () => {
    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'You must enter a destination property reference'
    )
    cy.get('.govuk-error-message.lbh-error-message').contains(
      'You must select a contractor'
    )
    cy.get('.govuk-error-message.lbh-error-message').contains(
      'You must select a contract'
    )
  })

  it('shows error message when property references invalid', () => {
    const invalidPropertyReference = 'abc1234'
    cy.get('[data-test="destinationPropertyReference"]').type(
      invalidPropertyReference
    )

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'PropertyReference is invalid'
    )
  })

  it('sends request to /sor-contracts', () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/api/backoffice/contracts',
        query: {
          contractorReference: '*',
        },
      },
      {
        fixture: 'contracts/contracts.json',
      }
    ).as('contractsRequest')

    cy.intercept(
      {
        method: 'POST',
        path: '/api/backOffice/sor-contracts',
      },
      {
        body: '',
      }
    ).as('sorContractRequest')

    const propertyReference = '12345678'
    cy.get('[data-test="destinationPropertyReference"]').type(propertyReference)

    const contractor = 'DECORATION ALLOWANCE'
    cy.get('[data-testid="contractor"]').type(contractor)

    const contract = 'F22-H04-GSC3'
    cy.wait('@contractsRequest')
    cy.get('[data-testid="contract"]').type(contract)

    cy.get("[data-test='submit-button']").click()

    cy.wait('@sorContractRequest')

    cy.contains('SOR Contract Modification')
    cy.contains('SOR contracts modified successfully!')
  })
})
