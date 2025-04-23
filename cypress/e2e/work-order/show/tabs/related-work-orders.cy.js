/// <reference types="cypress" />

import 'cypress-audit/commands'
/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Related work orders', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012' },
      { fixture: 'workOrders/workOrder.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { fixture: 'workOrders/tasksAndSors.json' }
    )
  })

  it('Displays error when related work order tab fails to load', () => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders/10000012/hierarchy',
      },
      {
        statusCode: 400,
      }
    ).as('getHierarchyRequest')

    cy.visit('/work-orders/10000012')

    cy.get('#tab_related-work-orders-tab').click()

    cy.wait('@getHierarchyRequest')

    cy.contains(
      'Oops an error occurred with error status: 400 with message: undefined'
    )
  })

  it('Displays work order hierarchy', () => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders/10000012/hierarchy',
      },
      {
        fixture: 'workOrderHierarchy/hierarchy.json',
      }
    ).as('getHierarchyRequest')

    cy.visit('/work-orders/10000012')

    cy.get('#tab_related-work-orders-tab').click()

    cy.wait('@getHierarchyRequest')

    cy.contains('7 February 2025')
    cy.contains(
      'PLM - tenant reporting water tank in the kitchen has never been changed and other properties have - Please inspect and report'
    )

    cy.contains('30 March 2022')
    cy.contains('rd')

    cy.contains('10 February 2022')
    cy.contains('planned priority test 10/02')

    cy.contains('28 January 2022')
    cy.contains('sdfsdfsdf')
  })
})
