/// <reference types="cypress" />

describe('Property page - legal disrepair', () => {
  context('When property is in legal disrepair', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      ).as('propertyRequest')

      cy.intercept(
        { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
        { fixture: 'properties/propertyInLegalDisrepair.json' }
      ).as('propertyInLegalDisrepair')
    })

    it('Shows warning text', () => {
      cy.loginWithAgentRole()

      cy.visit('/properties/00012345')

      cy.get('.warning-info-box').within(() => {
        cy.contains('This property is currently under legal disrepair')
        cy.contains(
          'Before raising a work order you must call the Legal Disrepair Team'
        )
      })
    })
  })

  context(
    'When property is not in legal desrepair and request response has body false',
    () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
          { body: { propertyIsInLegalDisrepair: false } }
        ).as('propertyInLegalDisrepair')
      })

      it('Does not show warning text', () => {
        cy.loginWithAgentRole()

        cy.visit('/properties/00012345')

        cy.get('[data-testid=over-spend-limit]').should('not.exist')
      })
    }
  )

  context('When legal disrepair request returns an error', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
        {
          statusCode: 404,
          body: {
            message: 'Cannot fetch legal disrepairs',
          },
        }
      ).as('propertyInLegalDisrepairError')
    })

    it('Shows a custom error message for legal disrepair', () => {
      cy.loginWithAgentRole()

      cy.visit('/properties/00012345')

      cy.get('[data-testid=over-spend-limit]').should('not.exist')
      cy.contains(
        'Error loading legal disrepair status: 404 with message: Cannot fetch legal disrepairs'
      )
    })
  })
})
