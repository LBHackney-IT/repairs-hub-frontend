/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Home page', () => {
  beforeEach(() => {
    cy.getCookies().should('be.empty')
    cy.setCookie('hackneyToken', Cypress.env('GSSO_TEST_KEY'))
    cy.getCookie('hackneyToken').should(
      'have.property',
      'value',
      Cypress.env('GSSO_TEST_KEY')
    )
    cy.visit(Cypress.env('HOST'))
  })

  it('Displays all necessary components on the home page', () => {
    // Header component
    cy.get('.lbh-header__service-name').contains('Repairs Hub')
    cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

    // Search for property component
    cy.get('.govuk-heading-m').contains('Find property')
    cy.get('.govuk-label').contains('Search by postcode or address')

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
