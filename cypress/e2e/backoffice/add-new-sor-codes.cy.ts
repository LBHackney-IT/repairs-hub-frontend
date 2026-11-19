/// <reference types="cypress" />

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
      path: '/api/backoffice/contracts?isActive=true&contractorReference=FPS',
    },
    { fixture: 'contractors/contracts.json' }
  ).as('contractsRequest')
}

function populateForm() {
  // Populate contractor, contract and trade fields
  cy.get('[data-testid="contractor"]').type('Fairway Property Services')

  cy.wait('@contractsRequest')

  cy.get('[data-testid="contract"]').type('001-AJS-EEVR')
  cy.get('[data-testid="trade"]').type('Multi Trade')

  // Fill new SOR code #1
  cy.get('[data-testid="sor-code-input"]').type('SORTEST001')
  cy.get('[data-testid="sor-code-cost-input"]').type('47.5')
  cy.get('[data-testid="sor-code-smv-input"]').type('17')
  cy.get('[data-testid="sor-code-short-desc-input"]').type(
    'Short description #1'
  )
  cy.get('[data-testid="sor-code-long-desc-input"]').type('Long description #1')

  // Add another new SOR code
  cy.contains('+ Add another SOR code').click()

  // Fill new SOR code #2
  cy.get('[data-testid="sor-code-input"]').last().type('SORTEST002')
  cy.get('[data-testid="sor-code-cost-input"]').last().type('17.4')
  cy.get('[data-testid="sor-code-smv-input"]').last().type('23')
  cy.get('[data-testid="sor-code-short-desc-input"]')
    .last()
    .type('Short description #2')
  cy.get('[data-testid="sor-code-long-desc-input"]')
    .last()
    .type('Long description #2')
}

describe('Add New Sor Codes - when user unauthorized', () => {
  it("shows access denied when user doesn't have correct permissions", () => {
    cy.loginWithOperativeRole()
    cy.visit('/backoffice/add-sor-codes')
    cy.contains('Access denied')
  })
})

describe('Add New SOR Codes page - when user has data admin permissions', () => {
  beforeEach(() => {
    cy.loginWithDataAdminRole()
    contractorsRequest()
    tradesRequest()
    contractsRequest()

    cy.visit('/backoffice/add-sor-codes')
  })

  it('triggers a GET request on page load to retrieve contractors', () => {
    cy.wait('@contractorsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })

  it('triggers a GET request on page load to retrieve trades', () => {
    cy.wait('@tradesRequest').its('request.method').should('deep.equal', 'GET')
  })

  it('triggers a GET request on page load to retrieve available contracts when a contractor is selected', () => {
    cy.wait('@contractorsRequest')
    cy.wait('@tradesRequest')

    cy.get('[data-testid="contractor"]').type('Fairway Property Services')

    cy.wait('@contractsRequest')
      .its('request.method')
      .should('deep.equal', 'GET')
  })

  it('shows errors for any field that has not been populated, when submitting', () => {
    const allErrors = [
      'Please select a contractor',
      'Please select a contract',
      'Please select a trade',
      'Please enter SOR code',
      'Please enter cost value',
      'Please enter SMV value',
      'Please enter short description',
      'Please enter long description',
    ]

    cy.wait('@contractorsRequest')
    cy.wait('@tradesRequest')

    cy.get('[data-testid="submit-button"]').click()

    allErrors.forEach((error) => {
      cy.contains(error).should('be.visible')
    })
  })

  it('allows multiple SOR codes to be added and removed', () => {
    cy.wait('@contractorsRequest')
    cy.wait('@tradesRequest')

    // Start with one blank SOR code
    cy.get('label').contains('SOR code').should('have.length', 1)

    // Add 2 new empty SOR codes
    cy.contains('+ Add another SOR code').click()
    cy.contains('+ Add another SOR code').click()

    // Should have a total of 3
    cy.get('[data-testid="sor-code-input"]').should('have.length', 3)

    // We remove the last one
    cy.get('[data-testid="sor-code-remove-link"]').last().click()

    // Should have a total of 2
    cy.get('[data-testid="sor-code-input"]').should('have.length', 2)
  })

  it('does not allow submission if no new SOR codes are on the page', () => {
    cy.wait('@contractorsRequest')
    cy.wait('@tradesRequest')

    // Start with one blank SOR code
    cy.get('label').contains('SOR code').should('have.length', 1)
    cy.get('[data-testid="add-new-sor-code-link"]').should(
      'have.text',
      '+ Add another SOR code'
    )

    // Submit button is enabled
    cy.get('[data-testid="submit-button"]').should('be.enabled')

    // We remove the one SOR code
    cy.get('[data-testid="sor-code-remove-link"]').click()

    // Should have a total of 0 SOR codes
    cy.get('[data-testid="sor-code-input"]').should('have.length', 0)
    cy.get('[data-testid="add-new-sor-code-link"]').should(
      'have.text',
      '+ Add a new SOR code'
    )

    // Submit button is disabled
    cy.get('[data-testid="submit-button"]').should('be.disabled')
  })

  describe('when multiple new SOR codes are added on the page and the user submits the form', () => {
    it('triggers a confirmation modal', () => {
      cy.wait('@contractorsRequest')
      cy.wait('@tradesRequest')

      populateForm()

      cy.get('[data-testid="submit-button"]').click()

      cy.get("[data-test='confirmation-modal']").should('be.visible')
    })

    it('displays a success message if the network request is successful, after all form fields are populated and the form is submitted', () => {
      cy.wait('@contractorsRequest')
      cy.wait('@tradesRequest')

      cy.intercept(
        { method: 'POST', path: '/api/backoffice/sor-codes' },
        { statusCode: 200 }
      ).as('newSORCodeSubmitRequest')

      populateForm()

      // Submit new SOR codes
      cy.get('[data-testid="submit-button"]').click()

      // Press "Add SOR codes" in confirmation modal
      cy.get('[data-test="confirm-button"]').click()

      cy.wait('@newSORCodeSubmitRequest')

      // The page should show a successful confirmation message
      cy.contains('SOR Codes created').should('be.visible')
      cy.contains('Add more SOR codes').should('be.visible')
    })

    it('takes the user back to the form page with blank fields, when the user clicks on the "Add more SOR codes" link under the success message', () => {
      cy.wait('@contractorsRequest')
      cy.wait('@tradesRequest')

      cy.intercept(
        { method: 'POST', path: '/api/backoffice/sor-codes' },
        { statusCode: 200 }
      ).as('newSORCodeSubmitRequest')

      populateForm()

      // Submit new SOR codes
      cy.get('[data-testid="submit-button"]').click()

      // Press "Add SOR codes" in confirmation modal
      cy.get('[data-test="confirm-button"]').click()

      cy.wait('@newSORCodeSubmitRequest')

      // Click on "Add more SOR codes
      cy.contains('Add more SOR codes').click()

      // Assert all the fields are empty
      cy.get('[data-testid="contractor"]').should('be.empty')
      cy.get('[data-testid="contract"]').should('be.empty')
      cy.get('[data-testid="trade"]').should('be.empty')
      cy.get('[data-testid="sor-code-input"]').should('be.empty')
      cy.get('[data-testid="sor-code-cost-input"]').should('be.empty')
      cy.get('[data-testid="sor-code-smv-input"]').should('be.empty')
      cy.get('[data-testid="sor-code-short-desc-input"]').should('be.empty')
      cy.get('[data-testid="sor-code-long-desc-input"]').should('be.empty')
    })

    it('displays an error message if the network request fails, after all form fields are populated and the form is submitted', () => {
      cy.wait('@contractorsRequest')
      cy.wait('@tradesRequest')

      cy.intercept(
        { method: 'POST', path: '/api/backoffice/sor-codes' },
        { forceNetworkError: true }
      ).as('newSORCodeSubmitRequest')

      populateForm()

      // Submit new SOR codes
      cy.get('[data-testid="submit-button"]').click()

      // Press "Add SOR codes" in confirmation modal
      cy.get('[data-test="confirm-button"]').click()

      cy.wait('@newSORCodeSubmitRequest')

      cy.get('[data-testid="error-message"]').should('be.visible')
    })
  })
})
