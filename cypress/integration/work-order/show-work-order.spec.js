/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Show work order', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
    cy.server()
    // Stub request for work order and property

    cy.fixture('properties/property.json').as('property')
    cy.fixture('work-orders/notes.json').as('notes')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/workOrders/10000012/notes', '@notes')
  })

  context('Displays the page for a work order with appointment details', () => {
    beforeEach(() => {
      cy.fixture('work-orders/with-appointment.json').as('workOrder')
      cy.route('GET', 'api/workOrders/10000012', '@workOrder')
      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    })

    it('Works order header with reference number', () => {
      cy.get('.lbh-heading-l').within(() => {
        cy.contains('Works order: 10000012')
      })
    })

    it('Repair description', () => {
      cy.get('.govuk-body-m').within(() => {
        cy.contains('This is an urgent repair description')
      })
    })

    it('Property details', () => {
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

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('Work order details', () => {
      cy.get('.work-order-info').within(() => {
        cy.contains('Status: In Progress')
        cy.contains('Priority: U - Urgent (5 Working days)')
        cy.contains('Raised by Dummy Agent')
        cy.contains('18 Jan 2021, 3:28 pm')
        cy.contains('Target: 23 Jan 2021, 6:30 pm')
        cy.contains('Caller: Jill Smith')
        cy.contains('07700 900999')
      })

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('Appointment details', () => {
      cy.get('.appointment-details').within(() => {
        cy.contains('Appointment details')
        cy.contains('19 Mar 2021, 12:00-18:00')
      })
      //can see who was assigned
      cy.contains('Assigned to: Alphatrack (S) Systems Lt')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
  context(
    'Displays the page for a work order without appointment details',
    () => {
      beforeEach(() => {
        cy.fixture('work-orders/work-order.json').as('workOrder')
        cy.route('GET', 'api/workOrders/10000012', '@workOrder')
        cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
      })

      it('Work order details', () => {
        cy.get('.work-order-info').within(() => {
          cy.contains('Status: In Progress')
          cy.contains('Priority: U - Urgent (5 Working days)')
          cy.contains('Raised by Dummy Agent')
          cy.contains('18 Jan 2021, 3:28 pm')
          cy.contains('Target: 23 Jan 2021, 6:30 pm')
          cy.contains('Caller: Jill Smith')
          cy.contains('07700 900999')
        })

        // Run lighthouse audit for accessibility report
        cy.audit()
      })

      it('Appointment details', () => {
        cy.get('.appointment-details').within(() => {
          cy.contains('Appointment details')
          cy.contains('a', 'Schedule an appointment')
        })
        //can see who was assigned
        cy.contains('Assigned to: Alphatrack (S) Systems Lt')

        // Run lighthouse audit for accessibility report
        cy.audit()
      })
    }
  )

  context('Displays the page for a work order with Emergency priority', () => {
    beforeEach(() => {
      cy.fixture('work-orders/priority-emergency.json').as('workOrderEmergency')
      cy.route('GET', 'api/workOrders/10000012', '@workOrderEmergency')

      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
    })

    it('Work order details', () => {
      cy.get('.work-order-info').within(() => {
        cy.contains('Status: In Progress')
        cy.contains('Priority: 2 [E] EMERGENCY')
        cy.contains('Raised by Dummy Agent')
        cy.contains('18 Jan 2021, 3:28 pm')
        cy.contains('Target: 23 Jan 2021, 6:30 pm')
        cy.contains('Caller: Jill Smith')
        cy.contains('07700 900999')
      })

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('Appointment details', () => {
      cy.get('.appointment-details').within(() => {
        cy.contains('Appointment details')
        cy.contains('Not applicable')
      })
      //can see who was assigned
      cy.contains('Assigned to: Alphatrack (S) Systems Lt')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
