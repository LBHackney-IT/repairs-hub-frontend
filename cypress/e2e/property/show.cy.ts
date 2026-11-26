/// <reference types="cypress" />

describe('Show property', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('property')

    cy.intercept(
      { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
      { body: { propertyIsInLegalDisrepair: false } }
    ).as('legalDisrepair')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/properties/guid-pk/4552c539-2e00-8533-078d-9cc59d9115da',
      },
      { fixture: 'properties/boilerHouse.json' }
    ).as('boilerHouse')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
      },
      {
        body: [
          {
            reference: 10000012,
            dateRaised: '2021-02-01T11:02:00.334849',
            priority: '2 [E] EMERGENCY',
            propertyReference: '00012345',
            tradeCode: 'DE',
            tradeDescription: 'Door Entry Engineer - DE',
            description: 'The latest repair',
            status: 'In Progress',
          },
        ],
      }
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
              type: 'SPR',
              comments: 'Specific Requirements',
              reason: 'Reason 1, very important',
            },
          ],
        },
      }
    ).as('alerts')
  })

  it('displays the property', () => {
    cy.visit('/properties/00012345')
    cy.wait([
      '@property',
      '@legalDisrepair',
      '@alerts',
      '@boilerHouse',
      '@workOrdersHistory',
    ])

    cy.get('.lbh-heading-h1').contains('Dwelling: 16 Pitcairn House')

    cy.get('.property-details-main-section').within(() => {
      cy.contains('Property details')
      cy.contains('16 Pitcairn House')
      cy.contains('St Thomass Square')
      cy.contains('E9 6PT')
    })

    cy.contains('a', 'Raise a work order on this dwelling').should(
      'have.attr',
      'href',
      '/properties/00012345/raise-repair/new'
    )

    cy.contains('.hackney-property-alerts li', 'Tenure: Secure')
    cy.contains('.hackney-property-alerts li', 'Alert 1')
    cy.contains('.hackney-property-alerts li', 'Specific Requirements')
    cy.contains('.hackney-property-alerts li', 'Reason 1, very important')

    cy.get('[data-testid="boiler-house-details"]').contains(
      'Booster Pump 1-93 Pitcairn House St Thomass Square'
    )

    cy.contains('This property is currently under legal disrepair').should(
      'not.exist'
    )

    cy.get('.lbh-heading-h2').contains('Work orders history')
    cy.get('[data-ref=10000012]').within(() => {
      cy.contains('a', '10000012').should(
        'have.attr',
        'href',
        '/work-orders/10000012'
      )
      cy.contains('1 Feb 2021')
      cy.contains('Door Entry Engineer - DE')
      cy.contains('In progress')
      cy.contains('The latest repair')
    })
  })

  context('when signed in with a role that cannot view properties', () => {
    beforeEach(() => {
      cy.clearCookies()
      cy.loginWithOperativeRole()
    })

    it('denies access to the property page', () => {
      cy.visit('/properties/00012345')

      cy.url().should('contain', '/access-denied')
      cy.contains('Access denied')
      cy.contains('Dwelling: 16 Pitcairn House').should('not.exist')
    })
  })
})
