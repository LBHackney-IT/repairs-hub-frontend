/// <reference types="cypress" />

describe('Property page - under warranty', () => {
  context('When property is under warranty', () => {
    beforeEach(() => {
      cy.fixture('properties/property.json').then((propertyResponse) => {
        propertyResponse.property.isUnderWarranty = true
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { body: propertyResponse }
        ).as('propertyRequest')
      })

      cy.intercept({
        method: 'GET',
        path: '/api/properties/legalDisrepair/00012345',
      })
    })

    it('Shows warning info', () => {
      cy.loginWithAgentRole()

      cy.visit('/properties/00012345')

      cy.get('.warning-info-box').within(() => {
        cy.contains('This property is under warranty')
        cy.contains('New Property Warranties Spreadsheet')
        cy.get('a')
          .should('have.attr', 'href')
          .and('match', /^https:\/\/docs\.google\.com\/spreadsheets\/d\//)
      })
    })
  })
})
