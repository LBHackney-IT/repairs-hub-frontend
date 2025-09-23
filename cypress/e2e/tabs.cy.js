/// <reference types="cypress" />

/// <reference types="cypress" />

describe('Tabs component', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10005254' },
      { fixture: 'workOrders/workOrder.json' }
    ).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10005254' },
      {
        fixture: 'workOrderAppointments/noAppointment.json',
      }
    )

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10005254/tasks' },
      { fixture: 'workOrders/tasksAndSors.json' }
    )
  })

  it('renders the tabs component', () => {
    cy.visit('/work-orders/10005254')

    cy.wait('@workOrderRequest')

    cy.contains('.tabs-button', 'Tasks and SORs')
    cy.contains('.tabs-button', 'Notes')
    cy.contains('.tabs-button', 'Pending variation')
    cy.contains('.tabs-button', 'Work orders history')
    cy.contains('.tabs-button', 'Related work orders')
    cy.contains('.tabs-button', 'Photos')

    // first tab defaults to active
    cy.get(':nth-child(1) > .tabs-button').should('have.class', 'active')
    cy.get('#tasks-and-sors-tab').should('exist')

    // open a different tab
    cy.contains('.tabs-button', 'Notes').click()

    cy.get('#tasks-and-sors-tab').should('not.exist')
    cy.get('#notes-tab').should('exist')

    cy.contains('.tabs-button', 'Tasks and SORs').should(
      'not.have.class',
      'active'
    )
    cy.contains('.tabs-button', 'Notes').should('have.class', 'active')

    cy.location().should((loc) => {
      expect(loc.search).to.eq('?currentTab=notes-tab')
    })
  })

  it('Loads the correct active tab from currentTab query', () => {
    cy.visit('/work-orders/10005254?currentTab=photos-tab')

    cy.contains('.tabs-button', 'Photos').should('have.class', 'active')
    cy.get('#photos-tab').should('exist')
  })

  it('Defaults to first tab when currentTab query is invalid', () => {
    cy.visit('/work-orders/10005254?currentTab=fake-tab')

    cy.contains('.tabs-button', 'Tasks and SORs').should('have.class', 'active')
    cy.get('#tasks-and-sors-tab').should('exist')
  })
})
