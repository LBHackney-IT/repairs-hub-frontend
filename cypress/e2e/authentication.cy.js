/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Authentication', () => {
  context('When the user is not signed in', () => {
    it('Redirects attempts to visit other URLs and shows the sign in page', () => {
      cy.visit('/work-orders/work-orders/10000000')

      cy.url().should('contains', '/login')

      cy.get('header').within(() => {
        cy.contains('a', 'Search').should('not.exist')
        cy.contains('a', 'Manage work orders').should('not.exist')
        cy.contains('a', 'Sign out').should('not.exist')
      })

      cy.contains('Work order').should('not.exist')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.contains('a', 'Sign in with Google')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )
    })
  })

  context('When the user is signed in', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
      cy.visit('/')
    })

    it('Allows signing out', () => {
      cy.get('header').within(() => {
        cy.contains('a', 'Sign out').click()
      })

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.contains('a', 'Sign in with Google')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )
    })
  })
})
