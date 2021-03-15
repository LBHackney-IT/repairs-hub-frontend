/// <reference types="cypress" />

import 'cypress-audit/commands'
// Mock date
const now = new Date('Wed Mar 10 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')

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

    cy.fixture('repairs/work-order.json').as('workOrder')
    cy.fixture('repairs/task.json').as('task')

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

    cy.route({
      method: 'POST',
      url: '/api/appointments',
      response: '',
    }).as('apiCheckAppointment')
    cy.route({
      method: 'POST',
      url: '/api/jobStatusUpdate',
      response: '',
    }).as('apiCheckjobStatus')
    cy.clock(now)
  })

  context('There are availbale appointments', () => {
    beforeEach(() => {
      cy.fixture('appointment/availability.json').as('availableAppointments')
      cy.route(
        'GET',
        'api/appointments?workOrderReference=10102030&fromDate=2021-03-08&toDate=2021-04-11',
        '@availableAppointments'
      )
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
      cy.contains('Repair task details')
      // availble slots are not shown
      cy.contains('#available-slots').should('not.exist')

      cy.get('.appointment-calendar').within(() => {
        cy.contains('Choose date and time')
        cy.contains('March')
        cy.get('.available').contains('17').click()
      })

      //available slots appear for 17th of March, only available AM slot
      cy.get('form').within(() => {
        cy.contains('Wednesday, 17 March')
        cy.get('[type="radio"]').first().should('have.value', 'AM 8:00 -12:00')
        cy.get('[type="radio"]')
          .last()
          .should('not.have.value', 'PM 12:00-4:00')
        //press "cancel" button
        cy.get('[type="button"]').contains('Cancel').click()
        //check that availbale slots dissapear
        cy.contains('Wednesday, 17 March').should('not.exist')
      })

      //choose 11th of March, that has AM and PM slots available
      cy.get('.appointment-calendar').within(() => {
        cy.get('.available').contains('11').click()
      })
      cy.get('form').within(() => {
        cy.contains('Thursday, 11 March')
        cy.get('[type="radio"]').first().should('have.value', 'AM 8:00 -12:00')
        cy.get('[type="radio"]').last().should('have.value', 'PM 12:00-4:00')

        // press "Add" without choosing slot and entering comments
        cy.get('[type="submit"]').contains('Add').click()
        cy.contains('Please select a time slot')
        cy.contains('Please add comments')

        // choose AM slot and leave comment
        cy.get('[type="radio"]').first().check()
        cy.get('#comments').type('10 am works for me')
        cy.get('[type="submit"]').contains('Add').click()
      })
      // Summary page
      cy.contains('Confirm date and time')
      cy.get('form').within(() => {
        cy.contains('Appointment Details:')
        cy.contains('Thursday, 11 March')
        cy.contains('AM')
        cy.contains('Comments: 10 am works for me')
        cy.get('[type="submit"]').contains('Change').click()
      })
      // Goes back to change slot and comments
      cy.get('form').within(() => {
        cy.contains('Thursday, 11 March')
        cy.get('[type="radio"]').first().should('be.checked')
        cy.get('#comments').should('have.value', '10 am works for me')

        cy.get('[type="radio"]').last().check()
        cy.get('#comments').clear().type('Prefer 1pm appointment')
        cy.get('[type="submit"]').contains('Add').click()
      })

      // Summary page contains updated info
      cy.contains('Confirm date and time')
      cy.get('form').within(() => {
        cy.contains('Appointment Details:')
        cy.contains('Thursday, 11 March')
        cy.contains('PM')
        cy.contains('Prefer 1pm appointment')
      })
      cy.get('[type="button"]').contains('Create work order').click()
      //appointment api check
      cy.get('@apiCheckAppointment')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: 10102030,
            description: '',
            allocatedBy: '',
          },
          appointmentReference: {
            id: '41/2021-03-11',
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
          comments: 'Prefer 1pm appointment',
          // Other
          typeCode: '0',
          otherType: 'addNote',
        })

      //success form
      cy.contains('Repair work order created')
      cy.contains('Work order number')

      cy.contains('10102030')

      cy.contains('Thursday, 11 March')
      cy.contains('PM')
      cy.contains('Comments: Prefer 1pm appointment')
      cy.contains('a', 'View work order')
      cy.contains('a', 'Back to 16 Pitcairn House')
      cy.contains('a', 'Start a new search')
      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('No available appointments', () => {
    beforeEach(() => {
      cy.route(
        'GET',
        'api/appointments?workOrderReference=10102030&fromDate=2021-03-08&toDate=2021-04-11',
        []
      )
    })

    it('Should display message that no appointments are availbale', () => {
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
      })

      // shows that there are no available appointments

      cy.get('#no-appointment').contains('No available appointments')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
