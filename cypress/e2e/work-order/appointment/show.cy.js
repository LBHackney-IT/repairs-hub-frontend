/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Managing work order appointments', () => {
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
      { method: 'GET', path: '/api/workOrders/10000012/notes' },
      { fixture: 'workOrders/notes.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { body: [] }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
      },
      { body: [] }
    )

    cy.clock(new Date('2021-01-22T18:30:00.00000'))
  })

  context('When the work order has no appointment', () => {
    it('Shows a link to schedule it', () => {
      cy.visit('/work-orders/10000012')

      cy.get('.appointment-details').within(() => {
        cy.contains('Appointment details')
        cy.contains('a', 'Schedule appointment')

        cy.contains('a', 'Open DRS to book an appointment').should('not.exist')
      })
    })
  })

  describe('When the work order has no appointment but is a DRS work order', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/users/schedulerSession' },
        { body: { schedulerSessionId: 'SCHEDULER_SESSION_ID' } }
      )
    })

    context('For a higher priority work order (Immediate or Emergency)', () => {
      it('Does not show a link to schedule an appointment', () => {
        cy.fixture('workOrders/externallyManagedAppointment.json').then(
          (workOrder) => {
            workOrder.priority = '1 [I] IMMEDIATE'
            workOrder.priorityCode = 1
            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000012' },
              { body: workOrder }
            )
          }
        )
        cy.visit('/work-orders/10000012')

        cy.get('.appointment-details').within(() => {
          cy.contains('Appointment details')
          cy.contains('a', 'Schedule an appointment').should('not.exist')

          cy.contains('a', 'Open DRS to book an appointment').should(
            'not.exist'
          )

          cy.contains('Not applicable')
        })
      })
    })

    context('For OOH gas work order', () => {
      it('Does not show a link to schedule an appointment', () => {
        cy.fixture('workOrders/externallyManagedAppointment.json').then(
          (workOrder) => {
            workOrder.priority = '[U] URGENT'
            workOrder.priorityCode = 3

            workOrder.tradeCode = 'OO'
            workOrder.contractorReference = 'H04'

            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000012' },
              { body: workOrder }
            )
          }
        )
        cy.visit('/work-orders/10000012')

        cy.get('.appointment-details').within(() => {
          cy.contains('Appointment details')
          cy.contains('a', 'Schedule an appointment').should('not.exist')

          cy.contains('a', 'Open DRS to book an appointment').should(
            'not.exist'
          )

          cy.contains('Not applicable')
        })
      })
    })

    context('For a lower priority work order (Urgent or Normal)', () => {
      it('Shows a link to schedule an appointment via DRS Web Booking Manager', () => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012' },
          { fixture: 'workOrders/externallyManagedAppointment.json' }
        )

        cy.fixture('workOrderAppointments/withDRSAppointment.json').then(
          (body) => {
            body.appointment = null

            cy.intercept(
              { method: 'GET', path: '/api/workOrders/appointments/10000012' },
              {
                body: body,
              }
            )
          }
        )

        cy.visit('/work-orders/10000012')

        cy.get('.appointment-details').within(() => {
          cy.contains('Appointment details')
          cy.contains('a', 'Schedule appointment').should('not.exist')

          cy.contains('a', 'Open DRS to book an appointment').should(
            'have.attr',
            'href',
            '/scheduler?bookingId=1&sessionId=SCHEDULER_SESSION_ID'
          )
          cy.contains('a', 'Open DRS to book an appointment').should(
            'have.attr',
            'target',
            '_blank'
          )
        })
      })
    })
  })

  context('When the work order has an existing appointment', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/withAppointment.json' }
      )

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/appointments/10000012' },
        {
          fixture: 'workOrderAppointments/withDRSAppointment.json',
        }
      )
    })

    it('Shows the scheduled appointment details', () => {
      cy.visit('/work-orders/10000012')

      cy.get('.appointment-details').within(() => {
        cy.contains('Appointment details')
        cy.contains('19 Mar 2021, 12:00-18:00')
      })
    })
  })

  context('When the work order has an immediate priority', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/priorityImmediate.json' }
      )
    })

    it('Indicates that an appointment is not applicable', () => {
      cy.visit('/work-orders/10000012')

      cy.get('.appointment-details').within(() => {
        cy.contains('Appointment details')
        cy.contains('Not applicable')
      })
    })
  })
})
