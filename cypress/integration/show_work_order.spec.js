/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Show work order', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
    cy.server()
    // Stub request for work order and property
    cy.fixture('repairs/work-order.json').as('workOrder')
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/repairs/10000012', '@workOrder')
  })

  context('Displays the page for a work order', () => {
    beforeEach(() => {
      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    })

    it('Works order header with reference number', () => {
      cy.get('.govuk-heading-l').within(() => {
        cy.contains('Works order: 10000012')
      })
    })

    it('Repair description', () => {
      cy.get('.govuk-body-m').within(() => {
        cy.contains('This is an urgent repair description')
      })
    })

    it('Property details', () => {
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

      cy.checkForTenureAlertDetails(
        'Tenure: Secure',
        ['Address Alert: Property Under Disrepair (DIS)'],
        [
          'Contact Alert: No Lone Visits (CV)',
          'Contact Alert: Verbal Abuse or Threat of (VA)',
        ]
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
