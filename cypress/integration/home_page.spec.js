/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Home page', () => {
  context('When user is logged in', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('Displays all necessary components on the home page', () => {
      // Header component
      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      // Logout component
      cy.get('.govuk-link--no-visited-state').contains('Logout')
      cy.get('.govuk-link--no-visited-state').should(
        'have.attr',
        'href',
        '/logout'
      )

      // Search for property component
      cy.get('.govuk-heading-m').contains('Find repair job or property')
      cy.get('.govuk-label').contains(
        'Search by work order reference, postcode or address'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('Redirects to login page once logout is clicked and the cookies are cleared', () => {
      cy.logout()

      // UserLogin component
      cy.get('.govuk-heading-m').contains('Login')
      cy.get('.govuk-body').contains(
        'Please log in with an approved Hackney email account.'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('When user is not logged in', () => {
    it('Redirects on the login page', () => {
      cy.visit(Cypress.env('HOST'))
      // Header component
      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      // UserLogin component
      cy.get('.govuk-heading-m').contains('Login')
      cy.get('.govuk-body').contains(
        'Please log in with an approved Hackney email account.'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
