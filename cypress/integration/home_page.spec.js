/// <reference types="cypress" />

describe('Home page', () => {
  it('Displays all necessary components on the home page', () => {
    cy.visit('/')

    // Header component
    cy.get('.lbh-header__service-name').contains('Repairs Hub')
    cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

    // Search for property component
    cy.get('.govuk-heading-m').contains('Find property')
    cy.get('.govuk-label').contains('Search by postcode or address')
  })
})
