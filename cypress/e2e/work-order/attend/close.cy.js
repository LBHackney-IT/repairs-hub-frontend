/// <reference types="cypress" />
import 'cypress-audit/commands'
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Closing my own work order', () => {
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
          followOnFunctionalityEnabled: false,
          fetchAppointmentsFromDrs: false,
        },
      }
    ).as('feature-toggle')

    cy.intercept(`/api/workOrders/${workOrderReference}/new`, {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.intercept(
      {
        method: 'GET',
        path: `/api/workOrders/appointments/${workOrderReference}`,
      },
      {
        body: {
          reference: workOrderReference,
          appointment: null,
          operatives: [],
          externalAppointmentManagementUrl: null,
          plannerComments: null,
        },
      }
    )

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
      Cypress.env('IsCurrentOperativeOvertime', false)
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
      cy.contains('Request failed with status code 500')
    })

    it('shows error when upload to S3 fails (after four attempts)', () => {
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

      const uploadToS3RequestResponses = [
        {
          statusCode: 500,
        },
        {
          statusCode: 500,
        },
        {
          statusCode: 500,
        },
        {
          statusCode: 500,
        },
      ]

      cy.intercept(
        { method: 'PUT', path: '**/placeholder-upload-url' },
        (request) => {
          request.reply(uploadToS3RequestResponses.shift())
        }
      ).as('uploadToS3Request')

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

      // handle multiple intercepts

      cy.wait(['@getLinksRequest'])

      cy.wait(
        [
          '@uploadToS3Request',
          '@uploadToS3Request',
          '@uploadToS3Request',
          '@uploadToS3Request',
        ],
        { timeout: 10000 }
      )
      cy.get('@uploadToS3Request.all').should('have.length', 4)

      // should contain error message
      cy.contains('Some photos failed to upload. Please try again')
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
        { method: 'PUT', path: '**/placeholder-upload-url' },
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

      cy.wait([
        '@getLinksRequest',
        '@uploadToS3Request',
        '@completeUploadRequest',
      ])

      cy.get('.modal-container').within(() => {
        cy.contains(
          `Work order ${workOrderReference} successfully closed with no access`
        )

        cy.get('[data-testid="modal-close"]').click()
      })
    })

    it('uploads files when closing work order when request fails', () => {
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

      const uploadToS3RequestResponses = [
        {
          statusCode: 500,
        },
        {
          statusCode: 500,
        },
        {
          statusCode: 500,
        },
        {
          statusCode: 200,
        },
      ]

      cy.intercept(
        { method: 'PUT', path: '**/placeholder-upload-url' },
        (request) => {
          request.reply(uploadToS3RequestResponses.shift())
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

      cy.wait(['@getLinksRequest'])

      // upload request fails twice, last one succeeds
      cy.wait(
        ['@uploadToS3Request', '@uploadToS3Request', '@uploadToS3Request'],
        { timeout: 10000 }
      )

      cy.wait(['@completeUploadRequest'])

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

      cy.wait('@workOrderCompleteRequest')

      cy.get('@workOrderCompleteRequest')
        .its('request.body')
        .should((body) => {
          expect(body).to.deep.equal({
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
                eventTime: body.jobStatusUpdates[0].eventTime, // placeholder
                paymentType: 'Bonus',
                noteGeneratedOnFrontend: false,
              },
            ],
          })

          const eventTime = new Date(
            body.jobStatusUpdates[0].eventTime
          ).getTime()
          const nowTime = new Date().getTime()

          expect(eventTime).to.be.closeTo(nowTime, 1000) // within 1 second
        })

      cy.contains(`Work order ${workOrderReference} successfully closed`)

      cy.get('.lbh-heading-h3').contains(
        new Date(new Date()).toLocaleDateString('en-GB', {
          month: 'long',
          weekday: 'long',
          day: 'numeric',
        })
      )
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

      cy.get('#notes').type('I attended')

      cy.get('.govuk-button').contains('Close work order').click()

      cy.wait('@workOrderCompleteRequest')

      cy.get('@workOrderCompleteRequest')
        .its('request.body')
        .should((body) => {
          expect(body).to.deep.equal({
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
                eventTime: body.jobStatusUpdates[0].eventTime, // placeholder
                paymentType: 'Bonus',
                noteGeneratedOnFrontend: false,
              },
            ],
          })

          const eventTime = new Date(
            body.jobStatusUpdates[0].eventTime
          ).getTime()
          const nowTime = new Date().getTime()

          expect(eventTime).to.be.closeTo(nowTime, 1000) // within 1 second
        })

      cy.contains(`Work order ${workOrderReference} successfully closed`)

      cy.get('.lbh-heading-h3').contains(
        new Date(new Date()).toLocaleDateString('en-GB', {
          month: 'long',
          weekday: 'long',
          day: 'numeric',
        })
      )
    })
  })

  context('when outside working hours (overtime could apply)', () => {
    beforeEach(() => {
      Cypress.env('IsCurrentOperativeOvertime', true)
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

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should((body) => {
            expect(body).to.deep.equal({
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
                  eventTime: body.jobStatusUpdates[0].eventTime, // placeholder
                  paymentType: 'Overtime',
                  noteGeneratedOnFrontend: false,
                },
              ],
            })

            const eventTime = new Date(
              body.jobStatusUpdates[0].eventTime
            ).getTime()
            const nowTime = new Date().getTime()

            expect(eventTime).to.be.closeTo(nowTime, 1000) // within 1 second
          })

        cy.contains(`Work order ${workOrderReference} successfully closed`)

        cy.get('.lbh-heading-h3').contains(
          new Date(new Date()).toLocaleDateString('en-GB', {
            month: 'long',
            weekday: 'long',
            day: 'numeric',
          })
        )
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

        cy.get('.govuk-button').contains('Close work order').click()

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should((body) => {
            expect(body).to.deep.equal({
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
                  eventTime: body.jobStatusUpdates[0].eventTime, // placeholder
                  paymentType: 'Overtime',
                  noteGeneratedOnFrontend: false,
                },
              ],
            })

            const eventTime = new Date(
              body.jobStatusUpdates[0].eventTime
            ).getTime()
            const nowTime = new Date().getTime()

            expect(eventTime).to.be.closeTo(nowTime, 1000) // within 1 second
          })

        cy.contains(`Work order ${workOrderReference} successfully closed`)

        // close

        cy.get('.lbh-heading-h3').contains(
          new Date(new Date()).toLocaleDateString('en-GB', {
            month: 'long',
            weekday: 'long',
            day: 'numeric',
          })
        )
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

        cy.get('.govuk-button').contains('Close work order').click()

        cy.wait('@workOrderCompleteRequest')

        cy.get('@workOrderCompleteRequest')
          .its('request.body')
          .should((body) => {
            expect(body).to.deep.equal({
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
                    'Work order closed - I attended - Bonus calculation',
                  eventTime: body.jobStatusUpdates[0].eventTime, // placeholder
                  paymentType: 'Bonus',
                  noteGeneratedOnFrontend: false,
                },
              ],
            })

            const eventTime = new Date(
              body.jobStatusUpdates[0].eventTime
            ).getTime()
            const nowTime = new Date().getTime()

            expect(eventTime).to.be.closeTo(nowTime, 1000) // within 1 second
          })

        cy.contains(`Work order ${workOrderReference} successfully closed`)

        cy.get('.lbh-heading-h3').contains(
          new Date(new Date()).toLocaleDateString('en-GB', {
            month: 'long',
            weekday: 'long',
            day: 'numeric',
          })
        )
      })
    })
  })
})
