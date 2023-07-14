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
        path: '/api/properties/00012345/location-alerts',
      },
      {
        body: {
          alerts: [
            {
              type: 'type1',
              comments: 'Location Alert 1',
            },
            {
              type: 'type2',
              comments: 'Location Alert 2',
            },
          ],
        },
      }
    ).as('locationAlerts')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/properties/tenancyAgreementRef1/person-alerts',
      },
      {
        body: {
          alerts: [
            {
              type: 'type3',
              comments: 'Person Alert 1',
            },
            {
              type: 'type4',
              comments: 'Person Alert 2',
            },
          ],
        },
      }
    ).as('personAlerts')
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
      { method: 'GET', path: '/api/properties/asset-id/e8669dd1-3d7b-0476-2c09-bebccd9e1a8d' },
      { fixture: 'properties/boilerHouse.json' }
    ).as('boilerHouse')

    cy.visit('/properties/00012345')

    // wait for page to load
    cy.wait(['@property', '@boilerHouse', '@workOrdersHistory'])

    // assert boiler house link is visible
    cy.get('[data-testid="boiler-house-details-link"]').contains(
      'Booster Pump 1-93 Pitcairn House  St Thomass Square'
    )
    cy.get('[data-testid="boiler-house-details-link"]')
      .should('have.attr', 'href')
      .and('include', '/properties/00012345')
  })
})
