/// <reference types="cypress" />

import 'cypress-audit/commands'
// Mock date
const now = new Date()
const DAY = 86400000

// Set next week day
export const beginningOfDay = (date) => {
  return new Date(Math.floor(date.getTime() / DAY) * DAY)
}

export const beginningOfWeek = (date) => {
  const offset = ((date.getDay() + 6) % 7) * DAY
  return beginningOfDay(new Date(date.getTime() - offset))
}

describe('Schedule appointment form', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.server()
    // Stub request for raise a repair form page
    cy.fixture('schedule-of-rates/codes.json').as('sorCodes')
    cy.fixture('schedule-of-rates/priorities.json').as('priorities')
    cy.fixture('schedule-of-rates/trades.json').as('trades')
    cy.fixture('contractors/contractors.json').as('contractors')
    cy.fixture('properties/property.json').as('property')
    cy.fixture('appointment/availability.json')
      .as('availableAppointments')
      .then((appointments) => {
        return appointments.map((appointment, index) => {
          let appointmentTime = beginningOfWeek(now)
          appointmentTime.setDate(appointmentTime.getDate() + index)
          appointment.date = appointmentTime
          return appointment
        })
      })
    cy.fixture('repairs/work-order.json').as('workOrder')
    cy.fixture('repairs/task.json').as('task')
    cy.route(
      'GET',
      'api/appointments?workOrderReference=10102030&fromDate=2021-03-08&toDate=2021-04-11',
      '@availableAppointments'
    )
    cy.route('GET', 'api/repairs/10102030', '@workOrder')
    cy.route('GET', 'api/repairs/10102030/tasks', '@task')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route(
      'GET',
      'api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=H01',
      '@sorCodes'
    )
    cy.route('GET', 'api/schedule-of-rates/priorities', '@priorities')
    cy.route('GET', 'api/schedule-of-rates/trades?propRef=00012345', '@trades')
    cy.route(
      'GET',
      'api/contractors?propertyReference=00012345&tradeCode=PL',
      '@contractors'
    )
    cy.route({
      method: 'POST',
      url: '/api/repairs/schedule',
      response: '10102030',
    }).as('apiCheck')
    cy.clock(now)
  })

  it('Schedules an appointment after raising a repair', () => {
    cy.visit(`${Cypress.env('HOST')}/properties/00012345`)
    cy.get('.govuk-heading-m')
      .contains('Raise a repair on this dwelling')
      .click()

    cy.get('#repair-request-form').within(() => {
      cy.get('#trade').type('Plumbing - PL')
      cy.get('#contractor').select('HH General Building Repair - H01')

      cy.get('select[id="rateScheduleItems[0][code]"]').select(
        'DES5R005 - Normal call outs'
      )

      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
      cy.get('#priorityDescription').select('5 [N] NORMAL')
      cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
      cy.get('#callerName').type('Bob Leek')
      cy.get('#contactNumber').clear().type('07788659111')
      cy.get('[type="submit"]').contains('Create works order').click()
      // Check body of post request
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
                priorityCode: 3,
                priorityDescription: '5 [N] NORMAL',
                requiredCompletionDateTime: requiredCompletionDateTime,
                numberOfDays: 30,
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
                name: 'HH General Building Repair',
                organization: {
                  reference: [
                    {
                      id: 'H01',
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
    //Appointment page with calendar
    cy.url().should('contains', 'work-orders/10102030/appointment/new')

    cy.get('.appointment-calendar').within(() => {
      cy.contains('Choose date and time')
      cy.get('.available').contains('11')
    })
  })
})
