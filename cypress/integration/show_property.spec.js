/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Show property', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
    cy.server()
  })

  context(
    'Displays property details, tenure, alerts and permit to raise a repair',
    () => {
      beforeEach(() => {
        // Stub request with property response
        cy.fixture('properties/property.json').as('property')
        cy.route('GET', 'api/properties/00012345', '@property')
        cy.visit(`${Cypress.env('HOST')}/properties/00012345`)
      })

      it('shows property address in the heading', () => {
        cy.get('.govuk-heading-l').contains('Dwelling: 16 Pitcairn House')
      })

      it('shows can raise a repair link', () => {
        cy.get('.govuk-heading-m').within(() => {
          cy.contains('Raise a repair on this dwelling')
        })
      })

      it('shows property details section', () => {
        cy.get('.property-details-main-section').within(() => {
          cy.contains('Property details')
          cy.contains('16 Pitcairn House')
          cy.contains('St Thomass Square')
          cy.contains('E9 6PT')
        })
      })

      it('shows Tenure and Alerts section', () => {
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
    }
  )

  context(
    'Displays property with a tenure type that does not permit raising a repair',
    () => {
      beforeEach(() => {
        // Stub request with property response
        cy.fixture('properties/property_repair_not_raisable.json').as(
          'property'
        )
        cy.route('GET', 'api/properties/00012345', '@property')
        cy.visit(`${Cypress.env('HOST')}/properties/00012345`)
      })

      it('shows property address in the heading', () => {
        cy.get('.govuk-heading-l').contains('Dwelling: 16 Pitcairn House')
      })

      it('shows cannot raise a repair text', () => {
        cy.get('.govuk-warning-text').within(() => {
          cy.contains(
            'Cannot raise a repair on this property due to tenure type'
          )
        })
      })

      it('shows Tenure (not raisable repair) section', () => {
        cy.get('.hackney-property-alerts li.bg-orange').within(() => {
          cy.contains('Tenure: Leasehold (RTB)')
        })
      })

      it('does not show Alerts section', () => {
        cy.get('.hackney-property-alerts').should('not.exist')

        // Run lighthouse audit for accessibility report
        cy.audit()
      })
    }
  )

  context('Display property with no tenure type', () => {
    beforeEach(() => {
      // Stub request with property response
      cy.fixture('properties/property_no_tenure.json').as('property')
      cy.route('GET', 'api/properties/00012345', '@property')
      cy.visit(`${Cypress.env('HOST')}/properties/00012345`)
    })

    it('shows property address in the heading', () => {
      cy.get('.govuk-heading-l').contains('Dwelling: 16 Pitcairn House')
    })

    it('does not show property alerts', () => {
      cy.get('.hackney-property-alerts').should('not.exist')
    })

    it('does not show Tenure', () => {
      cy.get('.hackney-property-alerts').should('not.exist')
      cy.contains('Tenure').should('not.exist')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
