/// <reference types="cypress" />

import 'cypress-audit/commands'


describe('Close-WorkOrders - when user unauthorized', () => {
  it('Shows access denied when user doesn\'t have correct permissions', () => {
    cy.loginWithOperativeRole()
    cy.visit('/backoffice/close-workorders')
    cy.contains('Access denied')
  })
})

describe('Close-WorkOrders', () => {
  beforeEach(() => {
    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/close-workorders')
  })

  it('Shows error messages when form fields invalid', () => {
    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'Please enter a reason to close'
    )
    cy.get('.govuk-error-message.lbh-error-message').contains(
      'Please enter workOrder references'
    )
  })

  it('shows an error when date is empty', () => {
    cy.get('#selectedOption_CloseToBase').click()

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'Please enter a closed date'
    )
  })

  it('shows an error when the date is in the future', () => {
    cy.get('#selectedOption_CloseToBase').click()

    const futureDate = '3023-01-01'
    cy.get('[data-testid="ClosedDate"]').type(futureDate)

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'The closed date cannot be in the future'
    )
  })

  it('sends request to /cancel', () => {
    const workOrderReference = '11111111'
    const reasonToClose = 'Blah blh blah'

    cy.intercept(
      {
        method: 'POST',
        path: '/api/backOffice/bulk-close/cancel',
      },
      {
        body: '',
      }
    ).as('cancelRequest')

    cy.get('[data-test="workOrderReferences"]').type(workOrderReference)
    cy.get('[data-test="reasonToClose"]').type(reasonToClose)

    cy.get("[data-test='submit-button']").click()

    cy.wait('@cancelRequest')

    cy.contains('WorkOrders cancelled')
    cy.contains('Bulk-close workOrders')
  })

  it('sends request to /close-to-base', () => {
    const workOrderReference = '11111111'
    const reasonToClose = 'Blah blh blah'
    const closedDate = '2022-01-01'

    cy.intercept(
      {
        method: 'POST',
        path: '/api/backOffice/bulk-close/close-to-base',
      },
      {
        body: '',
      }
    ).as('cancelRequest')

    cy.get('#selectedOption_CloseToBase').click()

    cy.get('[data-test="workOrderReferences"]').type(workOrderReference)
    cy.get('[data-test="reasonToClose"]').type(reasonToClose)

    cy.get('[data-testid="ClosedDate"]').type(closedDate)

    cy.get("[data-test='submit-button']").click()

    cy.wait('@cancelRequest')

    cy.contains('WorkOrders cancelled')
    cy.contains('Bulk-close workOrders')
  })

  it("Resets the form when 'close more' button clicked", () => {
    const workOrderReference = '11111111'
    const reasonToClose = 'Blah blh blah'
    const closedDate = '2022-01-01'

    cy.intercept(
      {
        method: 'POST',
        path: '/api/backOffice/bulk-close/close-to-base',
      },
      {
        body: '',
      }
    ).as('cancelRequest')

    cy.get('#selectedOption_CloseToBase').click()

    cy.get('[data-test="workOrderReferences"]').type(workOrderReference)
    cy.get('[data-test="reasonToClose"]').type(reasonToClose)

    cy.get('[data-testid="ClosedDate"]').type(closedDate)

    cy.get("[data-test='submit-button']").click()

    cy.wait('@cancelRequest')

    cy.get("[data-test='closeMoreButton']").click()

    cy.get('[data-test="workOrderReferences"]').should('be.empty')
    cy.get('[data-test="reasonToClose"]').should('be.empty')
    cy.get('[data-testid="ClosedDate"]').should('be.empty')
  })
})
