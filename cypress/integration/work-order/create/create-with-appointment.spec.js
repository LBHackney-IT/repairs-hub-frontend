/// <reference types="cypress" />

import 'cypress-audit/commands'
import {
  EMERGENCY_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
} from '../../../../src/utils/helpers/priorities'
// Mock date
const now = new Date('Wed Mar 10 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Schedule appointment form', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    // Stub request for raise a work order, schedule appointment and view work order
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )
    cy.intercept(
      {
        method: 'GET',
        path: '/api/contractors?propertyReference=00012345&tradeCode=PL',
      },
      { fixture: 'contractors/contractors.json' }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=PCL&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=H01&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/priorities' },
      { fixture: 'scheduleOfRates/priorities.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/trades?propRef=00012345' },
      { fixture: 'scheduleOfRates/trades.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10102030' },
      { fixture: 'workOrders/workOrder.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10102030/notes' },
      { fixture: 'workOrders/notes.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10102030/tasks' },
      { fixture: 'workOrders/task.json' }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders/?propertyReference=00012345&PageSize=50&PageNumber=1',
      },
      { body: [] }
    )
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

      cy.get('.lbh-heading-h2')
        .contains('Raise a work order on this dwelling')
        .click()

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')
        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

        cy.get('input[id="rateScheduleItems[0][code]"]').type(
          'DES5R006 - Urgent call outs'
        )

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
        // Check body of post request, creates work order
        cy.get('@apiCheck')
          .its('request.body')
          .then((body) => {
            const referenceIdUuid = body.reference[0].id
            const requiredCompletionDateTime =
              body.priority.requiredCompletionDateTime
            cy.get('@apiCheck')
              .its('request.body')
              .should('deep.equal', {
                reference: [{ id: referenceIdUuid }],
                descriptionOfWork: 'Testing',
                priority: {
                  priorityCode: EMERGENCY_PRIORITY_CODE,
                  priorityDescription: '2 [E] EMERGENCY',
                  requiredCompletionDateTime: requiredCompletionDateTime,
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
                  name: 'Purdy Contracts (P) Ltd',
                  organization: {
                    reference: [
                      {
                        id: 'PCL',
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
              })
          })
      })

      // Confirmation screen
      cy.get('.lbh-page-announcement').within(() => {
        cy.get('.lbh-page-announcement__title').contains(
          'Repair work order created'
        )
        cy.get('.lbh-page-announcement__content').within(() => {
          cy.contains('Work order number')
          cy.contains('10102030')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li').within(() => {
        cy.contains('View work order').should(
          'have.attr',
          'href',
          '/work-orders/10102030'
        )
        cy.contains('Back to 16 Pitcairn House St Thomass Square').should(
          'have.attr',
          'href',
          '/properties/00012345'
        )
        cy.contains('Start a new search').should('have.attr', 'href', '/')
      })

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    // when priority is Normal it is redirecting to schedule appointment page
    it('Shows an appointment booking page right after work order is created with a normal priority', () => {
      cy.visit('/properties/00012345')

      cy.get('.lbh-heading-h2')
        .contains('Raise a work order on this dwelling')
        .click()

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')
        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

        cy.get('input[id="rateScheduleItems[0][code]"]').type(
          'DES5R005 - Normal call outs'
        )

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
        // Check body of post request, creates work order
        cy.get('@apiCheck')
          .its('request.body')
          .then((body) => {
            const referenceIdUuid = body.reference[0].id
            const requiredCompletionDateTime =
              body.priority.requiredCompletionDateTime
            cy.get('@apiCheck')
              .its('request.body')
              .should('deep.equal', {
                reference: [{ id: referenceIdUuid }],
                descriptionOfWork: 'Testing',
                priority: {
                  priorityCode: NORMAL_PRIORITY_CODE,
                  priorityDescription: '5 [N] NORMAL',
                  requiredCompletionDateTime: requiredCompletionDateTime,
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
                  name: 'Purdy Contracts (P) Ltd',
                  organization: {
                    reference: [
                      {
                        id: 'PCL',
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
              })
          })
      })

      cy.wait('@availableAppointments')

      //Appointment page with calendar
      cy.get('.appointment-calendar').within(() => {
        cy.get('.available').contains('11').click({ force: true })
      })
      cy.get('form').within(() => {
        cy.contains('Thursday, 11 March')
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
        cy.contains('Thursday, 11 March')
        cy.contains('AM')
        cy.contains('Comments: 10 am works for me')
      })
      cy.get('[type="button"]')
        .contains('Book appointment')
        .click({ force: true })
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
      //jobStatusUpdate api check - adding comments
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
      cy.contains('Repair work order created')
      cy.contains('Work order number')

      cy.contains('10102030')

      cy.contains('Thursday, 11 March')
      cy.contains('AM')
      cy.contains('Comments: 10 am works for me')
      cy.contains('a', 'View work order')
      cy.contains('a', 'Back to 16 Pitcairn House')
      cy.contains('a', 'Start a new search')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  describe('When the order is for a contrator whose appointments are managed externally', () => {
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

    describe('and the priority is Normal (N)', () => {
      it('Shows a success page instead of the calendar with a link to the external scheduler', () => {
        cy.visit('/properties/00012345')

        cy.get('.lbh-heading-h2')
          .contains('Raise a work order on this dwelling')
          .click()

        cy.get('#repair-request-form').within(() => {
          cy.get('#trade').type('Plumbing - PL')
          cy.get('#contractor').type('HH General Building Repair - H01')

          cy.get('input[id="rateScheduleItems[0][code]"]').type(
            'DES5R005 - Normal call outs'
          )

          cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
          cy.get('#priorityCode').select('5 [N] NORMAL')
          cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
          cy.get('#callerName').type('NA', { force: true })
          cy.get('#contactNumber')
            .clear({ force: true })
            .type('NA', { force: true })
          cy.get('[type="submit"]')
            .contains('Create work order')
            .click({ force: true })
        })

        cy.contains('Repair work order created')

        cy.contains('Please open DRS to book an appointment')
        cy.contains('a', 'open DRS').should(
          'have.attr',
          'href',
          '/scheduler?bookingId=1&sessionId=SCHEDULER_SESSION_ID'
        )
        cy.contains('a', 'open DRS').should('have.attr', 'target', '_blank')

        // Avoid opening a new tab by re-writing link behaviour
        cy.contains('a', 'open DRS').invoke('removeAttr', 'target').click()

        cy.wait('@apiCheckjobStatus')

        cy.get('@apiCheckjobStatus')
          .its('request.body')
          .then((body) => {
            cy.wrap(body).should('deep.equal', {
              relatedWorkOrderReference: {
                id: '10102030',
              },
              comments: 'A Name opened the DRS Web Booking Manager',
              typeCode: '0',
              otherType: 'addNote',
            })
          })

        cy.getCookie(Cypress.env('NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME')).should(
          'have.property',
          'value',
          'SCHEDULER_SESSION_ID'
        )
      })
    })

    describe('and the priority is Urgent (U)', () => {
      it('Shows a success page instead of the calendar with a link to the external scheduler', () => {
        cy.visit('/properties/00012345')

        cy.get('.lbh-heading-h2')
          .contains('Raise a work order on this dwelling')
          .click()

        cy.get('#repair-request-form').within(() => {
          cy.get('#trade').type('Plumbing - PL')
          cy.get('#contractor').type('HH General Building Repair - H01')

          cy.get('input[id="rateScheduleItems[0][code]"]').type(
            'DES5R006 - Urgent call outs'
          )

          cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
          cy.get('#priorityCode').select('4 [U] URGENT')
          cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
          cy.get('#callerName').type('NA', { force: true })
          cy.get('#contactNumber')
            .clear({ force: true })
            .type('NA', { force: true })
          cy.get('[type="submit"]')
            .contains('Create work order')
            .click({ force: true })
        })

        cy.contains('Repair work order created')

        cy.contains('Please open DRS to book an appointment')
        cy.contains('a', 'open DRS').should(
          'have.attr',
          'href',
          '/scheduler?bookingId=1&sessionId=SCHEDULER_SESSION_ID'
        )
        cy.contains('a', 'open DRS').should('have.attr', 'target', '_blank')

        cy.getCookie(Cypress.env('NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME')).should(
          'have.property',
          'value',
          'SCHEDULER_SESSION_ID'
        )
      })
    })

    describe('and the priority is Immediate (I)', () => {
      it('Shows a success page instead of the calendar with no link to the external scheduler but text informing that the repair has been sent directly to the planners', () => {
        cy.visit('/properties/00012345')

        cy.get('.lbh-heading-h2')
          .contains('Raise a work order on this dwelling')
          .click()

        cy.get('#repair-request-form').within(() => {
          cy.get('#trade').type('Plumbing - PL')
          cy.get('#contractor').type('HH General Building Repair - H01')

          cy.get('input[id="rateScheduleItems[0][code]"]').type(
            'DES5R003 - Immediate call outs'
          )

          cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
          cy.get('#priorityCode').select('1 [I] IMMEDIATE')
          cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
          cy.get('#callerName').type('NA', { force: true })
          cy.get('#contactNumber')
            .clear({ force: true })
            .type('NA', { force: true })
          cy.get('[type="submit"]')
            .contains('Create work order')
            .click({ force: true })
        })

        cy.contains('Repair work order created')

        cy.contains('Please open DRS to book an appointment').should(
          'not.exist'
        )
        cy.contains('a', 'open DRS').should('not.exist')
        cy.contains(
          'Emergency and immediate DLO repairs are sent directly to the Planners. An appointment does not need to be booked.'
        )
      })
    })

    describe('and the priority is Emergency (E)', () => {
      it('Shows a success page instead of the calendar with no link to the external scheduler but text informing that the repair has been sent directly to the planners', () => {
        cy.visit('/properties/00012345')

        cy.get('.lbh-heading-h2')
          .contains('Raise a work order on this dwelling')
          .click()

        cy.get('#repair-request-form').within(() => {
          cy.get('#trade').type('Plumbing - PL')
          cy.get('#contractor').type('HH General Building Repair - H01')

          cy.get('input[id="rateScheduleItems[0][code]"]').type(
            'DES5R004 - Emergency call out'
          )

          cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
          cy.get('#priorityCode').select('2 [E] EMERGENCY')
          cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
          cy.get('#callerName').type('NA', { force: true })
          cy.get('#contactNumber')
            .clear({ force: true })
            .type('NA', { force: true })
          cy.get('[type="submit"]')
            .contains('Create work order')
            .click({ force: true })
        })

        cy.contains('Repair work order created')

        cy.contains('Please open DRS to book an appointment').should(
          'not.exist'
        )
        cy.contains('a', 'open DRS').should('not.exist')
        cy.contains(
          'Emergency and immediate DLO repairs are sent directly to the Planners. An appointment does not need to be booked.'
        )
      })
    })

    describe('and the user already has a session cookie for the scheduler', () => {
      beforeEach(() => {
        cy.setCookie(
          Cypress.env('NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME'),
          'EXISTING_SCHEDULER_SESSION_ID'
        )
      })

      it('builds the link using the existing session', () => {
        cy.visit('/properties/00012345')

        cy.get('.lbh-heading-h2')
          .contains('Raise a work order on this dwelling')
          .click()

        cy.get('#repair-request-form').within(() => {
          cy.get('#trade').type('Plumbing - PL')
          cy.get('#contractor').type('HH General Building Repair - H01')

          cy.get('input[id="rateScheduleItems[0][code]"]').type(
            'DES5R005 - Normal call outs'
          )

          cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
          cy.get('#priorityCode').select('5 [N] NORMAL')
          cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
          cy.get('#callerName').type('NA', { force: true })
          cy.get('#contactNumber')
            .clear({ force: true })
            .type('NA', { force: true })
          cy.get('[type="submit"]')
            .contains('Create work order')
            .click({ force: true })
        })

        cy.contains('a', 'open DRS').should(
          'have.attr',
          'href',
          '/scheduler?bookingId=1&sessionId=EXISTING_SCHEDULER_SESSION_ID'
        )
        cy.contains('a', 'open DRS').should('have.attr', 'target', '_blank')
      })
    })
  })
})
