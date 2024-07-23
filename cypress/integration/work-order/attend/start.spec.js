/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Starting my own work order', () => {
  const now = new Date('Friday June 11 2021 13:49:15Z')
  const workOrderReference = '10000621'
  const propertyReference = '00012345'

  beforeEach(() => {
    cy.intercept(`/api/workOrders/${workOrderReference}`, {
      fixture: 'workOrders/workOrderWithoutStartTime.json',
    }).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('photos')

    cy.intercept(
      { method: 'GET', path: `/api/properties/${propertyReference}` },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      {
        method: 'GET',
        path: `/api/properties/${propertyReference}/location-alerts`,
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
        path:
          '/api/properties/4552c539-2e00-8533-078d-9cc59d9115da/person-alerts',
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

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/${workOrderReference}/tasks` },
      { fixture: 'workOrders/tasksAndSorsUnvaried.json' }
    ).as('tasksRequest')

    cy.intercept(
      { method: 'POST', path: '/api/workOrderComplete' },
      { body: '' }
    ).as('workOrderCompleteRequest')

    cy.intercept(
      { method: 'GET', path: '/api/operatives/hu0001/workorders' },
      { body: [] }
    )

    cy.loginWithOperativeRole()

    cy.clock(new Date(now).setHours(12, 0, 0))
  })

  it('starts a workOrder and updates started at', () => {
    cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

    cy.wait([
      '@workOrderRequest',
      '@propertyRequest',
      '@tasksRequest',
      '@locationAlerts',
      '@personAlerts',
    ])

    cy.intercept(
      { method: 'put', path: '/api/workOrders/starttime' },
      { body: '' }
    ).as('startTimeRequest')

    cy.contains('button', 'Start my job').click()

    cy.wait('@startTimeRequest')

    cy.get('[data-test="startedAtValue"]').contains('11 Jun 2021, 12:00')
  })
})
