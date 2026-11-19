/// <reference types="cypress" />

/// <reference types="cypress" />

describe('Related work orders', () => {
  describe('When user is not a contractor', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/workOrder.json' }
      )

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/appointments/10000012' },
        {
          fixture: 'workOrderAppointments/noAppointment.json',
        }
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

      cy.contains('.tabs-button', 'Related work orders').click()

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

      cy.contains('.tabs-button', 'Related work orders').click()

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

  describe('When user is a contractor', () => {
    beforeEach(() => {
      cy.loginWithContractorRole()

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/workOrder.json' }
      ).as('workOrderRequest')

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/appointments/10000012' },
        {
          fixture: 'workOrderAppointments/noAppointment.json',
        }
      )

      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      ).as('propertyRequest')

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/tasks' },
        { fixture: 'workOrders/tasksAndSors.json' }
      ).as('tasksRequest')
    })

    it('Doesnt show the the realted work orders tab', () => {
      cy.visit('/work-orders/10000012')

      cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

      cy.get('body').should('not.contain', 'Related work orders')
    })
  })
})
