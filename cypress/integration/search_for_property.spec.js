/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search for property', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
    cy.fixture('properties/properties.json').as('propertiesList')
    cy.server()
  })

  context('Search for property by postcode', () => {
    beforeEach(() => {
      // Stub request for search on properties by postcode
      cy.route('GET', 'api/properties/?q=e9 6pt', '@propertiesList')

      // Search by postcode
      cy.get('.govuk-input').clear().type('e9 6pt')
      cy.get('[type="submit"]').contains('Search').click()
      cy.url().should('contains', 'properties/search?q=e9%25206pt')
    })

    it('checks the heading', () => {
      cy.get('.govuk-heading-s').contains(
        'We found 2 matching results for: e9 6pt'
      )
    })

    it('checks the table', () => {
      cy.get('.govuk-table').within(() => {
        cy.contains('th', 'Address')
        cy.contains('th', 'Postcode')
        cy.contains('th', 'Property type')
        cy.contains('th', 'Property reference')
      })

      cy.get('.govuk-table__cell a').should(
        'have.attr',
        'href',
        '/properties/00012345'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('Search for property by address', () => {
    beforeEach(() => {
      // Stub request for search on properties by address
      cy.route('GET', 'api/properties/?q=pitcairn', '@propertiesList')

      // Search by address
      cy.get('.govuk-input').type('pitcairn')
      cy.get('[type="submit"]').contains('Search').click()
    })

    it('checks the heading', () => {
      cy.get('.govuk-heading-s').contains(
        'We found 2 matching results for: pitcairn'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
