/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Boiler house flag', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
      },
      { body: [] }
    ).as('workOrdersHistory')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/properties/00012345/alerts',
      },
      {
        body: {
          alerts: [
            {
              type: 'type1',
              comments: 'Alert 1',
            },
            {
              type: 'type2',
              comments: 'Alert 2',
            },
          ],
        },
      }
    ).as('alerts')
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
      {
        method: 'GET',
        path: '/api/properties/guid-pk/4552c539-2e00-8533-078d-9cc59d9115da',
      },
      { fixture: 'properties/boilerHouse.json' }
    ).as('boilerHouse')

    cy.visit('/properties/00012345')

    // wait for page to load
    cy.wait(['@property', '@workOrdersHistory'])

    // wait for boiler house information to load
    cy.wait(['@boilerHouse'])

    // assert boiler house flag contains address
    cy.get('[data-testid="boiler-house-details"]').contains(
      'Booster Pump 1-93 Pitcairn House St Thomass Square',
      {
        timeout: 4000,
      }
    )
    cy.get('[data-testid="boiler-house-details-link"]')
      .should('have.attr', 'href')
      .and('include', '/properties/00012345')
  })
})
