/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Closing my own work order', () => {
  const now = new Date('Friday June 11 2021 13:49:15Z')
  const workOrderReference = '10000621'
  const propertyReference = '00012345'

  beforeEach(() => {
    cy.intercept(`/api/workOrders/${workOrderReference}`, {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: `/api/properties/${propertyReference}` },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      {
        method: 'GET',
        path: `/api/properties/${propertyReference}/location-alerts`,
      },
      {
        body: {
          alerts: [
            {
              type: 'type1',
              comments: 'Location Alert 1',
            },
            {
              type: 'type2',
              comments: 'Location Alert 2',
            },
          ],
        },
      }
    ).as('locationAlerts')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/properties/4552c539-2e00-8533-078d-9cc59d9115da/person-alerts',
      },
      {
        body: {
          alerts: [
            {
              type: 'type3',
              comments: 'Person Alert 1',
            },
            {
              type: 'type4',
              comments: 'Person Alert 2',
            },
          ],
        },
      }
    ).as('personAlerts')

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/${workOrderReference}/tasks` },
      { fixture: 'workOrders/tasksAndSorsUnvaried.json' }
    ).as('tasksRequest')

    cy.intercept(
      { method: 'POST', path: '/api/workOrderComplete' },
      { body: '' }
    ).as('workOrderCompleteRequest')

    cy.intercept(
      { method: 'GET', path: '/api/operatives/hu0001/workorders' },
      { body: [] }
    )

    cy.loginWithOperativeRole()
  })

  context('during normal working hours', () => {
    beforeEach(() => {
      cy.clock(new Date(now).setHours(12, 0, 0))
    })

    it('shows a validation error when no reason is selected', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.govuk-button').contains('Close work order').click()

      cy.contains('Please select a reason for closing the work order')
    })

    it('shows a validation error when follow on status isnt selected', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.lbh-radios input[data-testid="reason"]').check(
        'Work Order Completed'
      )

      cy.get('.govuk-button').contains('Close work order').click()

      cy.contains('Please confirm if further work is required')
    })

    it('closes a job when no further work is required', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.lbh-radios input[data-testid="reason"]').check(
        'Work Order Completed'
      )

      cy.get('.lbh-radios input[data-testid="followOnStatus"]').check(
        'noFurtherWorkRequired'
      )

      cy.get('#notes').type('I attended')

      cy.get('.govuk-button').contains('Close work order').click()

      cy.wait('@workOrderCompleteRequest')

      cy.get('@workOrderCompleteRequest')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: workOrderReference,
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '0',
              otherType: 'completed',
              comments: 'Work order closed - I attended - Bonus calculation',
              eventTime: new Date(now.setHours(12, 0, 0)).toISOString(),
              paymentType: 'Bonus',
            },
          ],
        })

      cy.get('.modal-container').within(() => {
        cy.contains(`Work order ${workOrderReference} successfully closed`)

        cy.get('[data-testid="modal-close"]').click()
      })

      cy.get('.modal-container').should('not.exist')

      cy.get('.lbh-heading-h2').contains('Friday 11 June')
    })

    it('allows the user to enter follow-on details', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.lbh-radios input[data-testid="reason"]').check(
        'Work Order Completed'
      )

      cy.get('.lbh-radios input[data-testid="followOnStatus"]').check(
        'furtherWorkRequired'
      )

      cy.get('#notes').type('I attended')

      // button text changes to 'Add details'
      cy.get('.govuk-button').contains('Add details').click()

      // assert error messages arent visible yet
      cy.contains('Please select the type of work').should('not.exist')
      cy.contains('Please describe the work completed').should('not.exist')

      // close work order
      cy.get('.govuk-button').contains('Close work order').click()

      // assert error messages visible
      cy.contains('Please select the type of work')
      cy.contains('Please describe the work completed')

      // select an option - error should disappear
      cy.get('input[data-testid="isSameTrade"]').check()
      cy.contains('Please select the type of work').should('not.exist')

      // select different trade(s) - error should appear
      cy.get('input[data-testid="isDifferentTrades"]').check()
      cy.get('.govuk-button').contains('Close work order').click()
      cy.contains('Please select at least one trade')

      // select a trade - error should disappear
      cy.get('input[data-testid="followon-trades-plumbing"]').check()
      cy.get('.govuk-button').contains('Close work order').click()
      cy.contains('Please select at least one trade').should('not.exist')

      // add description of work - error should disappear
      cy.get('textarea[data-testid="followOnTypeDescription"]').type(
        'Blah blah blah'
      )
      cy.contains('Please describe the work completed').should('not.exist')

      // when one of the material options is selected, the description must not be empty
      cy.get('input[data-testid="stockItemsRequired"]').check()
      cy.get('.govuk-button').contains('Close work order').click()
      cy.contains('Please describe the materials required')

      // Adding a description - error should disappear
      cy.get('textarea[data-testid="materialNotes"]').type('Blah blah blah')
      cy.contains('Please describe the materials required').should('not.exist')

      // additional notes
      cy.get('textarea[data-testid="additionalNotes"]').type('Additional notes')

      // close work order
      cy.get('.govuk-button').contains('Close work order').click()

      cy.wait('@workOrderCompleteRequest')

      cy.get('@workOrderCompleteRequest')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: workOrderReference,
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '0',
              otherType: 'completed',
              comments: 'Work order closed - I attended - Bonus calculation',
              eventTime: new Date(now.setHours(12, 0, 0)).toISOString(),
              paymentType: 'Bonus',
            },
          ],
          followOnRequest: {
            isSameTrade: true,
            isDifferentTrades: true,
            isMultipleOperatives: false,
            requiredFollowOnTrades: ['followon-trades-plumbing'],
            followOnTypeDescription: 'Blah blah blah',
            stockItemsRequired: true,
            nonStockItemsRequired: false,
            materialNotes: 'Blah blah blah',
            additionalNotes: 'Additional notes',
          },
        })

      cy.get('.modal-container').within(() => {
        cy.contains(`Work order ${workOrderReference} successfully closed`)

        cy.get('[data-testid="modal-close"]').click()
      })

      cy.get('.modal-container').should('not.exist')

      cy.get('.lbh-heading-h2').contains('Friday 11 June')
    })

    it('payment type selection is not possible, closing makes a POST request for no access with bonus payment type, confirms success, and returns me to the index', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.lbh-radios input[data-testid="reason"]').check('No Access')

      cy.get('#notes').type('I attended')

      cy.get('.govuk-button').contains('Close work order').click()

      cy.wait('@workOrderCompleteRequest')

      cy.get('@workOrderCompleteRequest')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: workOrderReference,
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '70',
              otherType: 'completed',
              comments: 'Work order closed - I attended - Bonus calculation',
              eventTime: new Date(now.setHours(12, 0, 0)).toISOString(),
              paymentType: 'Bonus',
            },
          ],
        })

      cy.get('.modal-container').within(() => {
        cy.contains(
          `Work order ${workOrderReference} successfully closed with no access`
        )

        cy.get('[data-testid="modal-close"]').click()
      })

      cy.get('.modal-container').should('not.exist')

      cy.get('.lbh-heading-h2').contains('Friday 11 June')
    })

    it('payment type selection is not possible, closing makes a POST request for completion with bonus payment type, confirms success, and returns me to the index', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.lbh-radios input[data-testid="reason"]').check(
        'Work Order Completed'
      )

      cy.get('.lbh-radios input[data-testid="followOnStatus"]').check(
        'noFurtherWorkRequired'
      )

      cy.get('#notes').type('I attended')

      cy.get('.govuk-button').contains('Close work order').click()

      cy.wait('@workOrderCompleteRequest')

      cy.get('@workOrderCompleteRequest')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: workOrderReference,
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '0',
              otherType: 'completed',
              comments: 'Work order closed - I attended - Bonus calculation',
              eventTime: new Date(now.setHours(12, 0, 0)).toISOString(),
              paymentType: 'Bonus',
            },
          ],
        })

      cy.get('.modal-container').within(() => {
        cy.contains(`Work order ${workOrderReference} successfully closed`)

        cy.get('[data-testid="modal-close"]').click()
      })

      cy.get('.modal-container').should('not.exist')

      cy.get('.lbh-heading-h2').contains('Friday 11 June')
    })
  })

  context('when outside working hours (overtime could apply)', () => {
    beforeEach(() => {
      cy.clock(new Date(now).setHours(16, 0, 1))
    })

    context('and the overtime payment type is chosen', () => {
      it('makes a POST request for no access with overtime payment type, confirms success, and returns me to the index', () => {
        cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

        cy.wait([
          '@workOrderRequest',
          '@propertyRequest',
          '@tasksRequest',
          '@locationAlerts',
          '@personAlerts',
        ])

        cy.contains('Payment type')
          .parent()
          .within(() => {
            cy.contains('label', 'Overtime').click()
          })

        cy.contains('button', 'Confirm').click()

        cy.get('.govuk-button').contains('Close work order').click()

        cy.get('#notes').type('I attended')

        cy.get('.govuk-form-group--error').contains(
          'Please select a reason for closing the work order'
        )

        cy.get('.lbh-radios input[data-testid="reason"]').check('No Access') // Checking by value, not text

        cy.get('.govuk-button').contains('Close work order').click()

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should('deep.equal', {
            workOrderReference: {
              id: workOrderReference,
              description: '',
              allocatedBy: '',
            },
            jobStatusUpdates: [
              {
                typeCode: '70',
                otherType: 'completed',
                comments:
                  'Work order closed - I attended - Overtime work order (SMVs not included in Bonus)',
                eventTime: new Date(now.setHours(16, 0, 1)).toISOString(),
                paymentType: 'Overtime',
              },
            ],
          })

        cy.get('.modal-container').within(() => {
          cy.contains(
            `Work order ${workOrderReference} successfully closed with no access`
          )

          cy.get('[data-testid="modal-close"]').click()
        })

        cy.get('.modal-container').should('not.exist')

        cy.get('.lbh-heading-h2').contains('Friday 11 June')
      })

      it('makes a POST request for completion with overtime payment type, confirms success, and returns me to the index', () => {
        cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

        cy.wait([
          '@workOrderRequest',
          '@propertyRequest',
          '@tasksRequest',
          '@locationAlerts',
          '@personAlerts',
        ])

        cy.contains('Payment type')
          .parent()
          .within(() => {
            cy.contains('label', 'Overtime').click()
          })

        cy.contains('button', 'Confirm').click()

        cy.get('.govuk-button').contains('Close work order').click()

        cy.get('#notes').type('I attended')

        cy.get('.govuk-form-group--error').contains(
          'Please select a reason for closing the work order'
        )

        cy.get('.lbh-radios input[data-testid="reason"]').check(
          'Work Order Completed'
        ) // Checking by value, not text

        cy.get('.lbh-radios input[data-testid="followOnStatus"]').check(
          'noFurtherWorkRequired'
        )

        cy.get('.govuk-button').contains('Close work order').click()

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should('deep.equal', {
            workOrderReference: {
              id: workOrderReference,
              description: '',
              allocatedBy: '',
            },
            jobStatusUpdates: [
              {
                typeCode: '0',
                otherType: 'completed',
                comments:
                  'Work order closed - I attended - Overtime work order (SMVs not included in Bonus)',
                eventTime: new Date(now.setHours(16, 0, 1)).toISOString(),
                paymentType: 'Overtime',
              },
            ],
          })

        cy.get('.modal-container').within(() => {
          cy.contains(`Work order ${workOrderReference} successfully closed`)

          cy.get('[data-testid="modal-close"]').click()
        })

        cy.get('.modal-container').should('not.exist')

        cy.get('.lbh-heading-h2').contains('Friday 11 June')
      })
    })

    context('when no particular payment type is chosen', () => {
      it('makes a POST request for completion with bonus payment type, confirm success, and returns me to the index', () => {
        cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

        cy.wait([
          '@workOrderRequest',
          '@propertyRequest',
          '@tasksRequest',
          '@locationAlerts',
          '@personAlerts',
        ])

        cy.contains('Payment type')
          .parent()
          .within(() => {
            cy.get('[value="Bonus"]').should('be.checked')
          })

        cy.contains('button', 'Confirm').click()

        cy.get('.govuk-button').contains('Close work order').click()

        cy.get('#notes').type('I attended')

        cy.get('.govuk-form-group--error').contains(
          'Please select a reason for closing the work order'
        )

        cy.get('.lbh-radios input[data-testid="reason"]').check(
          'Work Order Completed'
        ) // Checking by value, not text

        cy.get('.lbh-radios input[data-testid="followOnStatus"]').check(
          'noFurtherWorkRequired'
        )

        cy.get('.govuk-button').contains('Close work order').click()

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should('deep.equal', {
            workOrderReference: {
              id: workOrderReference,
              description: '',
              allocatedBy: '',
            },
            jobStatusUpdates: [
              {
                typeCode: '0',
                otherType: 'completed',
                comments: 'Work order closed - I attended - Bonus calculation',
                eventTime: new Date(now.setHours(16, 0, 1)).toISOString(),
                paymentType: 'Bonus',
              },
            ],
          })

        cy.get('.modal-container').within(() => {
          cy.contains(`Work order ${workOrderReference} successfully cl.osed`)

          cy.get('[data-testid="modal-close"]').click()
        })

        cy.get('.modal-container').should('not.exist')

        cy.get('.lbh-heading-h2').contains('Friday 11 June')
      })
    })
  })
})
