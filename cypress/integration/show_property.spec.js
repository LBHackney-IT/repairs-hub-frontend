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
        cy.fixture('repairs/work-orders.json').as('workOrders')
        cy.route(
          'GET',
          'api/repairs/?propertyReference=00012345&PageSize=50&PageNumber=1',
          '@workOrders'
        )
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
      })

      it('Displays the repairs history for the property', () => {
        // Repairs history tab should be active
        cy.get('.govuk-tabs__list-item--selected a').contains('Repairs history')

        cy.get('.govuk-tabs').within(() => {
          cy.get('.govuk-tabs__tab').contains('Repairs history')
          cy.get('.govuk-heading-l').contains('Repairs history')

          // Repairs history table headers
          cy.get('.govuk-table').within(() => {
            cy.contains('th', 'Reference')
            cy.contains('th', 'Date raised')
            cy.contains('th', 'Status')
            cy.contains('th', 'Description')
          })
          // Repairs history table rows
          cy.get('[data-ref=10000040]').within(() => {
            cy.contains('10000040')
            cy.contains('22 Jan 2021')
            cy.contains('11:02 am')
            cy.contains('In progress')
            cy.contains('An emergency repair')
          })
          cy.get('[data-ref=10000037]').within(() => {
            cy.contains('10000037')
            cy.contains('21 Jan 2021')
            cy.contains('4:46 pm')
            cy.contains('Work complete')
            cy.contains('A very urgent repair')
          })
          cy.get('[data-ref=10000036]').within(() => {
            cy.contains('10000036')
            cy.contains('21 Jan 2021')
            cy.contains('4:41 pm')
            cy.contains('Work complete')
            cy.contains('An immediate repair')
          })
          cy.get('[data-ref=10000035]').within(() => {
            cy.contains('10000035')
            cy.contains('21 Jan 2021')
            cy.contains('3:03 pm')
            cy.contains('In progress')
            cy.contains('A normal repair')
          })
        })

        // Run lighthouse audit for accessibility report
        cy.audit()
      })

      it('Displays no repairs text when records do not exist', () => {
        cy.route(
          'GET',
          'api/repairs/?propertyReference=00012345&PageSize=50&PageNumber=1',
          '[]'
        )

        cy.get('.govuk-tabs__tab').contains('Repairs history').click()
        cy.get('.govuk-heading-l').contains('Repairs history')
        cy.get('.govuk-heading-s').contains('There are no historical repairs')
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
      })

      it('does not show the Repairs history tab', () => {
        // No repairs history
        cy.contains('Repairs history').should('not.exist')

        // Run lighthouse audit for accessibility report
        cy.audit()
      })
    }
  )

  context('Displays property with no tenure type', () => {
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
    })

    it('does not show the Repairs history tab', () => {
      // No repairs history
      cy.contains('Repairs history').should('not.exist')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
