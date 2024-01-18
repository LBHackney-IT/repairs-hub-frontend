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

    cy.intercept(
      {
        method: 'POST',
        path: `/api/damp-and-mould/reports/${propertyReference}`,
      },
      {
        statusCode: 201,
        body: '',
      }
    ).as('dampAndMouldReportRequest')

    cy.loginWithOperativeRole()
  })

  context.only('during normal working hours', () => {
    beforeEach(() => {
      cy.clock(new Date(now).setHours(12, 0, 0))
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

      cy.get('#notes').type('I attended')

      cy.get('.govuk-button').contains('Next').click()

      cy.get('.lbh-radios input[data-testid="isDampOrMouldInProperty"]').check(
        'No'
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
              eventTime: new Date(now.setHours(12, 0, 0)).toISOString(),
              paymentType: 'Bonus',
            },
          ],
        })

      cy.get('.modal-container').within(() => {
        cy.contains(`Work order ${workOrderReference} successfully completed`)

        cy.get('[data-testid="modal-close"]').click()
      })

      cy.get('.modal-container').should('not.exist')

      cy.get('.lbh-heading-h2').contains('Friday 11 June')
    })

    it('doesnt create a damp or mould report when no damp or mould presence in property', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      // 1. Click confirm button - (navigate to close work order form)
      cy.contains('button', 'Confirm').click()

      // 2. Set job as completed
      cy.get('.lbh-radios input[data-testid="reason"]').check(
        'Work Order Completed'
      )

      // 3. Navigate to damp and mould part of form
      cy.get('.govuk-button').contains('Next').click()

      // 4. Select no damp or mould presence in property
      cy.get('.lbh-radios input[data-testid="isDampOrMouldInProperty"]').check(
        'No'
      )

      // 5. Assert subsequent radio fields and comments are hidden
      cy.get(
        '.lbh-radios input[data-testid="residentPreviouslyReported"]'
      ).should('not.be.visible')
      cy.get('.lbh-radios input[data-testid="resolvedAtTheTime"]').should(
        'not.be.visible'
      )
      cy.get('textarea[data-testid="comments"]').should('not.be.visible')

      // 6. Submit form
      cy.get('.govuk-button').contains('Close work order').click()

      cy.wait('@workOrderCompleteRequest')

      // 7. Assert damp and mould report request not made
      cy.get('@dampAndMouldReportRequest.all').then((interceptions) => {
        expect(interceptions).to.have.length(0)
      })

      // 8. Assert confirmation message appeared
      cy.get('.modal-container').within(() => {
        cy.contains(`Work order ${workOrderReference} successfully completed`)
      })
    })

    const testData = [
      {
        description: 'damp or mould presence confirmed',
        optionLabel: 'Yes',
        confirmed: true,
      },
      {
        description: 'damp or mould presence uncomfirmed',
        optionLabel: 'Not sure',
        confirmed: false,
      },
    ]

    testData.forEach(({ description, optionLabel, confirmed }) => {
      it(`create a damp or mould report when potential ${description} in property`, () => {
        cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

        cy.wait([
          '@workOrderRequest',
          '@propertyRequest',
          '@tasksRequest',
          '@locationAlerts',
          '@personAlerts',
        ])

        // 1. Click confirm button - (navigate to close work order form)
        cy.contains('button', 'Confirm').click()

        // 2. Set job as completed
        cy.get('.lbh-radios input[data-testid="reason"]').check(
          'Work Order Completed'
        )

        // 3. Navigate to damp and mould part of form
        cy.get('.govuk-button').contains('Next').click()

        // 4. Select potential presence in property
        cy.get(
          '.lbh-radios input[data-testid="isDampOrMouldInProperty"]'
        ).check(optionLabel)

        // 5. Select resident hasnt previously reported
        cy.get(
          '.lbh-radios input[data-testid="residentPreviouslyReported"]'
        ).check('No')

        // 6. Populate comments
        cy.get('textarea[data-testid="comments"]').type('Comments')

        // 7. Assert subsequent radio field is hidden
        cy.get('.lbh-radios input[data-testid="resolvedAtTheTime"]').should(
          'not.be.visible'
        )

        // 8. Submit form
        cy.get('.govuk-button').contains('Close work order').click()

        // 9. Assert damp and mould report request made
        cy.wait(['@workOrderCompleteRequest', '@dampAndMouldReportRequest'])

        cy.get('@dampAndMouldReportRequest')
          .its('request.body')
          .should('deep.equal', {
            dampAndMouldPresenceConfirmed: confirmed,
            previouslyReported: false,
            comments: 'Comments',
          })

        // 10. Assert confirmation message appeared
        cy.get('.modal-container').within(() => {
          cy.contains(`Work order ${workOrderReference} successfully completed`)
        })
      })
    })

    it(`create a damp or mould report when resident has previously reported the property`, () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      // 1. Click confirm button - (navigate to close work order form)
      cy.contains('button', 'Confirm').click()

      // 2. Set job as completed
      cy.get('.lbh-radios input[data-testid="reason"]').check(
        'Work Order Completed'
      )

      // 3. Navigate to damp and mould part of form
      cy.get('.govuk-button').contains('Next').click()

      // 4. Select confirmed damp or mould presence in property
      cy.get('.lbh-radios input[data-testid="isDampOrMouldInProperty"]').check(
        'Yes'
      )

      // 5. Select resident has previously reported
      cy.get(
        '.lbh-radios input[data-testid="residentPreviouslyReported"]'
      ).check('Yes')

      // 6. Select previous report not resolved at the time
      cy.get('.lbh-radios input[data-testid="resolvedAtTheTime"]').check('No')

      // 7. Populate comments
      cy.get('textarea[data-testid="comments"]').type('Comments')

      // 8. Submit form
      cy.get('.govuk-button').contains('Close work order').click()

      // 9. Assert damp and mould report request made
      cy.wait(['@workOrderCompleteRequest', '@dampAndMouldReportRequest'])

      cy.get('@dampAndMouldReportRequest')
        .its('request.body')
        .should('deep.equal', {
          dampAndMouldPresenceConfirmed: true,
          previouslyReported: true,
          previousReportResolved: false,
          comments: 'Comments',
        })

      // 10. Assert confirmation message appeared
      cy.get('.modal-container').within(() => {
        cy.contains(`Work order ${workOrderReference} successfully completed`)
      })
    })

    it(`create a damp or mould report when previously reported problem was resolved at the time`, () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      // 1. Click confirm button - (navigate to close work order form)
      cy.contains('button', 'Confirm').click()

      // 2. Set job as completed
      cy.get('.lbh-radios input[data-testid="reason"]').check(
        'Work Order Completed'
      )

      // 3. Navigate to damp and mould part of form
      cy.get('.govuk-button').contains('Next').click()

      // 4. Select confirmed damp or mould presence in property
      cy.get('.lbh-radios input[data-testid="isDampOrMouldInProperty"]').check(
        'Yes'
      )

      // 5. Select resident has previously reported
      cy.get(
        '.lbh-radios input[data-testid="residentPreviouslyReported"]'
      ).check('Yes')

      // 6. Select previous report not resolved at the time
      cy.get('.lbh-radios input[data-testid="resolvedAtTheTime"]').check('Yes')

      // 7. Populate comments
      cy.get('textarea[data-testid="comments"]').type('Comments')

      // 8. Submit form
      cy.get('.govuk-button').contains('Close work order').click()

      // 9. Assert damp and mould report request made
      cy.wait(['@workOrderCompleteRequest', '@dampAndMouldReportRequest'])

      cy.get('@dampAndMouldReportRequest')
        .its('request.body')
        .should('deep.equal', {
          dampAndMouldPresenceConfirmed: true,
          previouslyReported: true,
          previousReportResolved: true,
          comments: 'Comments',
        })

      // 10. Assert confirmation message appeared
      cy.get('.modal-container').within(() => {
        cy.contains(`Work order ${workOrderReference} successfully completed`)
      })
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

        cy.get('.govuk-button').contains('Next').click()

        cy.get(
          '.lbh-radios input[data-testid="isDampOrMouldInProperty"]'
        ).check('No')

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
          cy.contains(`Work order ${workOrderReference} successfully completed`)

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

        cy.get('.govuk-button').contains('Next').click()

        cy.get(
          '.lbh-radios input[data-testid="isDampOrMouldInProperty"]'
        ).check('No')

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
          cy.contains(`Work order ${workOrderReference} successfully completed`)

          cy.get('[data-testid="modal-close"]').click()
        })

        cy.get('.modal-container').should('not.exist')

        cy.get('.lbh-heading-h2').contains('Friday 11 June')
      })
    })
  })
})
