/// <reference types="cypress" />

beforeEach(() => {
  cy.fixture('properties/properties.json').as('propertiesList')
  cy.server()
})

describe('Search for property', () => {
  it('Search for property by postcode', () => {
    cy.fixture('properties/property.json').as('property')

    // Stub request for search on properties by postcode
    cy.route('GET', 'api/v2/properties/?q=e9 6pt', '@propertiesList')

    // Search by postcode
    cy.visit('/')
    cy.get('.govuk-input').clear().type('e9 6pt')
    cy.get('[type="submit"]').contains('Search').click()
    cy.url().should('contains', 'properties/search?q')

    cy.get('.govuk-heading-s').contains(
      'We found 2 matching results for: e9 6pt'
    )

    cy.get('.govuk-table').within(() => {
      cy.contains('th', 'Address')
      cy.contains('th', 'Postcode')
      cy.contains('th', 'Property type')
      cy.contains('th', 'Property reference')
    })

    // Stub request for property response
    cy.route('GET', 'api/v2/properties/00012345', '@property')

    // Click property with reference 00012345
    cy.get('.govuk-table__cell a').first().click()
    cy.url().should('contains', 'properties/00012345')

    cy.get('.govuk-heading-l').contains('Dwelling: 16 Pitcairn House')

    // Property details
    cy.get('.govuk-grid-row').within(() => {
      cy.contains('Property details')
      cy.contains('16 Pitcairn House')
      cy.contains('St Thomass Square')
      cy.contains('E9 6PT')
    })

    // Address alerts
    cy.get('.hackney-property-alerts').within(() => {
      cy.contains('Address alerts:')
      cy.contains('Property Under Disrepair')
      cy.contains('(DIS)')
    })
  })

  it('Search for property by address', () => {
    // Stub request for search on properties by address
    cy.route('GET', 'api/v2/properties/?q=pitcairn', '@propertiesList')

    // Search by address
    cy.get('.lbh-header__title-link').click()
    cy.get('.govuk-input').type('pitcairn')
    cy.get('[type="submit"]').contains('Search').click()

    cy.get('.govuk-heading-s').contains(
      'We found 2 matching results for: pitcairn'
    )
  })
})
