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

  // Signs in as the Cognito test user (an agent, see
  // cypress/plugins/cognitoSession.ts). Needs COGNITO_E2E_ISSUER,
  // COGNITO_E2E_CLIENT_ID, COGNITO_E2E_USERNAME and COGNITO_E2E_PASSWORD. These
  // tests fail when they aren't set, so they can't be skipped by accident.
  context('When signed in as the Cognito test user', () => {
    beforeEach(() => {
      cy.loginWithRealCognito()
    })

    it('can use the pages an agent has access to', () => {
      cy.visit('/')

      cy.get('header').within(() => {
        cy.contains('a', 'Search')
        cy.contains('a', 'Sign out')
        cy.contains('a', 'Manage work orders').should('not.exist')
      })
    })

    it('signs out by clearing the session and redirecting to Cognito', () => {
      cy.visit('/')

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

    it('is denied the pages for other roles', () => {
      cy.visit('/contracts-dashboard')

      cy.url().should('contain', '/access-denied')
      cy.contains('Access denied')
    })
  })
})
