/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Show work order page', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012' },
      { fixture: 'workOrders/workOrder.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/notes' },
      { fixture: 'workOrders/notes.json' }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
      },
      { body: [] }
    )
  })

  it('Shows various details about the work order, property and assigned contractor', () => {
    cy.visit('/work-orders/10000012')

    cy.get('.lbh-heading-h1').within(() => {
      cy.contains('Work order: 10000012')
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

    cy.checkForTenureDetails(
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
      cy.contains('18 Jan 2021, 15:28')
      cy.contains('Target: 23 Jan 2021, 18:30')
      cy.contains('Caller: Jill Smith')
      cy.contains('07700 900999')
    })

    cy.contains('Assigned to: Alphatrack (S) Systems Lt')

    cy.audit()
  })

  context('When the work order has been assigned operatives', () => {
    beforeEach(() => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.operatives = [
          {
            id: 0,
            payrollNumber: '0',
            name: 'Operative 1',
            trades: ['DE'],
          },
          {
            id: 1,
            payrollNumber: '1',
            name: 'Operative 2',
            trades: ['DE'],
          },
        ]

        workOrder.appointment = {
          date: '2021-03-19',
          description: 'PM Slot',
          end: '18:00',
          start: '12:00',
        }

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012' },
          { body: workOrder }
        )
      })
    })

    context('And the appointment start time is in the future', () => {
      beforeEach(() => {
        cy.clock(new Date('March 19 2021 11:59:00Z'))
      })

      it('Does not show the assigned operatives', () => {
        cy.visit('/work-orders/10000012')

        cy.get('.appointment-details').within(() => {
          cy.contains('Appointment details')
          cy.contains('19 Mar 2021, 12:00-18:00')
        })

        cy.contains('Operative 1').should('not.exist')
        cy.contains('Operative 2').should('not.exist')
      })
    })

    context('And the appointment start time is in the past', () => {
      beforeEach(() => {
        cy.clock(new Date('March 19 2021 12:01:00Z'))
      })

      it('Shows the assigned operatives', () => {
        cy.visit('/work-orders/10000012')

        cy.get('.appointment-details').within(() => {
          cy.contains('Appointment details')
          cy.contains('19 Mar 2021, 12:00-18:00')
        })

        cy.contains('Operatives: Operative 1, Operative 2')
      })
    })
  })

  context('When the work order has work orders on repairs history tab', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
        },
        { fixture: 'workOrders/workOrders.json' }
      ).as('repairsHistory')
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000040' },
        { fixture: 'workOrders/priorityImmediate.json' }
      )
      cy.intercept(
        { method: 'GET', path: '/api/properties/00089473' },
        { fixture: 'properties/property.json' }
      )
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00089473&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
        },
        { body: [] }
      )

      cy.visit('/work-orders/10000012')
      // Tasks and SORs tab should be active
      cy.get('.govuk-tabs__list-item--selected a').contains('Tasks and SORs')
      // Now select Notes tab
      cy.get('a[id="tab_repairs-history-tab"]').click()
      cy.wait('@repairsHistory')
    })

    it('Clicks the first repair of repairs history', () => {
      cy.contains('10000040').click()
      cy.url().should('contains', 'work-orders/10000040')

      cy.get('.lbh-heading-h1').within(() => {
        cy.contains('Work order: 10000040')
      })
    })
  })
})
