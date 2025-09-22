/// <reference types="cypress" />

describe('SOR-Contracts - when user unauthorized', () => {
  it("shows access denied when user doesn't have correct permissions", () => {
    cy.loginWithOperativeRole()
    cy.visit('/backoffice/sor-contracts')
    cy.contains('Access denied').should('be.visible')
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

  it('shows error messages when form fields invalid', () => {
    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message')
      .contains('You must enter a source property reference')
      .should('be.visible')
    cy.get('.govuk-error-message.lbh-error-message')
      .contains('You must enter a destination property reference')
      .should('be.visible')
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

    cy.get('.govuk-error-message.lbh-error-message')
      .contains(
        'The destination property reference cannot match source property reference'
      )
      .should('be.visible')
  })

  it('sends request to /sor-contracts after displaying the confirmation modal', () => {
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

    // Assert confirmation modal is visible
    cy.get("[data-test='confirmation-modal']").should('be.visible')

    // Click 'Modify SOR contract' modal button
    cy.get("[data-test='confirm-button']").click()

    cy.wait('@sorContractRequest')
      .its('request.url')
      .should('contain', '/api/backOffice/sor-contracts')

    cy.contains('SOR contract modification').should('be.visible')
    cy.contains('SOR Contracts Updated').should('be.visible')
  })

  it('resets the form after the user clicks on the "Update more SOR contracts" and the fields are empty', () => {
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

    // Click 'Modify SOR contract' modal button
    cy.get("[data-test='confirm-button']").click()

    cy.wait('@sorContractRequest')

    // Click on reset form button
    cy.contains('Update more SOR contracts').click()

    // Assert fields are empty
    cy.get('[data-test="sourcePropertyReference"]').should('be.empty')
    cy.get('[data-test="destinationPropertyReference"]').should('be.empty')
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

  it('shows error messages when form fields invalid', () => {
    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message')
      .contains('You must enter a destination property reference')
      .should('be.visible')
    cy.get('.govuk-error-message.lbh-error-message')
      .contains('You must select a contractor')
      .should('be.visible')
    cy.get('.govuk-error-message.lbh-error-message')
      .contains('You must select a contract')
      .should('be.visible')
  })

  it('shows error message when property references invalid', () => {
    const invalidPropertyReference = 'abc1234'
    cy.get('[data-test="destinationPropertyReference"]').type(
      invalidPropertyReference
    )

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message')
      .contains('PropertyReference is invalid')
      .should('be.visible')
  })

  it('sends request to /sor-contracts after displaying the confirmation modal', () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/api/backoffice/contracts*',
        query: {
          isActive: '*',
          contractorReference: '*',
          sorCode: '',
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

    // Assert confirmation modal is visible
    cy.get("[data-test='confirmation-modal']").should('be.visible')

    // Click 'Modify SOR contract' modal button
    cy.get("[data-test='confirm-button']").click()

    cy.wait('@sorContractRequest')
      .its('request.url')
      .should('contain', '/api/backOffice/sor-contracts')

    cy.contains('SOR contract modification').should('be.visible')
    cy.contains('SOR Contracts Updated').should('be.visible')
  })

  it('resets the form after the user clicks on the "Update more SOR contracts" and the fields are empty', () => {
    cy.intercept(
      {
        method: 'GET',
        pathname: '/api/backoffice/contracts*',
        query: {
          isActive: '*',
          contractorReference: '*',
          sorCode: '',
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

    // Click 'Modify SOR contract' modal button
    cy.get("[data-test='confirm-button']").click()

    cy.wait('@sorContractRequest')

    // Click on reset form button
    cy.contains('Update more SOR contracts').click()

    // Assert fields are empty
    cy.get('[data-test="destinationPropertyReference"]').should('be.empty')
    cy.get('[data-testid="contractor"]').should('be.empty')
    cy.get('[data-testid="contract"]').should('be.empty')
  })
})
