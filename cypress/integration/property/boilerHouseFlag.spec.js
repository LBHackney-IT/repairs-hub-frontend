/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Boiler house flag', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
  })

  it('doesnt show boilerHouse flag', () => {
    // asset boilerHouseId is empty string
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/propertyWithoutBoilerHouse.json' }
    ).as('property')

    cy.visit('/properties/00012345')

    // wait for page to load
    cy.wait(['@property'])

    // assert boiler house is not visible
    cy.get('[data-testid="boiler-house-details"]').should('not.exist')
  })

  it('shows boilerHouse flag', () => {
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('property')

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/boilerHouse.json' }
    ).as('boilerHouse')

    cy.visit('/properties/00012345')

    // wait for page to load
    cy.wait(['@property', '@boilerHouse'])

    // assert boiler house link is visible
    cy.get('[data-testid="boiler-house-details-link"]').contains(
      'Booster Pump 1-93 Pitcairn House  St Thomass Square'
    )
    cy.get('[data-testid="boiler-house-details-link"]')
      .should('have.attr', 'href')
      .and('include', '/properties/00012345')
  })
})
