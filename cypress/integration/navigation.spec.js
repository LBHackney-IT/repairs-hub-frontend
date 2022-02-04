/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Global navigation links', () => {
  context('when the viewport is for mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
      cy.loginWithAgentRole()
      cy.visit('/')
    })

    it('overlays the screen and displays relevant links', () => {
      cy.get('.mobile-menu').should('not.exist')
      cy.contains('Find repair work order or property')

      cy.get('[data-testid="mobile-menu-button"]').click()

      cy.get('.mobile-menu').within(() => {
        cy.get('li').should('have.length', 2)

        cy.get('li').contains('Search')
        cy.get('li').contains('Sign out')
        cy.get('li').contains('Support page.')
      })

      cy.get('[data-testid="mobile-menu-button"]').click()

      cy.get('.mobile-menu').should('not.exist')
      cy.contains('Find repair work order or property')
    })
  })

  context('when the viewport is for wider than mobile', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/workOrders?*',
        },
        { body: [] }
      ).as('workOrdersRequest')

      cy.intercept(
        { method: 'GET', path: '/api/filter/WorkOrder' },
        { fixture: 'filter/workOrder.json' }
      ).as('filtersRequest')

      cy.loginWithContractorRole()

      cy.visit('/')
    })

    it('displays relevant links', () => {
      cy.wait(['@filtersRequest', '@workOrdersRequest'])

      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.get('#manage')
        .contains('Manage work orders')
        .should('have.attr', 'href', '/')

      cy.get('#search')
        .contains('Search')
        .should('have.attr', 'href', '/search')

      cy.get('#signout')
        .contains('Sign out')
        .should('have.attr', 'href', '/logout')

      cy.audit()
    })
  })
})
