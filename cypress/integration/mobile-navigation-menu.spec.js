/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Mobile navigation menu', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  context('When a user is logged in', () => {
    beforeEach(() => {
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
      })

      cy.get('[data-testid="mobile-menu-button"]').click()

      cy.get('.mobile-menu').should('not.exist')
      cy.contains('Find repair work order or property')
    })
  })
})
