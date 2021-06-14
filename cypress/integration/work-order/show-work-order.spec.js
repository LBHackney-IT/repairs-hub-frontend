/// <reference types="cypress" />

import 'cypress-audit/commands'

import MockDate from 'mockdate'

describe('Show work order page', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
    cy.server()

    cy.fixture('properties/property.json').as('property')
    cy.fixture('work-orders/notes.json').as('notes')

    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/workOrders/10000012/notes', '@notes')

    cy.fixture('work-orders/work-order.json').as('workOrder')
    cy.route('GET', 'api/workOrders/10000012', '@workOrder').as(
      'workOrderResponse'
    )
    cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
  })

  it('Shows various details about the work order, property and assigned contractor', () => {
    cy.get('.lbh-heading-h1').within(() => {
      cy.contains('Works order: 10000012')
    })

    cy.get('.lbh-body-m').within(() => {
      cy.contains('This is an urgent repair description')
    })

    cy.get('.property-details-main-section').within(() => {
      cy.contains('Dwelling')
      cy.contains('16 Pitcairn House').should(
        'have.attr',
        'href',
        '/properties/00012345'
      )
      cy.contains('St Thomass Square').should(
        'have.attr',
        'href',
        '/properties/00012345'
      )
      cy.contains('E9 6PT')
    })

    cy.checkForTenureAlertDetails(
      'Tenure: Secure',
      ['Address Alert: Property Under Disrepair (DIS)'],
      [
        'Contact Alert: No Lone Visits (CV)',
        'Contact Alert: Verbal Abuse or Threat of (VA)',
      ]
    )

    cy.get('.work-order-info').within(() => {
      cy.contains('Status: In Progress')
      cy.contains('Priority: U - Urgent (5 Working days)')
      cy.contains('Raised by Dummy Agent')
      cy.contains('18 Jan 2021, 3:28 pm')
      cy.contains('Target: 23 Jan 2021, 6:30 pm')
      cy.contains('Caller: Jill Smith')
      cy.contains('07700 900999')
    })

    cy.contains('Assigned to: Alphatrack (S) Systems Lt')

    cy.audit()
  })

  context('When the work order has no appointment', () => {
    it('Shows a link to schedule it', () => {
      cy.get('.appointment-details').within(() => {
        cy.contains('Appointment details')
        cy.contains('a', 'Schedule an appointment')
      })
    })
  })

  context('When the work order has an existing appointment', () => {
    beforeEach(() => {
      cy.fixture('work-orders/with-appointment.json').as('workOrder')
      cy.route('GET', 'api/workOrders/10000012', '@workOrder')
      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)

      cy.wait('@workOrderResponse')
    })

    it('Shows the scheduled appointment details', () => {
      cy.get('.appointment-details').within(() => {
        cy.contains('Appointment details')
        cy.contains('19 Mar 2021, 12:00-18:00')
      })
    })

    context('And the appointment start time is in the future', () => {
      beforeEach(() => {
        MockDate.set(new Date('March 19 2021 11:59:00Z'))
      })

      it('Does not show the assigned operatives', () => {
        cy.contains('Operative 1').should('not.exist')
        cy.contains('Operative 2').should('not.exist')
      })
    })

    context('And the appointment start time is in the past', () => {
      beforeEach(() => {
        MockDate.set(new Date('March 19 2021 12:01:00Z'))
      })

      it('Shows the assigned operatives', () => {
        cy.contains('Operative 1')
        cy.contains('Operative 2')
      })
    })
  })

  context('When the work order has an immediate priority', () => {
    beforeEach(() => {
      cy.fixture('work-orders/priority-immediate.json').as('workOrderImmediate')
      cy.route('GET', 'api/workOrders/10000012', '@workOrderImmediate')

      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    })

    it('Indicates that an appointment is not applicable', () => {
      cy.get('.appointment-details').within(() => {
        cy.contains('Appointment details')
        cy.contains('Not applicable')
      })
    })
  })
})
