/// <reference types="cypress" />

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
      cy.contains('button', 'Sign in with Google')
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

    it('Signs out by clearing the session and redirecting to Cognito', () => {
      cy.get('header').within(() => {
        cy.contains('a', 'Sign out').should('have.attr', 'href', '/api/logout')
      })

      // Don't follow the redirect: Cognito is a different site
      cy.request({ url: '/api/logout', followRedirect: false }).then(
        (response) => {
          expect(response.status).to.eq(302)
          expect(response.redirectedToUrl).to.match(
            /\/logout\?client_id=.+&logout_uri=.+%2Flogin$/
          )
        }
      )

      cy.getCookie('next-auth.session-token').should('not.exist')

      cy.visit('/')
      cy.url().should('contain', '/login')
    })
  })
})
