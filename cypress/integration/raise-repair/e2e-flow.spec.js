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
    cy.fixture('work-orders/work-order.json').as('workOrder')
    cy.fixture('work-orders/task.json').as('task')
    cy.fixture('properties/property.json').as('property')
    cy.fixture('work-orders/notes.json').as('notes')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/workOrders/10102030', '@workOrder')
    cy.route('GET', 'api/workOrders/10102030/notes', '@notes')
    cy.route('GET', 'api/hub-user', {})
    cy.route(
      'GET',
      'api/workOrders/?propertyReference=00012345&PageSize=50&PageNumber=1',
      []
    )
    cy.route(
      'GET',
      'api/appointments?workOrderReference=10102030&fromDate=2021-03-08&toDate=2021-04-11',
      '@availableAppointments'
    )

    cy.route('GET', 'api/workOrders/10102030/tasks', '@task')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route(
      'GET',
      'api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=*',
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

  describe('When the order is for a contractor whose appointments are managed in repairs hub', () => {
    beforeEach(() => {
      cy.route('POST', '/api/workOrders/schedule', {
        id: 10102030,
        statusCode: 200,
        statusCodeDescription: '???',
        externallyManagedAppointment: false,
      }).as('apiCheck')
    })

    it('Shows a success page right after a work order is created with an emergency priority', () => {
      cy.visit(`${Cypress.env('HOST')}/properties/00012345`)
      cy.get('.lbh-heading-h2')
        .contains('Raise a repair on this dwelling')
        .click()

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')
        cy.get('#contractor').select('Purdy Contracts (P) Ltd - PCL')

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
        cy.get('.lbh-announcement__content').within(() => {
          cy.get('h2').contains('Repair works order created')
          cy.contains('Works order number')
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
      cy.visit(`${Cypress.env('HOST')}/properties/00012345`)
      cy.get('.lbh-heading-h2')
        .contains('Raise a repair on this dwelling')
        .click()

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')
        cy.get('#contractor').select('Purdy Contracts (P) Ltd - PCL')

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

  describe('When the order is for a contrator whose appointments are managed externally', () => {
    beforeEach(() => {
      cy.route('POST', '/api/workOrders/schedule', {
        id: 10102030,
        statusCode: 200,
        statusCodeDescription: '???',
        externallyManagedAppointment: true,
      }).as('apiCheck')
    })

    it('Shows a success page instead of the calendar with a link to the external scheduler', () => {
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
        cy.get('[type="submit"]')
          .contains('Create works order')
          .click({ force: true })
      })

      //success form
      cy.contains('Repair works order created')
      cy.contains('Works order number')
      cy.contains('10102030')

      cy.contains('Please open DRS to book an appointment')
      cy.contains('a', 'open DRS').should(
        'have.attr',
        'href',
        Cypress.env('NEXT_PUBLIC_SCHEDULER_URL')
      )
    })
  })
})
