/// <reference types="cypress" />
import 'cypress-audit/commands'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Closing my own work order - When follow-ons are enabled', () => {
  const now = new Date('Friday June 11 2021 13:49:15Z')
  const workOrderReference = '10000621'
  const propertyReference = '00012345'

  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/simple-feature-toggle',
      },
      {
        body: {
          followOnFunctionalityEnabled: true,
        },
      }
    ).as('feature-toggle')

    cy.intercept(`/api/workOrders/${workOrderReference}`, {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: `/api/properties/${propertyReference}` },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/images/${workOrderReference}` },
      { body: [] }
    ).as('photosRequest')

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
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.govuk-button').contains('Close work order').click()

      cy.contains('Please select a reason for closing the work order')
    })

    it('shows validation errors when uploading files', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('button', 'Confirm').click()

      // 1. invalid file type
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'file.txt',
        mimeType: 'text/plain',
        lastModified: Date.now(),
      })

      cy.get('.govuk-button').contains('Close work order').click()

      // should contain error message
      cy.contains(
        `Unsupported file type "text/plain". Allowed types: PNG & JPG`
      )
      cy.get('input[type="file"]').then((x) =>
        x.hasClass('govuk-form-group--error')
      )

      // 2. too many files
      cy.get('input[type="file"]').selectFile(
        Array(11).fill({
          contents: Cypress.Buffer.from('file contents'),
          fileName: 'file.png',
          mimeType: 'image/png',
          lastModified: Date.now(),
        })
      )

      cy.get('.govuk-button').contains('Close work order').click()

      // should contain error message
      cy.contains(`You cannot attach more than 10 photos`)

      // 3. removing additional file clears error message
      cy.get('button').contains('Remove').last().click()

      cy.get('.govuk-button').contains('Close work order').click()

      cy.contains(`You cannot attach more than 10 photos`).should('not.exist')
      cy.get('input[type="file"]').should(
        'not.have.class',
        'govuk-form-group--error'
      )
    })

    it('shows error when network request fails uploading photo', () => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/images/upload*' },
        { statusCode: 500 }
      ).as('getLinksRequest')

      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('button', 'Confirm').click()
      cy.get('.lbh-radios input[data-testid="reason"]').check('No Access')

      // 1. invalid file type
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'file.png',
        mimeType: 'image/png',
        lastModified: Date.now(),
      })

      cy.get('.govuk-button').contains('Close work order').click()

      // should contain error message
      cy.contains(
        'Oops an error occurred with error status: 500 with message: undefined'
      )
    })

    it('shows error when no photos selected', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('button', 'Confirm').click()
      cy.get('.lbh-radios input[data-testid="reason"]').check('No Access')

      cy.get('.govuk-button').contains('Close work order').click()

      // should contain error message
      cy.contains('No photos were selected')

      // adding photo clears error
      cy.get('input[type="file"]').selectFile(
        Array(1).fill({
          contents: Cypress.Buffer.from('file contents'),
          fileName: 'file.png',
          mimeType: 'image/png',
          lastModified: Date.now(),
        })
      )

      cy.contains('No photos were selected').should('not.exist')

      // submitting is blocked
      cy.get('.photoUploadPreview-removeButton').click()
      cy.contains('No photos were selected')

      cy.get('.govuk-button').contains('Close work order').click()

      // error still present
      cy.contains('No photos were selected')

      // tick checkbox to submit
      cy.get('[data-testid="closeWorkOrderWithoutPhotos"]').check()

      cy.get('.govuk-button').contains('Close work order').click()

      // check on confirmation page
      cy.url().should(
        'include',
        `/operatives/1/work-orders/${workOrderReference}/confirmation`
      )

      cy.contains(`Work order ${workOrderReference} successfully closed`)

      // close
      cy.contains('button', 'Close').click()
    })

    it('uploads files when closing work order', () => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/images/upload*' },
        {
          statusCode: 200,
          body: {
            links: [
              {
                key: '10008056/575a54a6-6ca0-4ceb-a1a6-c831a8368bb9',
                presignedUrl: 'https://test.com/placeholder-upload-url',
              },
            ],
          },
        }
      ).as('getLinksRequest')

      cy.intercept(
        { method: 'PUT', path: 'https://test.com/placeholder-upload-url' },
        {
          statusCode: 200,
        }
      ).as('uploadToS3Request')

      cy.intercept(
        { method: 'POST', path: '/api/workOrders/images/completeUpload' },
        {
          statusCode: 200,
          body: {
            filesUploaded: ['10008056/575a54a6-6ca0-4ceb-a1a6-c831a8368bb9'],
          },
        }
      ).as('completeUploadRequest')
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('button', 'Confirm').click()
      cy.get('.lbh-radios input[data-testid="reason"]').check('No Access')

      // 1. invalid file type
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'file.png',
        mimeType: 'image/png',
        lastModified: Date.now(),
      })

      cy.get('.govuk-button').contains('Close work order').click()

      cy.waitFor('@getLinksRequest')
      cy.waitFor('@uploadToS3Request')
      cy.waitFor('@completeUploadRequest')

      cy.get('.modal-container').within(() => {
        cy.contains(
          `Work order ${workOrderReference} successfully closed with no access`
        )

        cy.get('[data-testid="modal-close"]').click()
      })
    })

    it('payment type selection is not possible, closing makes a POST request for no access with bonus payment type, confirms success, and returns me to the index', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.lbh-radios input[data-testid="reason"]').check('No Access')

      cy.get('#notes').type('I attended')

      cy.get('.govuk-button').contains('Close work order').click()
      cy.get('[data-testid="closeWorkOrderWithoutPhotos"]').check()
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

              noteGeneratedOnFrontend: false,
            },
          ],
        })

      // check on confirmation page
      cy.url().should(
        'include',
        `/operatives/1/work-orders/${workOrderReference}/confirmation`
      )

      cy.contains(`Work order ${workOrderReference} successfully closed`)

      // close
      cy.contains('button', 'Close').click()

      cy.get('.lbh-heading-h2').contains('Friday 11 June')
    })

    it('payment type selection is not possible, closing makes a POST request for completion with bonus payment type, confirms success, and returns me to the index', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('Payment type').should('not.exist')
      cy.get('[data-testid="paymentType"]').should('not.exist')

      cy.contains('button', 'Confirm').click()

      cy.get('.lbh-radios input[data-testid="reason"]').check(
        'Work Order Completed'
      )
      cy.contains('label', 'No further work required').click()

      cy.get('#notes').type('I attended')

      cy.get('.govuk-button').contains('Close work order').click()
      cy.get('[data-testid="closeWorkOrderWithoutPhotos"]').check()
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
              comments: 'I attended',
              eventTime: new Date(now.setHours(12, 0, 0)).toISOString(),
              paymentType: 'Bonus',
              noteGeneratedOnFrontend: true,
            },
          ],
        })

      // check on confirmation page
      cy.url().should(
        'include',
        `/operatives/1/work-orders/${workOrderReference}/confirmation`
      )

      cy.contains(`Work order ${workOrderReference} successfully closed`)

      // close
      cy.contains('button', 'Close').click()

      cy.get('.lbh-heading-h2').contains('Friday 11 June')
    })

    it('shows validation message when further works required not specified', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('button', 'Confirm').click()

      cy.contains('Reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'Visit completed').click()
        })

      cy.get('[type="submit"]').contains('Close work order').click()

      cy.contains('Please confirm if further work is required')
    })

    it('shows validation when user enters follow-on details', () => {
      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('button', 'Confirm').click()

      cy.contains('Reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'Visit completed').click()
          cy.contains('label', 'Further work required').click()
        })

      // assert error messages arent visible yet
      cy.contains('Please select the type of work').should('not.exist')
      cy.contains('Please describe the work completed').should('not.exist')

      // add follow on details
      cy.contains('button', 'Add details').click()
      cy.get('[data-testid="closeWorkOrderWithoutPhotos"]').check()
      cy.contains('button', 'Add details').click()

      // close work order
      cy.get('[type="submit"]').contains('Close work order').click()

      // assert error messages visible
      cy.contains('Please select the type of work')
      cy.contains('Please describe the work completed')

      // select an option - error should disappear
      cy.get('input[data-testid="isSameTrade"]').check()
      cy.contains('Please select the type of work').should('not.exist')

      // select different trade(s) - error should appear
      cy.get('input[data-testid="isDifferentTrades"]').check()
      cy.get('[type="submit"]').contains('Close work order').click()
      cy.contains('Please select at least one trade')

      // select a trade - error should disappear
      cy.get('input[data-testid="followon-trades-plumbing"]').check()
      cy.get('[type="submit"]').contains('Close work order').click()
      cy.contains('Please select at least one trade').should('not.exist')

      // add description of work - error should disappear
      cy.get('textarea[data-testid="followOnTypeDescription"]').type(
        'Blah blah blah'
      )
      cy.contains('Please describe the work completed').should('not.exist')

      // when one of the material options is selected, the description must not be empty
      cy.get('input[data-testid="stockItemsRequired"]').check()
      cy.get('[type="submit"]').contains('Close work order').click()
      cy.contains('Please describe the materials required')

      // Adding a description - error should disappear
      cy.get('textarea[data-testid="materialNotes"]').type('Blah blah blah')
      cy.contains('Please describe the materials required').should('not.exist')

      // additional notes
      cy.get('textarea[data-testid="additionalNotes"]').type('Additional notes')

      // close work order
      cy.get('[type="submit"]').contains('Close work order').click()

      // check for confirmation message
      cy.contains('Work order 10000621 successfully closed')
    })

    it('submits a request when user enters follow-on details', () => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000040
        workOrder.canAssignOperative = false

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040' },
          { body: workOrder }
        ).as('workOrder')
      })

      cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

      cy.wait([
        '@workOrderRequest',
        '@propertyRequest',
        '@tasksRequest',
        '@photosRequest',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.contains('button', 'Confirm').click()

      cy.contains('Reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'Visit completed').click()
          cy.contains('label', 'Further work required').click()
        })

      // add follow-on details
      cy.contains('button', 'Add details').click()
      cy.get('[data-testid="closeWorkOrderWithoutPhotos"]').check()
      cy.contains('button', 'Add details').click()

      cy.get('.govuk-button').contains('Close work order').click()

      // populate follow-on fields

      cy.get('input[data-testid="isSameTrade"]').check()
      cy.get('input[data-testid="isDifferentTrades"]').check()
      cy.get('input[data-testid="followon-trades-plumbing"]').check()
      cy.get('textarea[data-testid="followOnTypeDescription"]').type(
        'follow on description'
      )
      cy.get('input[data-testid="stockItemsRequired"]').check()
      cy.get('textarea[data-testid="materialNotes"]').type('material notes')
      cy.get('textarea[data-testid="additionalNotes"]').type(
        'Additional notes desc'
      )

      // close work order
      cy.get('[type="submit"]').contains('Close work order').click()

      cy.wait('@workOrderCompleteRequest')

      // check for confirmation message
      cy.contains('Work order 10000621 successfully closed')
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
          '@photosRequest',
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

        cy.get('[data-testid="closeWorkOrderWithoutPhotos"]').check()
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
                noteGeneratedOnFrontend: false,
              },
            ],
          })

        // check on confirmation page
        cy.url().should(
          'include',
          `/operatives/1/work-orders/${workOrderReference}/confirmation`
        )

        cy.contains(`Work order ${workOrderReference} successfully closed`)

        // close
        cy.contains('button', 'Close').click()

        cy.get('.lbh-heading-h2').contains('Friday 11 June')
      })

      it('makes a POST request for completion with overtime payment type, confirms success, and returns me to the index', () => {
        cy.visit(`/operatives/1/work-orders/${workOrderReference}`)

        cy.wait([
          '@workOrderRequest',
          '@propertyRequest',
          '@tasksRequest',
          '@photosRequest',
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
        cy.contains('label', 'No further work required').click()

        cy.get('.govuk-button').contains('Close work order').click()
        cy.get('[data-testid="closeWorkOrderWithoutPhotos"]').check()
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
                comments: 'I attended',
                eventTime: new Date(now.setHours(16, 0, 1)).toISOString(),
                paymentType: 'Overtime',
                noteGeneratedOnFrontend: true,
              },
            ],
          })

        // check on confirmation page
        cy.url().should(
          'include',
          `/operatives/1/work-orders/${workOrderReference}/confirmation`
        )

        cy.contains(`Work order ${workOrderReference} successfully closed`)

        // close
        cy.contains('button', 'Close').click()

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
          '@photosRequest',
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
        cy.contains('label', 'No further work required').click()

        cy.get('.govuk-button').contains('Close work order').click()

        cy.get('[data-testid="closeWorkOrderWithoutPhotos"]').check()
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
                comments: 'I attended',
                eventTime: new Date(now.setHours(16, 0, 1)).toISOString(),
                paymentType: 'Bonus',
                noteGeneratedOnFrontend: true,
              },
            ],
          })

        // check on confirmation page
        cy.url().should(
          'include',
          `/operatives/1/work-orders/${workOrderReference}/confirmation`
        )

        cy.contains(`Work order ${workOrderReference} successfully closed`)

        // close
        cy.contains('button', 'Close').click()

        cy.get('.lbh-heading-h2').contains('Friday 11 June')
      })
    })
  })
})
