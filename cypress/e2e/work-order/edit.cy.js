/// <reference types="cypress" />
import 'cypress-audit/commands'
describe('Editing a work order description', () => {
  context('As an authorisation manager', () => {
    beforeEach(() => {
      cy.loginWithAuthorisationManagerRole()
    })

    describe('When tenure is null', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/new' },
          { fixture: 'workOrders/workOrder.json' }
        ).as('workOrderRequest')

        cy.fixture('properties/property.json')
          .then((property) => {
            property.tenure = null

            cy.intercept(
              { method: 'GET', path: '/api/properties/00012345' },
              { body: property }
            )
          })
          .as('property')
      })

      it('doesnt throw error', () => {
        cy.visit('/work-orders/10000012/edit')

        cy.contains('Edit work order: 10000012')
        cy.contains('Edit description')
      })
    })

    describe(`When I don't trigger any errors`, () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/new' },
          { fixture: 'workOrders/workOrderToEdit.json' }
        ).as('workOrder')

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/appointments/10000012' },
          {
            fixture: 'workOrderAppointments/noAppointment.json',
          }
        )

        cy.intercept(
          { method: 'GET', path: '/api/properties/00014886' },
          { fixture: 'properties/property.json' }
        ).as('property')

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/tasks' },
          { fixture: 'workOrders/task.json' }
        ).as('tasks')

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/notes' },
          { fixture: 'workOrders/editedDescriptionNotes.json' }
        ).as('workOrderNotes')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/properties/00012345/alerts',
          },
          { fixture: 'properties/alerts.json' }
        ).as('alerts')
      })

      it('allows me to edit the work order and adds the updated description to the notes', () => {
        cy.visit('/work-orders/10000012')
        cy.get('[data-testid="details"] > .govuk-button').click()
        cy.intercept(
          {
            method: 'GET',
            path: '/api/contact-details/4552c539-2e00-8533-078d-9cc59d9115da',
          },
          { fixture: 'contactDetails/contactDetails.json' }
        ).as('contactDetails')
        cy.get('#workOrderMenu-2').click()
        cy.get('.MultiButton_button__ApRbt').click()
        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders/10000012/new',
          },
          { fixture: 'workOrders/workOrderToEdit.json' }
        ).as('workOrder')
        cy.get('[data-testid="editRepairDescription"]')
          .clear()
          .type('This is a test description.')
        cy.get('[data-testid="callerName"]').clear().type('Test Name')
        cy.get('[data-testid="contactNumber"]').clear().type('01234567890')
        cy.intercept(
          {
            method: 'PATCH',
            path: '/api/workOrders/editWorkOrder',
          },
          {
            statusCode: 200,
            body: {
              workOrderId: 10000012,
              description: 'This is a new test description.',
              callerName: 'Test Name',
              callerNumber: '01234567890',
            },
          }
        ).as('editWorkOrder')
        cy.intercept(
          {
            method: 'POST',
            path: '/api/jobStatusUpdate',
          },
          {
            statusCode: 200,
            body: {
              relatedWorkOrderReference: {
                id: 10000012,
              },
              comments: 'Description updated: This is a new test description.',
              typeCode: '0',
              otherType: 'addNote',
            },
          }
        ).as('addNote')
        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders/10000012/new',
          },
          { fixture: 'workOrders/editedWorkOrder.json' }
        ).as('editedWorkOrder')
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/property.json' }
        ).as('property')
        cy.get('.govuk-form-group > .govuk-button').click()
        cy.wait('@editedWorkOrder')
        cy.get('.lbh-body-m').should('contain', 'This is a test description.')
        cy.contains('Test Name')
        cy.contains('01234567890')

        cy.contains('.tabs-button', 'Notes').click()

        cy.get('[data-note-id="0"] > span').should(
          'contain',
          'Description updated: This is a test description.'
        )
        cy.visit('/work-orders/10000012')
      })

      it('cancels description update when cancel button is clicked', () => {
        cy.visit('/work-orders/10000012')
        cy.get('[data-testid="details"] > .govuk-button').click()
        cy.intercept(
          {
            method: 'GET',
            path: '/api/contact-details/4552c539-2e00-8533-078d-9cc59d9115da',
          },
          { fixture: 'contactDetails/contactDetails.json' }
        ).as('contactDetails')
        cy.get('[data-testid="details"] > .govuk-button').click()
        cy.get('#workOrderMenu-2').click({ force: true })
        cy.get('.MultiButton_button__ApRbt').click()
        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders/10000012/new',
          },
          { fixture: 'workOrders/editedWorkOrder.json' }
        ).as('editedWorkOrder')
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/property.json' }
        ).as('property')
        cy.get('.govuk-button-secondary').click()
        cy.location('pathname').should('eq', '/work-orders/10000012')
      })
    })

    describe('When I trigger errors', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/new' },
          { fixture: 'workOrders/workOrderToEdit.json' }
        ).as('workOrder')
        cy.intercept(
          { method: 'GET', path: '/api/properties/00014886' },
          { fixture: 'properties/property.json' }
        ).as('property')
        cy.intercept(
          {
            method: 'GET',
            path: '/api/contact-details/4552c539-2e00-8533-078d-9cc59d9115da',
          },
          { fixture: 'contactDetails/contactDetails.json' }
        ).as('contactDetails')
        cy.visit('/work-orders/10000012/edit')
      })

      it('shows an error when user submits empty fields', () => {
        cy.get('[data-testid="editRepairDescription"]').clear()
        cy.get('[data-testid="callerName"]').clear()
        cy.get('[data-testid="contactNumber"]').clear()
        cy.get('.govuk-form-group > .govuk-button').click()
        cy.contains('Please enter a repair description')
        cy.contains('Please enter a caller name')
        cy.contains('Please enter a telephone number')
      })

      it('shows an error when user submits too many characters for all fields', () => {
        const longDescription = new Array(240).join('a')
        const longName = new Array(56).join('a')
        const longContactNumber = new Array(13).join('1')
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

      it('Shows an error when user enters invalid characters for telephone number', () => {
        const invalidContactNumber = new Array(11).join('a')
        cy.get('[data-testid="contactNumber"]')
          .clear()
          .type(invalidContactNumber)
        cy.get('.govuk-form-group > .govuk-button').click()
        cy.contains(
          'Telephone number should be a number and with no empty spaces'
        )
      })

      it('Shows an error when user enters a space in the telephone number', () => {
        const invalidContactNumber = '01234 567890'
        cy.get('[data-testid="contactNumber"]')
          .clear()
          .type(invalidContactNumber)
        cy.get('.govuk-form-group > .govuk-button').click()
        cy.contains(
          'Telephone number should be a number and with no empty spaces'
        )
      })

      it('Shows an error when network request fails', () => {
        cy.intercept(
          {
            method: 'PATCH',
            path: `/api/workOrders/editWorkOrder`,
          },
          { statusCode: 500 }
        ).as('failedEditWorkOrder')
        cy.get('.govuk-form-group > .govuk-button').click()
        cy.wait('@failedEditWorkOrder')
        // cy.contains('Oops, an error occurred: 500')
        cy.contains('Oops an error occurred with error status: 500')
      })
    })
  })

  context('As an operative', () => {
    beforeEach(() => {
      cy.loginWithOperativeRole()
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/new' },
        { fixture: 'workOrders/workOrderToEdit.json' }
      ).as('workOrder')
      cy.visit('/work-orders/10000012/edit')
    })

    it('I am restricted from accessing the correct page', () => {
      cy.contains(`Access denied`)
    })
  })
})
