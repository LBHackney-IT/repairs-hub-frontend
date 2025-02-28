/// <reference types="cypress" />
import 'cypress-audit/commands'
describe('Editing a work order description', () => {
  context('As an authorisation manager', () => {
    beforeEach(() => {
      cy.loginWithAuthorisationManagerRole()
      cy.fixture('workOrders/workOrder.json')
        .then((workOrder) => {
          workOrder.reference = 10000040
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000040' },
            { body: workOrder }
          )
        })
        .as('workOrder')
      cy.fixture('workOrders/editedWorkOrder.json')
        .then((workOrder) => {
          workOrder.reference = 10000040
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000040' },
            { body: workOrder }
          )
        })
        .as('editedWorkOrder')
      cy.intercept({
        method: 'GET',
        path: 'api/workOrders/10000040/tasks',
      }).as('tasks')
      cy.visit('/work-orders/10000040')
    })
    it('allows me to edit the work order description and adds the updated description to the notes', () => {
      cy.get('[data-testid="details"] > .govuk-button').click()
      cy.get('#workOrderMenu-2').click()
      cy.get('.MultiButton_button__ApRbt').click()
      cy.get('[data-testid="editRepairDescription"]')
        .clear()
        .type('This is a test description.')
      cy.intercept({
        method: 'PATCH',
        path: '/api/workOrders/updateDescription',
      }).as('updateDescription')
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.get('.lbh-body-m').should('contain', 'This is a test description.')
      cy.get('#tab_notes-tab').click()
      cy.get('[data-note-id="0"] > span').should(
        'contain',
        'Description updated: This is a test description.'
      )
      cy.visit('/work-orders/10000040')
    })
    it('cancels description update when cancel button is clicked', () => {
      cy.get('[data-testid="details"] > .govuk-button').click()
      cy.get('#workOrderMenu-2').click()
      cy.get('.MultiButton_button__ApRbt').click()
      cy.get('.govuk-button-secondary').click()
      cy.url().should('include', '/work-orders/10000040')
    })
  })
  context('As an operative', () => {
    beforeEach(() => {
      cy.loginWithOperativeRole()
      cy.fixture('workOrders/workOrder.json')
        .then((workOrder) => {
          workOrder.reference = 10000040
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000040' },
            { body: workOrder }
          )
        })
        .as('workOrder')
      cy.visit('/work-orders/10000040/edit')
    })
    it.only('I am restricted from accessing the correct page', () => {
      cy.contains(`Access denied`)
    })
  })
  context('When user submits empty text field', () => {
    it('Shows an error', () => {
      cy.loginWithAuthorisationManagerRole()
      cy.intercept({
        method: 'PATCH',
        path: `/api/workOrders/updateDescription`,
      })
      cy.visit('/work-orders/10000040/edit')
      cy.get('[data-testid="editRepairDescription"]').clear()
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.contains('Please enter a repair description')
    })
  })
  context('When user submits too many characters', () => {
    it('Shows an error', () => {
      const longDescription = new Array(240).join('a')
      cy.loginWithAuthorisationManagerRole()
      cy.intercept({
        method: 'PATCH',
        path: `/api/workOrders/updateDescription`,
      })
      cy.visit('/work-orders/10000040/edit')
      cy.get('[data-testid="editRepairDescription"]')
        .clear()
        .type(longDescription)
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.contains('You have exceeded the maximum amount of characters')
    })
  })

  context('When network request fails', () => {
    it('Shows an error', () => {
      cy.loginWithAuthorisationManagerRole()
      cy.intercept(
        {
          method: 'PATCH',
          path: `/api/workOrders/updateDescription`,
        },
        { statusCode: 500 }
      ).as('failedUpdateDescription')
      cy.visit('/work-orders/10000040/edit')
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.wait('@failedUpdateDescription')
      cy.contains('Oops, an error occurred: 500')
    })
  })
})
