/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search by work order reference, postcode or address', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
    cy.server()
  })

  describe('Search for property', () => {
    beforeEach(() => {
      cy.fixture('properties/properties.json').as('propertiesList')
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

  describe('Search by work order reference', () => {
    context('Displays the page for a work order', () => {
      beforeEach(() => {
        cy.fixture('repairs/work-order.json').as('workOrder')
        cy.fixture('properties/property.json').as('property')
        cy.route('GET', 'api/properties/00012345', '@property')
        cy.route('GET', 'api/repairs/10000012', '@workOrder')

        // Search by postcode
        cy.get('.govuk-input').clear().type('10000012')
        cy.get('[type="submit"]').contains('Search').click()
        cy.url().should('contains', 'work-orders/10000012')
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
        cy.get('.property-details-main-section').within(() => {
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

      it('Work order details', () => {
        cy.get('.work-order-info').within(() => {
          cy.contains('Status: In Progress')
          cy.contains('Priority: U - Urgent (5 Working days)')
          cy.contains('Raised by Dummy Agent')
          cy.contains('18 Jan 2021, 3:28 pm')
          cy.contains('Target: 23 Jan 2021, 6:30 pm')
          cy.contains('Caller: Jill Smith')
          cy.contains('07700 900999')
        })

        // Run lighthouse audit for accessibility report
        cy.audit()
      })
    })

    context('Displays an error for wrong work order reference', () => {
      beforeEach(() => {
        cy.route({
          method: 'GET',
          url: 'api/repairs/00000000',
          status: 404,
          response: '',
        }).as('repairs_with_error')
        // Search by postcode
        cy.get('.govuk-input').clear().type('00000000')
        cy.get('[type="submit"]').contains('Search').click()
        cy.url().should('contains', 'work-orders/00000000')
        cy.visit(`${Cypress.env('HOST')}/work-orders/00000000`)

        cy.wait('@repairs_with_error')
      })

      it('Error message', () => {
        cy.get('.govuk-error-message').within(() => {
          cy.contains('Could not find a work order with reference 00000000')
        })

        // Run lighthouse audit for accessibility report
        cy.audit()
      })
    })
  })
})
