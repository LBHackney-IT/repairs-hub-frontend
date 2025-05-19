/// <reference types="cypress" />
import 'cypress-audit/commands'
describe('Editing a work order description', () => {
  context('As an authorisation manager', () => {
    beforeEach(() => {
      cy.loginWithAuthorisationManagerRole()
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/workOrderToEdit.json' }
      ).as('workOrder')
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/tasks' },
        { fixture: 'workOrders/task.json' }
      ).as('tasks')
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/properties/4552c539-2e00-8533-078d-9cc59d9115da/person-alerts',
        },
        { fixture: 'properties/personAlerts.json' }
      ).as('personAlerts')
      cy.intercept(
        {
          method: 'GET',
          path: '/api/properties/00012345/location-alerts',
        },
        { fixture: 'properties/personAlerts.json' }
      ).as('locationAlerts')
      cy.visit('/work-orders/10000012')
      cy.wait('@workOrder')
    })
    it('allows me to edit the work order and adds the updated description to the notes', () => {
      cy.get('[data-testid="details"] > .govuk-button').click()
      cy.get('#workOrderMenu-2').click()
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      ).as('property')
      cy.intercept(
        {
          method: 'GET',
          path: '/api/contact-details/4552c539-2e00-8533-078d-9cc59d9115da',
        },
        { fixture: 'contactDetails/contactDetails.json' }
      ).as('contactDetails')
      cy.get('.MultiButton_button__ApRbt').click()
      cy.get('[data-testid="editRepairDescription"]')
        .clear()
        .type('This is a test description.')
      cy.get('[data-testid="callerName"]').clear().type('Test Name')
      cy.get('[data-testid="contactNumber"]').clear().type('01234567890')
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.intercept({
        method: 'PATCH',
        path: '/api/workOrders/editWorkOrder',
      }).as('editWorkOrder')
      cy.intercept(
        {
          method: 'GET',
          path: '/api/workOrders/10000012',
        },
        { fixture: 'workorders/editedWorkOrder.json' }
      ).as('editedWorkOrder')
      cy.get('.lbh-body-m').should('contain', 'This is a test description.')
      cy.contains('Test Name')
      cy.contains('01234567890')
      cy.get('#tab_notes-tab').click()

      cy.get('[data-note-id="0"] > span').should(
        'contain',
        'Description updated: This is a test description.'
      )
      cy.visit('/work-orders/10000012')
    })
    it('cancels description update when cancel button is clicked', () => {
      cy.get('[data-testid="details"] > .govuk-button').click()
      cy.get('#workOrderMenu-2').click()
      cy.get('.MultiButton_button__ApRbt').click()
      cy.get('.govuk-button-secondary').click()
      cy.url().should('include', '/work-orders/10000012')
    })
  })
  context('As an operative', () => {
    beforeEach(() => {
      cy.loginWithOperativeRole()
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012' },
        { fixture: 'workOrders/workOrderToEdit.json' }
      ).as('workOrder')
      cy.visit('/work-orders/10000012/edit')
    })
    it('I am restricted from accessing the correct page', () => {
      cy.contains(`Access denied`)
    })
  })
  context('When user submits empty fields', () => {
    it('Shows an error', () => {
      cy.loginWithAuthorisationManagerRole()
      cy.intercept({
        method: 'PATCH',
        path: `/api/workOrders/editWorkOrder`,
      })
      cy.visit('/work-orders/10000012/edit')
      cy.get('[data-testid="editRepairDescription"]').clear()
      cy.get('[data-testid="callerName"]').clear()
      cy.get('[data-testid="contactNumber"]').clear()
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.contains('Please enter a repair description')
      cy.contains('Please enter a caller name')
      cy.contains('Please enter a telephone number')
    })
  })
  context('When user submits too many characters for all fields', () => {
    it('Shows an error', () => {
      const longDescription = new Array(240).join('a')
      const longName = new Array(56).join('a')
      const longContactNumber = new Array(13).join('1')
      cy.loginWithAuthorisationManagerRole()
      cy.intercept({
        method: 'PATCH',
        path: `/api/workOrders/editWorkOrder`,
      })
      cy.visit('/work-orders/10000012/edit')
      cy.get('[data-testid="editRepairDescription"]')
        .clear()
        .type(longDescription)
      cy.get('[data-testid="callerName"]').clear().type(longName)
      cy.get('[data-testid="contactNumber"]').clear().type(longContactNumber)
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.contains('You have exceeded the maximum amount of characters')
      cy.contains('You have exceeded the maximum amount of 50 characters')
      cy.contains('Please enter a valid UK telephone number (11 digits)')
    })
  })
  context('When user enters invalid characters for telephone number', () => {
    it('Shows an error', () => {
      const invalidContactNumber = new Array(11).join('a')
      cy.loginWithAuthorisationManagerRole()
      cy.intercept({
        method: 'PATCH',
        path: `/api/workOrders/editWorkOrder`,
      })
      cy.visit('/work-orders/10000012/edit')
      cy.get('[data-testid="contactNumber"]').clear().type(invalidContactNumber)
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.contains(
        'Telephone number should be a number and with no empty spaces'
      )
    })
  })
  context('When user enters a space in the telephone number', () => {
    it('Shows an error', () => {
      const invalidContactNumber = '01234 567890'
      cy.loginWithAuthorisationManagerRole()
      cy.intercept({
        method: 'PATCH',
        path: `/api/workOrders/editWorkOrder`,
      })
      cy.visit('/work-orders/10000012/edit')
      cy.get('[data-testid="contactNumber"]').clear().type(invalidContactNumber)
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.contains(
        'Telephone number should be a number and with no empty spaces'
      )
    })
  })

  context('When network request fails', () => {
    it('Shows an error', () => {
      cy.loginWithAuthorisationManagerRole()
      cy.intercept(
        {
          method: 'PATCH',
          path: `/api/workOrders/editWorkOrder`,
        },
        { statusCode: 500 }
      ).as('failedEditWorkOrder')
      cy.visit('/work-orders/10000012/edit')
      cy.get('.govuk-form-group > .govuk-button').click()
      cy.wait('@failedEditWorkOrder')
      cy.contains('Oops, an error occurred: 500')
    })
  })
})
