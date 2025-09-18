/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Starting my own work order', () => {
  const now = new Date('Friday June 11 2021 13:49:15Z')
  const workOrderReference = '10000621'
  const propertyReference = '00012345'

  beforeEach(() => {
    cy.intercept(`/api/workOrders/${workOrderReference}/new`, {
      fixture: 'workOrders/workOrderWithoutStartTime.json',
    }).as('workOrderRequest')

    cy.intercept(
      {
        method: 'GET',
        path: `/api/workOrders/appointments/${workOrderReference}`,
      },
      {
        fixture: 'workOrderAppointments/noAppointment.json',
      }
    )

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/images/${workOrderReference}` },
      { body: [] }
    ).as('photosRequest')

    cy.intercept(
      { method: 'GET', path: `/api/properties/${propertyReference}` },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      {
        method: 'GET',
        path: `/api/properties/${propertyReference}/alerts`,
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
      '@alerts',
      '@photosRequest',
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
