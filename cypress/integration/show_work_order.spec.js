/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search for property', () => {
  beforeEach(() => {
    cy.login()
    cy.server()
    // Stub request for work order and property
    cy.fixture('repairs/work-order.json').as('workOrder')
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/repairs/10000012', '@workOrder')
  })

  it('Displays the page for a work order', () => {
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)

    // Works order header with reference number
    cy.get('.govuk-heading-l').within(() => {
      cy.contains('Works order: 10000012')
    })

    // Repair description
    cy.get('.govuk-body-m').within(() => {
      cy.contains('This is an urgent repair description')
    })

    // Property details
    cy.get('.govuk-grid-row').within(() => {
      cy.contains('Dwelling')
      cy.contains('16 Pitcairn House').should(
        'have.attr',
        'href',
        '/properties/00012345'
      )
      cy.contains('St Thomass Square').should(
        'have.attr',
        'href',
        '/properties/00012345'
      )
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

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
