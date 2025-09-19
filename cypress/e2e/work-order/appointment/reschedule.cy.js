/// <reference types="cypress" />

import 'cypress-audit/commands'

import {
  STATUS_IN_PROGRESS,
  STATUS_NO_ACCESS,
} from '../../../../src/utils/statusCodes'

const now = new Date('Wed Mar 10 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Rescheduling work order appointments', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('property')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/notes' },
      { fixture: 'workOrders/notes.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { fixture: 'workOrders/task.json' }
    ).as('tasks')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders?propertyReference=00012345*',
      },
      { body: [] }
    )
  })

  describe('within Repairs Hub', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          pathname: '/api/appointments',
        },
        { fixture: 'appointment/availability.json' }
      ).as('availableAppointments')

      cy.intercept(
        { method: 'POST', path: '/api/appointments' },
        { body: '' }
      ).as('apiCheckAppointment')

      cy.intercept(
        { method: 'POST', path: '/api/jobStatusUpdate' },
        { body: '' }
      ).as('apiCheckjobStatus')

      cy.clock(now)
    })

    context('When the work order is not in a closed state', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012' },
          {
            fixture: 'workOrders/withAppointment.json',
          }
        ).as('workOrder')

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/appointments/10000012' },
          {
            fixture: 'workOrderAppointments/withAppointment.json',
          }
        )
      })

      it('Permits rescheduling and displays the new appointment on the work order', () => {
        cy.visit('/work-orders/10000012')

        cy.wait(['@tasks', '@workOrder', '@property'])

        cy.get('.appointment-details').contains('19 Mar 2021, 12:00-18:00')

        cy.fixture('workOrders/withAppointment.json')
          .then((workOrder) => {
            workOrder.status = STATUS_IN_PROGRESS.description

            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000012' },
              { body: workOrder }
            )
          })
          .as('workOrder')

        cy.get('.appointment-details')
          .contains('Reschedule appointment')
          .click()

        cy.wait(['@availableAppointments', '@tasks', '@workOrder', '@property'])

        //Appointment page with calendar
        cy.url().should('contains', 'work-orders/10000012/appointment/edit')

        cy.contains('Work order task details')

        cy.get('.appointment-calendar').contains('11').click({ force: true })

        cy.get('form').within(() => {
          cy.contains('Thursday 11 March')
          cy.get('[type="radio"]')
            .first()
            .should('have.value', 'AM 8:00 -12:00')
          cy.get('[type="radio"]').last().should('have.value', 'PM 12:00-4:00')

          // choose AM slot and leave comment
          cy.get('[type="radio"]').first().check()
          cy.get('#comments').type('10 am works for me', { force: true })
          cy.get('[type="submit"]').contains('Add').click({ force: true })
        })

        // Summary page
        cy.contains('Confirm date and time')
        cy.get('form').within(() => {
          cy.contains('Appointment Details:')
          cy.contains('Thursday 11 March')
          cy.contains('AM')
          cy.contains('Comments: 10 am works for me')
        })
        cy.get('[type="button"]')
          .contains('Book appointment')
          .click({ force: true })

        cy.wait('@apiCheckAppointment')
        cy.get('@apiCheckAppointment')
          .its('request.body')
          .should('deep.equal', {
            workOrderReference: {
              id: 10000012,
              description: '',
              allocatedBy: '',
            },
            appointmentReference: {
              id: '31/2021-03-11',
              description: '',
              allocatedBy: '',
            },
          })

        cy.wait('@apiCheckjobStatus')
        cy.get('@apiCheckjobStatus')
          .its('request.body')
          .should('deep.equal', {
            relatedWorkOrderReference: {
              id: '10000012',
            },
            comments: '10 am works for me',
            typeCode: '0',
            otherType: 'addNote',
          })

        cy.get('.govuk-panel').within(() => {
          cy.contains('Appointment rescheduled')
          cy.contains('Reference number')
          cy.contains('10000012')
          cy.contains('Thursday 11 March')
          cy.contains('Comments: 10 am works for me')
        })
      })
    })

    context('When the work order is in a closed state', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/appointments/10000012' },
          {
            fixture: 'workOrderAppointments/withAppointment.json',
          }
        )
      })

      it('Does not show a reschedule link', () => {
        cy.fixture('workOrders/withAppointment.json')
          .then((workOrder) => {
            workOrder.status = STATUS_NO_ACCESS.description

            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000012' },
              { body: workOrder }
            )
          })
          .as('workOrder')

        cy.visit('/work-orders/10000012')

        cy.wait(['@tasks', '@workOrder', '@property'])

        cy.get('.appointment-details')
          .contains('Reschedule appointment')
          .should('not.exist')
      })

      it('Shows an error message if navigating to appointment edit directly', () => {
        cy.fixture('workOrders/withAppointment.json')
          .then((workOrder) => {
            workOrder.status = STATUS_NO_ACCESS.description

            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000012' },
              { body: workOrder }
            )
          })
          .as('workOrder')

        cy.visit('/work-orders/10000012/appointment/edit')

        cy.wait('@workOrder')

        cy.get('.appointment-calendar').should('not.exist')

        cy.contains(
          'Appointment scheduling for closed or authorisation pending work orders is not permitted'
        )
      })
    })
  })

  describe('in DRS', () => {
    context('When the work order is not in a closed state', () => {
      beforeEach(() => {
        cy.fixture('workOrders/withAppointment.json')
          .then((workOrder) => {
            workOrder.externalAppointmentManagementUrl =
              '/scheduler?bookingId=1'
            workOrder.status = STATUS_IN_PROGRESS.description

            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000012' },
              { body: workOrder }
            )
          })
          .as('workOrder')

        cy.intercept(
          { method: 'GET', path: '/api/users/schedulerSession' },
          { body: { schedulerSessionId: 'SCHEDULER_SESSION_ID' } }
        )

        cy.intercept(
          { method: 'POST', path: '/api/jobStatusUpdate' },
          { body: '' }
        ).as('apiCheckjobStatus')

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/appointments/10000012' },
          {
            fixture: 'workOrderAppointments/withDRSAppointment.json',
          }
        )
      })

      it('Permits rescheduling and calls the API to make a note of when DRS was opened', () => {
        cy.visit('/work-orders/10000012')

        cy.wait(['@tasks', '@workOrder', '@property'])

        cy.contains('a', 'Open DRS to reschedule appointment')
          .should(
            'have.attr',
            'href',
            '/scheduler?bookingId=1&sessionId=SCHEDULER_SESSION_ID'
          )
          .should('have.attr', 'target', '_blank')

        // Avoid opening a new tab by re-writing link behaviour
        cy.contains('a', 'Open DRS to reschedule appointment')
          .invoke('removeAttr', 'target')
          .click()

        cy.wait('@apiCheckjobStatus')

        cy.get('@apiCheckjobStatus')
          .its('request.body')
          .then((body) => {
            cy.wrap(body).should('deep.equal', {
              relatedWorkOrderReference: {
                id: '10000012',
              },
              comments: 'A Name opened the DRS Web Booking Manager',
              typeCode: '0',
              otherType: 'addNote',
            })
          })
      })

      context('When the work order is in a closed state', () => {
        beforeEach(() => {
          cy.fixture('workOrders/withAppointment.json')
            .then((workOrder) => {
              workOrder.externalAppointmentManagementUrl =
                '/scheduler?bookingId=1'
              workOrder.status = STATUS_NO_ACCESS.description

              cy.intercept(
                { method: 'GET', path: '/api/workOrders/10000012' },
                { body: workOrder }
              )
            })
            .as('workOrder')

          cy.intercept(
            { method: 'GET', path: '/api/workOrders/appointments/10000012' },
            {
              fixture: 'workOrderAppointments/withDRSAppointment.json',
            }
          )
        })

        it('Does not show a reschedule link', () => {
          cy.visit('/work-orders/10000012')

          cy.wait(['@tasks', '@workOrder', '@property'])

          cy.get('.appointment-details')
            .contains('Open DRS to reschedule appointment')
            .should('not.exist')
        })
      })
    })
  })
})
