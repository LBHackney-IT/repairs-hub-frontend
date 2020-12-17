/// <reference types="cypress" />

beforeEach(() => {
  cy.server()
})

describe('Show property', () => {
  it('Display property details, tenure and alerts', () => {
    // Stub request with property response
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/v2/properties/00012345', '@property')
    cy.visit('properties/00012345')

    // Property details
    cy.get('.govuk-heading-l').contains('Dwelling: 16 Pitcairn House')
    cy.get('.govuk-grid-row').within(() => {
      cy.contains('Property details')
      cy.contains('16 Pitcairn House')
      cy.contains('St Thomass Square')
      cy.contains('E9 6PT')
    })

    // Tenure (raisable repair)
    cy.get('.hackney-property-alerts li.bg-turquoise').within(() => {
      cy.contains('Tenure: Secure')
    })

    // Alerts
    cy.get('.hackney-property-alerts').within(() => {
      // Location alerts
      cy.contains('Address Alert: Property Under Disrepair (DIS)')

      // Person alerts
      cy.contains('Contact Alert: No Lone Visits (CV)')
      cy.contains('Contact Alert: Verbal Abuse or Threat of (VA)')
    })
  })

  it('Display property with a tenure type that does not permit raising a repair', () => {
    // Stub request with property response
    cy.fixture('properties/property_repair_not_raisable.json').as('property')
    cy.route('GET', 'api/v2/properties/00012345', '@property')
    cy.visit('properties/00012345')

    // Tenure (not raisable repair)
    cy.get('.hackney-property-alerts li.bg-orange').within(() => {
      cy.contains('Tenure: Leasehold (RTB)')
    })
  })

  it('Display property with no tenure type', () => {
    // Stub request with property response
    cy.fixture('properties/property_no_tenure.json').as('property')
    cy.route('GET', 'api/v2/properties/00012345', '@property')
    cy.visit('properties/00012345')

    cy.get('.govuk-heading-l').contains('Dwelling: 16 Pitcairn House')
    cy.get('.hackney-property-alerts').should('not.exist')
    cy.contains('Tenure').should('not.exist')
  })
})
