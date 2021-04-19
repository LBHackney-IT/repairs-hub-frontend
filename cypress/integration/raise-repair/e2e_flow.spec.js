/// <reference types="cypress" />

import 'cypress-audit/commands'
// Mock date
const now = new Date('Wed Mar 10 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')

describe('Schedule appointment form', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.server()
    // Stub request for raise a repair, schedule appointment and view work order
    cy.fixture('schedule-of-rates/codes.json').as('sorCodes')
    cy.fixture('schedule-of-rates/priorities.json').as('priorities')
    cy.fixture('schedule-of-rates/trades.json').as('trades')
    cy.fixture('contractors/contractors.json').as('contractors')
    cy.fixture('properties/property.json').as('property')
    cy.fixture('appointment/availability.json').as('availableAppointments')
    cy.fixture('repairs/work-order.json').as('workOrder')
    cy.fixture('repairs/task.json').as('task')
    cy.fixture('properties/property.json').as('property')
    cy.fixture('repairs/notes.json').as('notes')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/repairs/10102030', '@workOrder')
    cy.route('GET', 'api/repairs/10102030/notes', '@notes')
    cy.route('GET', 'api/hub-user', {})
    cy.route(
      'GET',
      'api/repairs/?propertyReference=00012345&PageSize=50&PageNumber=1',
      []
    )
    cy.route(
      'GET',
      'api/appointments?workOrderReference=10102030&fromDate=2021-03-08&toDate=2021-04-11',
      '@availableAppointments'
    )

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
  // when priority is Emergency it is not redirecting to schedule appointment page
  it('Shows a success page right after work order created', () => {
    cy.visit(`${Cypress.env('HOST')}/properties/00012345`)
    cy.get('.lbh-heading-h2')
      .contains('Raise a repair on this dwelling')
      .click()

    cy.get('#repair-request-form').within(() => {
      cy.get('#trade').type('Plumbing - PL')
      cy.get('#contractor').select('HH General Building Repair - H01')

      cy.get('select[id="rateScheduleItems[0][code]"]').select(
        'DES5R006 - Urgent call outs'
      )

      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('2')
      cy.get('#priorityDescription').select('2 [E] EMERGENCY')
      cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
      cy.get('#callerName').type('Bob Leek', { force: true })
      cy.get('#contactNumber')
        .clear({ force: true })
        .type('07788659111', { force: true })
      cy.get('[type="submit"]')
        .contains('Create works order')
        .click({ force: true })
      // Check body of post request, creates work order
      cy.wait('@apiCheck')
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
                priorityCode: 2,
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

    //success form
    cy.contains('Repair work order created')
    cy.contains('Work order number')
    cy.contains('10102030')
    cy.contains('a', 'View work order')
    cy.contains('a', 'Back to 16 Pitcairn House')
    cy.contains('a', 'Start a new search')

    // Run lighthouse audit for accessibility report
    cy.audit()
  })

  // when priority is Normal it is redirecting to schedule appointment page
  it('Shows a success page right after work order created', () => {
    cy.visit(`${Cypress.env('HOST')}/properties/00012345`)
    cy.get('.lbh-heading-h2')
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
      cy.get('#callerName').type('Bob Leek', { force: true })
      cy.get('#contactNumber')
        .clear({ force: true })
        .type('07788659111', { force: true })
      cy.get('[type="submit"]')
        .contains('Create works order')
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
                priorityCode: 4,
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
