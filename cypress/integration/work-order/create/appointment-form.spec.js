/// <reference types="cypress" />

import 'cypress-audit/commands'
import { NORMAL_PRIORITY_CODE } from '../../../../src/utils/helpers/priorities'
import { STATUS_CANCELLED } from '../../../../src/utils/statusCodes'

// Mock date
const now = new Date('Wed Mar 10 2021 16:27:20 GMT+0000 (Greenwich Mean Time)')
const targetTime = '2021-03-23T18:30:00.00000'

describe('Schedule appointment form', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    // Stub request for raise a work order form page
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
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=PCL',
      },
      { fixture: 'scheduleOfRates/codes.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/priorities' },
      { fixture: 'scheduleOfRates/priorities.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/trades?propRef=00012345' },
      { fixture: 'scheduleOfRates/trades.json' }
    )

    cy.fixture('workOrders/workOrder.json')
      .then((workOrder) => {
        workOrder.target = targetTime

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10102030' },
          { body: workOrder }
        )
      })
      .as('workOrder')

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
    cy.intercept(
      { method: 'POST', path: '/api/appointments' },
      { body: '' }
    ).as('apiCheckAppointment')
    cy.intercept(
      { method: 'POST', path: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('apiCheckjobStatus')
  })

  context('There are available appointments', () => {
    beforeEach(() => {
      cy.clock(now)

      cy.intercept(
        {
          method: 'GET',
          pathname: '/api/appointments',
        },
        { fixture: 'appointment/availability.json' }
      ).as('availableAppointments')
    })

    it('Schedules an appointment after raising a repair', () => {
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
        cy.get('#priorityDescription').select('5 [N] NORMAL')
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

      cy.wait(['@workOrder', '@availableAppointments'])

      //Appointment page with calendar
      cy.contains('Work order task details')
      // availble slots are not shown
      cy.contains('#available-slots').should('not.exist')

      cy.get('.appointment-calendar').within(() => {
        cy.contains('Choose date and time')
        cy.contains('March')
        cy.get('.available').contains('17').click({ force: true })
      })

      //available slots appear for 17th of March, only available AM slot
      cy.get('form').within(() => {
        cy.contains('Wednesday, 17 March')
        cy.get('[type="radio"]').first().should('have.value', 'AM 8:00 -12:00')
        cy.get('[type="radio"]')
          .last()
          .should('not.have.value', 'PM 12:00-4:00')
        //press "cancel" button
        cy.get('[type="button"]').contains('Cancel').click({ force: true })
        //check that available slots dissapear
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
        cy.get('[type="submit"]').contains('Add').click({ force: true })
        cy.contains('Please select a time slot')
        cy.contains('Please add comments')

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
        cy.get('[type="submit"]').contains('Change').click()
      })
      // Goes back to change slot and comments
      cy.get('form').within(() => {
        cy.contains('Thursday, 11 March')
        cy.get('[type="radio"]').first().should('be.checked')
        cy.get('#comments')
          .scrollIntoView()
          .should('have.value', '10 am works for me')

        cy.get('[type="radio"]').last().check()
        cy.get('#comments')
          .clear({ force: true })
          .type('Prefer 1pm appointment', { force: true })
        cy.get('[type="submit"]').contains('Add').click({ force: true })
      })

      // Summary page contains updated info
      cy.contains('Confirm date and time')
      cy.get('form').within(() => {
        cy.contains('Appointment Details:')
        cy.contains('Thursday, 11 March')
        cy.contains('PM')
        cy.contains('Prefer 1pm appointment')
      })
      cy.get('[type="button"]')
        .contains('Book appointment')
        .click({ force: true })

      //appointment api check

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
            id: '41/2021-03-11',
            description: '',
            allocatedBy: '',
          },
        })

      cy.wait('@apiCheckjobStatus')
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
      cy.clock(now)

      cy.intercept(
        {
          method: 'GET',
          pathname: '/api/appointments',
        },
        { body: [] }
      ).as('availableAppointments')
    })

    it('Should display message that no appointments are available', () => {
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
        cy.get('#priorityDescription').select('5 [N] NORMAL')
        cy.get('#descriptionOfWork').get('.govuk-textarea').type('Testing')
        cy.get('#callerName').type('Bob Leek', { force: true })
        cy.get('#contactNumber')
          .clear({ force: true })
          .type('07788659111', { force: true })
        cy.get('[type="submit"]')
          .contains('Create work order')
          .click({ force: true })
      })

      cy.wait('@availableAppointments')

      // shows that there are no available appointments
      cy.get('#no-appointment').contains('No available appointments')

      // Link back to work order
      cy.get('.lbh-list li').within(() => {
        cy.contains('View work order').should(
          'have.attr',
          'href',
          '/work-orders/10102030'
        )
      })

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('When the work order is in a completed status', () => {
    beforeEach(() => {
      cy.fixture('workOrders/workOrder.json')
        .then((workOrder) => {
          workOrder.status = STATUS_CANCELLED.description

          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10102030' },
            { body: workOrder }
          )
        })
        .as('workOrder')
    })

    it('Shows an error message if navigating to appointment new page directly', () => {
      cy.visit('work-orders/10102030/appointment/new')

      cy.wait('@workOrder')

      cy.get('.appointment-calendar').should('not.exist')

      cy.contains(
        'Appointment scheduling for closed or authorisation pending work orders is not permitted'
      )
    })
  })
})
