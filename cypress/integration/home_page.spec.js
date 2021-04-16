/// <reference types="cypress" />

import 'cypress-audit/commands'
import { PAGE_SIZE_CONTRACTORS } from '../../src/utils/frontend-api-client/repairs'

describe('Home page', () => {
  context('When user is not logged in', () => {
    it('Redirects on the login page', () => {
      cy.visit(Cypress.env('HOST'))
      // Header component
      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      // UserLogin component
      cy.get('.lbh-heading-h2').contains('Login')
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

      // Search link
      cy.get('#search')
        .contains('Search')
        .should('have.attr', 'href', '/search')

      // Logout component
      cy.get('#logout')
        .contains('Logout')
        .should('have.attr', 'href', '/logout')

      // Search for property component
      cy.get('.lbh-heading-h2').contains('Find repair job or property')
      cy.get('.govuk-label').contains(
        'Search by work order reference, postcode or address'
      )

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('Redirects to login page once logout is clicked and the cookies are cleared', () => {
      cy.logout()

      // UserLogin component
      cy.get('.lbh-heading-h2').contains('Login')
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
              `api/repairs/?PageSize=${PAGE_SIZE_CONTRACTORS}&PageNumber=1`,
              '@workorderslist'
            )
            cy.visit(`${Cypress.env('HOST')}/`)
          })

          it('displays content in the header', () => {
            // Header component
            cy.get('.lbh-header__service-name').contains('Repairs Hub')
            cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

            // Manage jobs link
            cy.get('.lbh-header__links a').eq(0).contains('Manage jobs')
            cy.get('.lbh-header__links a')
              .eq(0)
              .should('have.attr', 'href', '/')

            // Search link
            cy.get('#search')
              .contains('Search')
              .should('have.attr', 'href', '/search')

            // Logout component
            cy.get('#logout')
              .contains('Logout')
              .should('have.attr', 'href', '/logout')
          })

          it('Displays the first page of repairs', () => {
            cy.get('.govuk-table').within(() => {
              cy.contains('th', 'Reference')
              cy.contains('th', 'Date raised')
              cy.contains('th', 'Last update')
              cy.contains('th', 'Priority')
              cy.contains('th', 'Property')
              cy.contains('th', 'Status')
              cy.contains('th', 'Description')
            })
            // Check the first row
            cy.get('[data-ref=10000040]').within(() => {
              cy.contains('10000040')
              cy.contains('22 Jan 2021')
              cy.contains('[E] EMERGENCY')
              cy.contains('315 Banister House Homerton High Street')
              cy.contains('In progress')
              cy.contains('An emergency repair')
            })
          })

          it('does not display next button when work orders are less than PAGE_SIZE_CONTRACTORS', () => {
            cy.get('.page-navigation').within(() => {
              cy.contains('Next').should('not.exist')
            })
            // Run lighthouse audit for accessibility report
            cy.audit()
          })

          it('does not display previous button', () => {
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
