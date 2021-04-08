/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Home page', () => {
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

  context('When an agent is logged in', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('Shows the search page', () => {
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

  context('When a contractor is logged in', () => {
    describe('Show all work orders', () => {
      context(
        'Displays work order details, reference, date raised, last update, priority, property and description',
        () => {
          //Stub request with work orders response
          beforeEach(() => {
            cy.loginWithContractorRole()
            cy.server()
            cy.fixture('repairs/work-orders.json').as('workorderslist')
            cy.route(
              'GET',
              'api/repairs/?PageSize=10&PageNumber=1',
              '@workorderslist'
            )
            cy.visit(`${Cypress.env('HOST')}/`)
          })

          it('displays headers of the table', () => {
            cy.get('.govuk-table').within(() => {
              cy.contains('th', 'Reference')
              cy.contains('th', 'Date raised')
              cy.contains('th', 'Last update')
              cy.contains('th', 'Priority')
              cy.contains('th', 'Property')
              cy.contains('th', 'Description')
            })
            // Run lighthouse audit for accessibility report
            cy.audit()
          })

          it('displays reference number, date raised, last updated, priority, property address, description', () => {
            cy.get('.govuk-table__cell').within(() => {
              cy.contains('10000040')
              cy.contains('22 Jan 2021')
              cy.contains('21 Jan 2021')
              cy.contains('N - Normal')
              cy.contains('315 Banister House Homerton High Street')
              cy.contains('An emergency repair')
            })
            // Run lighthouse audit for accessibility report
            cy.audit()
          })

          it('does displays next button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Next')
            })
            // Run lighthouse audit for accessibility report
            cy.audit()
          })

          it('does not displays previous button', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Previous').should('not.exist')
            })
            // Run lighthouse audit for accessibility report
            cy.audit()
          })
        }
      )
    })
  })
})
