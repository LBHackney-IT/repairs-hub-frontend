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
        cy.contains('Regeneration Aftercare & Defects Team')
        cy.contains('0208 356 1998')

        cy.contains('a', 'New Property Warranties Spreadsheet')
          .should('have.attr', 'href')
          .and('match', /^https:\/\/docs\.google\.com\/spreadsheets\/d\//)

        cy.contains('a', 'aftercareanddefects@hackney.gov.uk').should(
          'have.attr',
          'href',
          'mailto:aftercareanddefects@hackney.gov.uk'
        )
      })
    })
  })
})
