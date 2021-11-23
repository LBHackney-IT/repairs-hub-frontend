/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Closing my own work order', () => {
  const now = new Date('June 11 2021 13:49:15Z')

  context('when the job is completed without variation', () => {
    beforeEach(() => {
      cy.clock(now)

      cy.intercept(
        {
          method: 'GET',
          path: '/api/operatives/hu0001/workorders',
        },
        {
          fixture: 'operatives/workOrders.json',
        }
      ).as('workOrderIndexRequest')

      cy.intercept('/api/workOrders/10000621', {
        fixture: 'workOrders/workOrder.json',
      }).as('workOrderRequest')

      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      ).as('propertyRequest')

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000621/tasks' },
        { fixture: 'workOrders/tasksAndSorsUnvaried.json' }
      ).as('tasksRequest')

      cy.intercept(
        { method: 'POST', path: '/api/workOrderComplete' },
        { body: '' }
      ).as('workOrderCompleteRequest')

      cy.loginWithOperativeRole()
    })

    it('confirms success and returns me to the index', () => {
      cy.visit('/')

      cy.wait('@workOrderIndexRequest')

      cy.get('.arrow.right').eq(1).click()

      cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

      cy.contains('a', 'Confirm').click()

      cy.wait('@workOrderRequest')

      cy.get('.govuk-button').contains('Close work order').click()

      cy.get('#notes').type('I attended')

      cy.url().should('match', /work-orders\/10000621\/close$/)

      cy.get('.govuk-form-group--error').contains(
        'Please select a reason for closing the work order'
      )

      cy.get('.lbh-radios input[type="radio"]').check('Work Order Completed') // Checking by value, not text

      cy.get('.govuk-button').contains('Close work order').click()

      cy.wait('@workOrderCompleteRequest')

      cy.get('@workOrderCompleteRequest')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: '10000621',
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '0',
              otherType: 'complete',
              comments: 'Work order closed - I attended',
              eventTime: now.toISOString(),
            },
          ],
        })

      cy.get('.modal-container').within(() => {
        cy.contains('Work order 10000621 successfully completed')

        cy.get('[data-testid="modal-close"]').click()
      })

      cy.get('.modal-container').should('not.exist')

      cy.get('.lbh-heading-h1').contains('Friday 11 June')
    })
  })

  context('when the job is varied', () => {
    beforeEach(() => {
      cy.clock(now)

      cy.intercept(
        {
          method: 'GET',
          path: '/api/operatives/hu0001/workorders',
        },
        {
          fixture: 'operatives/workOrders.json',
        }
      ).as('workOrderIndexRequest')

      cy.intercept('/api/workOrders/10000621', {
        fixture: 'workOrders/workOrder.json',
      }).as('workOrderRequest')

      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      ).as('propertyRequest')

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000621/tasks' },
        { fixture: 'workOrders/tasksAndSors.json' }
      ).as('tasksRequest')

      cy.intercept(
        { method: 'POST', path: '/api/jobStatusUpdate' },
        { body: '' }
      ).as('jobStatusUpdateRequest')

      cy.intercept(
        { method: 'POST', path: '/api/workOrderComplete' },
        { body: '' }
      ).as('workOrderCompleteRequest')

      cy.loginWithOperativeRole()
    })

    it('requires a variation reason and includes a jobStatusUpdate call', () => {
      cy.visit('/work-orders/10000621')

      cy.wait(['@workOrderRequest', '@propertyRequest', '@tasksRequest'])

      cy.get('form').within(() => {
        cy.contains('button', 'Confirm').click()

        cy.get('#variationReason-form-group').contains('Please enter a reason')

        cy.get('textarea').type('More work was needed')

        cy.contains('button', 'Confirm').click()
      })

      cy.get('@jobStatusUpdateRequest')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000621',
          },
          comments: 'More work was needed',
          typeCode: '80',
          moreSpecificSORCode: {
            rateScheduleItem: [
              {
                id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbh',
                customCode: 'DES5R013',
                customName: 'Inspect additional sec entrance',
                quantity: {
                  amount: [5],
                },
              },
              {
                id: 'bde7c53b-8947-414c-b88f-9c5e3d875cbg',
                customCode: 'DES5R005',
                customName: 'Normal call outs',
                quantity: {
                  amount: [4],
                },
              },
              {
                id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
                customCode: 'DES5R006',
                customName: 'Urgent call outs',
                quantity: {
                  amount: [2],
                },
              },
            ],
          },
        })

      cy.url().should('match', /work-orders\/10000621\/close$/)
    })
  })
})
