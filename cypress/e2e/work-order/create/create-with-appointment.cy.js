/// <reference types="cypress" />

import 'cypress-audit/commands'
import {
  EMERGENCY_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
} from '../../../../src/utils/helpers/priorities'

const now = new Date('Wed Mar 10 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Schedule appointment form', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('property')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/contact-details/4552c539-2e00-8533-078d-9cc59d9115da',
      },
      { fixture: 'contactDetails/contactDetails.json' }
    ).as('contactDetailsRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/contractors?propertyReference=00012345&tradeCode=PL',
      },
      { fixture: 'contractors/contractors.json' }
    ).as('contractors')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=PUR&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
    ).as('sorCodesPUR')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=H01&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
    ).as('sorCodesH01')

    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/priorities' },
      { fixture: 'scheduleOfRates/priorities.json' }
    ).as('priorities')

    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/trades?propRef=00012345' },
      { fixture: 'scheduleOfRates/trades.json' }
    ).as('trades')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10102030/new' },
      { fixture: 'workOrders/workOrder.json' }
    ).as('workOrder')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10102030' },
      {
        fixture: 'workOrderAppointments/noAppointment.json',
      }
    )

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10102030/notes' },
      { fixture: 'workOrders/notes.json' }
    ).as('notes')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10102030/tasks' },
      { fixture: 'workOrders/task.json' }
    ).as('tasks')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders/?propertyReference=00012345&PageSize=50&PageNumber=1',
      },
      { body: [] }
    ).as('workOrdersForProperty')

    cy.intercept(
      {
        method: 'GET',
        pathname: '/api/appointments',
      },
      { fixture: 'appointment/availability.json' }
    ).as('availableAppointments')

    cy.intercept(
      { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
      { body: { propertyIsInLegalDisrepair: false } }
    ).as('propertyIsNotInLegalDisrepair')

    cy.intercept(
      { method: 'POST', path: '/api/appointments' },
      { body: '' }
    ).as('apiCheckAppointment')

    cy.intercept(
      { method: 'POST', path: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('apiCheckjobStatus')

    cy.intercept(
      { method: 'GET', path: '/api/contractors/*' },
      { fixture: 'contractor/contractor.json' }
    ).as('contractorRequest')

    cy.clock(now, ['Date'])
  })

  describe('When the order is for a contractor whose appointments are managed in repairs hub', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'POST', path: '/api/workOrders/schedule' },
        {
          body: {
            id: 10102030,
            statusCode: 200,
            statusCodeDescription: '???',
            externallyManagedAppointment: false,
          },
        }
      ).as('apiCheck')
    })

    it('Shows a success page right after a work order is created with an emergency priority', () => {
      cy.visit('/properties/00012345')

      cy.wait(['@property'])

      cy.contains('a', 'Raise a work order on this dwelling').click()

      cy.wait(['@property', '@priorities', '@trades'])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait(['@contractors'])

        cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

        cy.wait('@sorCodesPUR')

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)

        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R006 - Urgent call outs - £1')

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
        cy.get('#priorityCode').select('2 [E] EMERGENCY')
        cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
        cy.get('#callerName').type('Bob Leek', { force: true })

        cy.get('#contactNumber')
          .clear({ force: true })
          .type('07788659111', { force: true })

        cy.get('[type="submit"]')
          .contains('Create work order')
          .click({ force: true })

        cy.wait('@apiCheck')
          .its('request.body')
          .then((body) => {
            const referenceIdUuid = body.reference[0].id
            cy.get('@apiCheck')
              .its('request.body')
              .should('deep.equal', {
                reference: [{ id: referenceIdUuid }],
                descriptionOfWork: 'Testing',
                priority: {
                  priorityCode: EMERGENCY_PRIORITY_CODE,
                  priorityDescription: '2 [E] EMERGENCY',
                  numberOfDays: 1,
                },
                workClass: { workClassCode: 0 },
                workElement: [
                  {
                    rateScheduleItem: [
                      {
                        customCode: 'DES5R006',
                        customName: 'Urgent call outs',
                        quantity: { amount: [2] },
                      },
                    ],
                    trade: [
                      {
                        code: 'SP',
                        customCode: 'PL',
                        customName: 'Plumbing - PL',
                      },
                    ],
                  },
                ],
                site: {
                  property: [
                    {
                      propertyReference: '00012345',
                      address: {
                        addressLine: ['16 Pitcairn House  St Thomass Square'],
                        postalCode: 'E9 6PT',
                      },
                      reference: [
                        {
                          id: '00012345',
                        },
                      ],
                    },
                  ],
                },
                instructedBy: { name: 'Hackney Housing' },
                assignedToPrimary: {
                  name: 'PURDY CONTRACTS (C2A)',
                  organization: {
                    reference: [
                      {
                        id: 'PUR',
                      },
                    ],
                  },
                },
                customer: {
                  name: 'Bob Leek',
                  person: {
                    name: {
                      full: 'Bob Leek',
                    },
                    communication: [
                      {
                        channel: {
                          medium: '20',
                          code: '60',
                        },
                        value: '07788659111',
                      },
                    ],
                  },
                },
                multiTradeWorkOrder: false,
              })
          })
      })

      cy.get('.govuk-panel .govuk-panel__title').contains('Work order created')

      cy.get('.govuk-panel .govuk-panel__body').contains('Reference number')
      cy.get('.govuk-panel .govuk-panel__body').contains('10102030')

      cy.get('.lbh-list li')
        .contains('View work order')
        .should('have.attr', 'href', '/work-orders/10102030')
      cy.get('.lbh-list li')
        .contains('Back to 16 Pitcairn House')
        .should('have.attr', 'href', '/properties/00012345')
      cy.get('.lbh-list li')
        .contains('Start a new search')
        .should('have.attr', 'href', '/')

      //  cy.audit()
    })

    // when priority is Normal it is redirecting to schedule appointment page
    it('Shows an appointment booking page right after work order is created with a normal priority', () => {
      cy.visit('/properties/00012345')

      cy.wait(['@property'])

      cy.contains('a', 'Raise a work order on this dwelling').click()

      cy.wait(['@property', '@priorities', '@trades'])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait(['@contractors'])

        cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

        cy.wait('@sorCodesPUR')

        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R005 - Normal call outs - £1')

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
        cy.get('#priorityCode').select('5 [N] NORMAL')
        cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
        cy.get('#callerName').type('Bob Leek', { force: true })
        cy.get('#contactNumber')
          .clear({ force: true })
          .type('07788659111', { force: true })

        cy.get('[type="submit"]')
          .contains('Create work order')
          .click({ force: true })

        cy.wait('@apiCheck')
          .its('request.body')
          .then((body) => {
            const referenceIdUuid = body.reference[0].id
            cy.get('@apiCheck')
              .its('request.body')
              .should('deep.equal', {
                reference: [{ id: referenceIdUuid }],
                descriptionOfWork: 'Testing',
                priority: {
                  priorityCode: NORMAL_PRIORITY_CODE,
                  priorityDescription: '5 [N] NORMAL',
                  numberOfDays: 21,
                },
                workClass: { workClassCode: 0 },
                workElement: [
                  {
                    rateScheduleItem: [
                      {
                        customCode: 'DES5R005',
                        customName: 'Normal call outs',
                        quantity: { amount: [2] },
                      },
                    ],
                    trade: [
                      {
                        code: 'SP',
                        customCode: 'PL',
                        customName: 'Plumbing - PL',
                      },
                    ],
                  },
                ],
                site: {
                  property: [
                    {
                      propertyReference: '00012345',
                      address: {
                        addressLine: ['16 Pitcairn House  St Thomass Square'],
                        postalCode: 'E9 6PT',
                      },
                      reference: [
                        {
                          id: '00012345',
                        },
                      ],
                    },
                  ],
                },
                instructedBy: { name: 'Hackney Housing' },
                assignedToPrimary: {
                  name: 'PURDY CONTRACTS (C2A)',
                  organization: {
                    reference: [
                      {
                        id: 'PUR',
                      },
                    ],
                  },
                },
                customer: {
                  name: 'Bob Leek',
                  person: {
                    name: {
                      full: 'Bob Leek',
                    },
                    communication: [
                      {
                        channel: {
                          medium: '20',
                          code: '60',
                        },
                        value: '07788659111',
                      },
                    ],
                  },
                },
                multiTradeWorkOrder: false,
              })
          })
      })

      cy.wait('@availableAppointments')

      //Appointment page with calendar
      cy.get('.appointment-calendar').within(() => {
        cy.get('.available').contains('11').click({ force: true })
      })
      cy.get('form').within(() => {
        cy.contains('Thursday 11 March')
        cy.get('[type="radio"]').first().should('have.value', 'AM 8:00 -12:00')
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
            id: 10102030,
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
            id: '10102030',
          },
          comments: '10 am works for me',
          // Other
          typeCode: '0',
          otherType: 'addNote',
        })

      //success form
      cy.contains('Work order created')
      cy.contains('Reference number')

      cy.contains('10102030')

      cy.contains('Thursday 11 March')
      cy.contains('AM')
      cy.contains('Comments: 10 am works for me')
      cy.contains('a', 'View work order')
      cy.contains('a', 'Back to 16 Pitcairn House')
      cy.contains('a', 'Start a new search')

      // Run lighthouse audit for accessibility report
      //  cy.audit()
    })
  })

  describe('When the order is for a contractor whose appointments are managed externally', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'POST', path: '/api/workOrders/schedule' },
        {
          body: {
            id: 10102030,
            statusCode: 200,
            statusCodeDescription: '???',
            externallyManagedAppointment: true,
            // Use a local URL for test only
            externalAppointmentManagementUrl: '/scheduler?bookingId=1',
          },
        }
      ).as('apiCheck')

      cy.intercept(
        { method: 'GET', path: '/api/users/schedulerSession' },
        { body: { schedulerSessionId: 'SCHEDULER_SESSION_ID' } }
      )

      cy.fixture('contractor/contractor.json').then((contractor) => {
        contractor.useExternalScheduleManager = true
        contractor.name = 'HH General Building Repair'
        contractor.contractorReference = 'H01'

        cy.intercept(
          {
            method: 'GET',
            path: `/api/contractors/*`,
          },
          { body: contractor }
        ).as('contractorRequest')
      })
    })

    describe('and the priority is Normal (N)', () => {
      it('Shows a success page instead of the calendar with a link to the external scheduler', () => {
        cy.visit('/properties/00012345')

        cy.wait(['@property'])

        cy.contains('a', 'Raise a work order on this dwelling').click()

        cy.wait(['@property', '@priorities', '@trades'])

        // cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait(['@contractors'])

        cy.get('#contractor').type('HH General Building Repair - H01')

        cy.wait('@sorCodesH01')

        // fails here
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)

        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R005 - Normal call outs - £1')

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
        cy.get('#priorityCode').select('5 [N] NORMAL')
        cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
        cy.get('#callerName').type('Test Caller', { force: true })
        cy.get('#contactNumber')
          .clear({ force: true })
          .type('12345678910', { force: true })

        cy.get('[type="submit"]')
          .contains('Create work order')
          .click({ force: true })
        // })

        cy.wait('@apiCheck')

        cy.contains('Work order created')

        cy.contains('Book an appointment on DRS')
        cy.contains('a', 'Book an appointment on DRS').should(
          'have.attr',
          'href',
          '/scheduler?bookingId=1&sessionId=SCHEDULER_SESSION_ID'
        )
        cy.contains('a', 'Book an appointment on DRS').should(
          'have.attr',
          'target',
          '_blank'
        )

        // Avoid opening a new tab by re-writing link behaviour
        cy.contains('a', 'Book an appointment on DRS')
          .invoke('removeAttr', 'target')
          .click()

        cy.wait('@apiCheckjobStatus')
          .its('request.body')
          .then((body) => {
            cy.wrap(body).should('deep.equal', {
              relatedWorkOrderReference: {
                id: '10102030',
              },
              comments: 'Hackney User opened the DRS Web Booking Manager',
              typeCode: '0',
              otherType: 'addNote',
            })
          })
      })
    })

    describe('and the priority is Urgent (U)', () => {
      it('Shows a success page instead of the calendar with a link to the external scheduler', () => {
        cy.visit('/properties/00012345')

        cy.wait(['@property'])

        cy.contains('a', 'Raise a work order on this dwelling').click()

        cy.wait(['@property', '@priorities', '@trades'])

        // cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait(['@contractors'])

        cy.get('#contractor').type('HH General Building Repair - H01')

        cy.wait('@sorCodesH01')

        // fails here
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R006 - Urgent call outs - £1')

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
        cy.get('#priorityCode').select('4 [U] URGENT')
        cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
        cy.get('#callerName').type('Test Caller', { force: true })
        cy.get('#contactNumber')
          .clear({ force: true })
          .type('12345678910', { force: true })

        cy.get('[type="submit"]')
          .contains('Create work order')
          .click({ force: true })
        // })

        cy.wait('@apiCheck')

        cy.contains('Work order created')

        cy.contains('Book an appointment on DRS')
        cy.contains('a', 'Book an appointment on DRS').should(
          'have.attr',
          'href',
          '/scheduler?bookingId=1&sessionId=SCHEDULER_SESSION_ID'
        )
        cy.contains('a', 'Book an appointment on DRS').should(
          'have.attr',
          'target',
          '_blank'
        )
      })
    })

    describe('and the priority is Immediate (I)', () => {
      it('Shows a success page instead of the calendar with no link to the external scheduler but text informing that the repair has been sent directly to the planners', () => {
        cy.visit('/properties/00012345')

        cy.wait(['@property'])

        cy.contains('a', 'Raise a work order on this dwelling').click()

        cy.wait(['@property', '@priorities', '@trades'])

        // cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait(['@contractors'])

        cy.get('#contractor').type('HH General Building Repair - H01')

        cy.wait('@sorCodesH01')

        // fails here
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R003 - Immediate call outs - £0')

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
        cy.get('#priorityCode').select('1 [I] IMMEDIATE')
        cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
        cy.get('#callerName').type('Test Caller', { force: true })
        cy.get('#contactNumber')
          .clear({ force: true })
          .type('12345678910', { force: true })

        cy.get('[type="submit"]')
          .contains('Create work order')
          .click({ force: true })
        // })

        cy.wait('@apiCheck')

        cy.contains('Work order created')

        cy.contains('Book an appointment on DRS').should('not.exist')
        cy.contains('a', 'Book an appointment on DRS').should('not.exist')
        cy.get('.govuk-warning-text').within(() => {
          cy.contains(
            'Emergency and immediate DLO repairs are sent directly to the planners. An appointment does not need to be booked'
          )
        })
      })
    })

    describe('and the priority is Emergency (E)', () => {
      it('Shows a success page instead of the calendar with no link to the external scheduler but text informing that the repair has been sent directly to the planners', () => {
        cy.visit('/properties/00012345')

        cy.contains('a', 'Raise a work order on this dwelling').click()

        // cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')
        cy.get('#contractor').type('HH General Building Repair - H01')

        cy.wait('@sorCodesH01')

        // fails here
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R004 - Emergency call out - £1')

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
        cy.get('#priorityCode').select('2 [E] EMERGENCY')
        cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
        cy.get('#callerName').type('Test Caller', { force: true })
        cy.get('#contactNumber')
          .clear({ force: true })
          .type('12345678910', { force: true })
        cy.get('[type="submit"]')
          .contains('Create work order')
          .click({ force: true })
        // })

        cy.contains('Work order created')

        cy.contains('Book an appointment on DRS').should('not.exist')
        cy.contains('a', 'Book an appointment on DRS').should('not.exist')
        cy.get('.govuk-warning-text').within(() => {
          cy.contains(
            'Emergency and immediate DLO repairs are sent directly to the planners. An appointment does not need to be booked'
          )
        })
      })
    })
  })

  describe('When the order is for a priority which is managed externally', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'POST', path: '/api/workOrders/schedule' },
        {
          body: {
            id: 10102030,
            statusCode: 200,
            statusCodeDescription: '???',
            externallyManagedAppointment: true,
            // Use a local URL for test only
            externalAppointmentManagementUrl: '/scheduler?bookingId=1',
          },
        }
      ).as('apiCheck')

      cy.intercept(
        { method: 'GET', path: '/api/users/schedulerSession' },
        { body: { schedulerSessionId: 'SCHEDULER_SESSION_ID' } }
      )
    })
    describe('and the priority is VOIDS', () => {
      it('Shows a success page instead of the calendar with a link to the external scheduler', () => {
        cy.visit('/properties/00012345')

        cy.wait(['@property'])

        cy.contains('a', 'Raise a work order on this dwelling').click()

        cy.wait(['@property', '@priorities', '@trades'])

        cy.get('#repair-request-form').within(() => {
          cy.get('#trade').type('Plumbing - PL')

          cy.wait(['@contractors'])

          cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

          cy.wait('@sorCodesPUR')

          cy.get('input[id="rateScheduleItems[0][code]"]')
            .clear()
            .type('DES5R005 - Normal call outs - £1')

          cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
          cy.get('#priorityCode').select('[V15] Voids minor')
          cy.get('.lbh-warning-text').within(() => {
            cy.contains('VOIDS priority')
            cy.contains('VOIDS work orders do not go to the DRS booking system')
          })
          cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
          cy.get('#callerName').type('Test Caller', { force: true })
          cy.get('#contactNumber')
            .clear({ force: true })
            .type('12345678910', { force: true })

          cy.get('[type="submit"]')
            .contains('Create work order')
            .click({ force: true })
        })

        cy.wait('@apiCheck')

        cy.contains('Work order created')

        cy.contains('Book an appointment on DRS')
        cy.contains('a', 'Book an appointment on DRS').should(
          'have.attr',
          'href',
          '/scheduler?bookingId=1&sessionId=SCHEDULER_SESSION_ID'
        )
        cy.contains('a', 'Book an appointment on DRS').should(
          'have.attr',
          'target',
          '_blank'
        )

        // Avoid opening a new tab by re-writing link behaviour
        cy.contains('a', 'Book an appointment on DRS')
          .invoke('removeAttr', 'target')
          .click()

        cy.wait('@apiCheckjobStatus')
          .its('request.body')
          .then((body) => {
            cy.wrap(body).should('deep.equal', {
              relatedWorkOrderReference: {
                id: '10102030',
              },
              comments: 'Hackney User opened the DRS Web Booking Manager',
              typeCode: '0',
              otherType: 'addNote',
            })
          })
      })
    })
  })
})
