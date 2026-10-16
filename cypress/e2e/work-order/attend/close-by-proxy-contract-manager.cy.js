/// <reference types="cypress" />

describe('Closing a work order on behalf of an operative', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders?*',
      },
      { body: [] }
    ).as('workOrders')

    cy.intercept(
      { method: 'GET', path: '/api/filter/WorkOrder' },
      {
        fixture: 'filter/workOrder.json',
      }
    ).as('workOrderFilters')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000040/tasks' },
      { body: [] }
    ).as('tasksRequest')

    cy.fixture('workOrders/workOrder.json')
      .then((workOrder) => {
        workOrder.reference = 10000040
        workOrder.paymentType = null
        workOrder.startTime = null
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040' },
          { body: workOrder }
        )
      })
      .as('workOrder')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10000040' },
      {
        fixture: 'workOrderAppointments/noAppointment.json',
      }
    )

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('property')

    cy.intercept(
      { method: 'PUT', path: '/api/workOrders/starttime' },
      { body: '' }
    ).as('startTime')

    cy.intercept(
      { method: 'POST', path: '/api/workOrderComplete' },
      { body: '' }
    ).as('apiCheck')

    cy.intercept(
      { method: 'POST', path: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('jobStatusUpdateRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/simple-feature-toggle',
      },
      {
        body: {
          enableFollowOnIsEmergencyField: true,
        },
      }
    ).as('feature-toggle')
  })

  describe('When logged in as a contract manager', () => {
    beforeEach(() => {
      cy.loginWithContractManagerRole()
    })

    it('shows errors when attempting submission with invalid inputs', () => {
      cy.visit('/work-orders/10000040/close')

      cy.wait('@workOrder')

      cy.get('form').within(() => {
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.contains('Summary of updates to work order').should('not.exist')

      cy.get('form').within(() => {
        cy.contains('Please select a reason for closing the work order')
        cy.contains('Please pick completion date')
        cy.contains('Please enter a value for completion time')
      })

      // Input some invalid dates
      cy.get('form').within(() => {
        cy.get('#completionDate').type('2021-01-17') //Raised on 2021-01-18

        cy.get('[data-testid=completionTime-hour]').type('32')
        cy.get('[data-testid=completionTime-minutes]').type('66')

        cy.get('#notes').type('test')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.get('form').within(() => {
        cy.contains('Completion date must be on or after 18/01/2021')
      })

      cy.get('form').within(() => {
        cy.get('#completionDate').clear().type('2028-01-15')

        cy.get('[data-testid=completionTime-hour]').type('32')
        cy.get('[data-testid=completionTime-minutes]').type('66')

        cy.get('#notes').type('test')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.get('form').within(() => {
        cy.contains('Please select a date that is in the past')
        cy.contains('Please enter a valid time')
      })

      cy.get('form').within(() => {
        cy.get('#completionDate').clear().type('2021-01-20') //Raised on 2021-01-18

        cy.get('[data-testid=completionTime-hour]').clear().type('12')
        cy.get('[data-testid=completionTime-minutes]').clear().type('10')

        cy.get('#startDate').clear().type('2021-01-20') //Raised on 2021-01-18

        cy.get('[type="submit"]').contains('Close work order').click()

        cy.contains('Please enter a value for start time')

        cy.get('[data-testid=startTime-hour]').clear().type('12')
        cy.get('[data-testid=startTime-minutes]').clear().type('10')

        cy.contains('Please enter a value for start time').should('not.exist')
      })
    })

    it('allows valid inputs, shows a confirmation page, allows editing and and submits the form including a completed reason', () => {
      cy.visit('/work-orders/10000040/close')

      cy.wait('@workOrder')

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
            cy.contains('label', 'No further work required').click()
          })

        cy.get('#completionDate').type('2021-01-18') //Raised on 2021-01-18, 15:28

        cy.get('[data-testid=completionTime-hour]').type('12')
        cy.get('[data-testid=completionTime-minutes]').type('45')

        cy.get('#notes').type('test')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.contains('Summary of updates to work order')
      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/01/18')
      cy.get('.govuk-table__row').contains('12:45')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('Work Order Completed')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains('test')

      cy.contains('Go back and edit').click()

      // Enter 19 Janurary 2021 at 14:45
      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.get('[value="Work Order Completed"]').should('be.checked')
            cy.contains('label', 'No access').click()
          })

        cy.get('#completionDate').type('2021-01-19')

        cy.get('[data-testid=completionTime-hour]').clear()
        cy.get('[data-testid=completionTime-minutes]').clear()

        cy.get('[data-testid=completionTime-hour]').type('14')
        cy.get('[data-testid=completionTime-minutes]').type('45')

        cy.get('#notes').type('This has been repaired.')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.contains('Summary of updates to work order')

      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/01/19')
      cy.get('.govuk-table__row').contains('14:45')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('No Access')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains('This has been repaired.')

      cy.contains('Go back and edit').click()

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
            cy.contains('label', 'No further work required').click()
          })

        cy.get('#completionDate').type('2021-02-19')

        cy.get('[data-testid=completionTime-hour]').clear()
        cy.get('[data-testid=completionTime-minutes]').clear()

        cy.get('[data-testid=completionTime-hour]').type('13')
        cy.get('[data-testid=completionTime-minutes]').type('01')

        cy.get('#notes')
          .clear()
          .type(
            'This has been repaired and I forgot I did it on a completely different date and time.'
          )
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/02/19')
      cy.get('.govuk-table__row').contains('13:01')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('Work Order Completed')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains(
        'This has been repaired and I forgot I did it on a completely different date and time.'
      )

      cy.get('.govuk-table__row').contains('Operatives').should('not.exist')

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.wait('@apiCheck', { requestTimeout: 9000 })
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: '10000040',
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '0',
              otherType: 'completed',
              noteGeneratedOnFrontend: true,
              comments:
                'This has been repaired and I forgot I did it on a completely different date and time.',
              eventTime: '2021-02-19T13:01:00.000Z',
            },
          ],
        })

      cy.requestsCountByUrl('/api/jobStatusUpdate').should('eq', 0)

      // Confirmation screen
      cy.get('.govuk-panel--confirmation').within(() => {
        cy.get('.govuk-panel__title').contains('Work order closed')
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10000040')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li')
        .contains('View work order')
        .should('have.attr', 'href', '/work-orders/10000040')

      cy.get('.lbh-list li')
        .contains('Manage work orders')
        .should('have.attr', 'href', '/')
    })

    it('allows valid inputs, shows a confirmation page, allows editing and and submits the form including a no access reason', () => {
      cy.visit('/work-orders/10000040/close')

      cy.wait('@workOrder')

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'No access').click()
          })

        cy.get('#completionDate').type('2021-01-19')

        cy.get('[data-testid=completionTime-hour]').clear()
        cy.get('[data-testid=completionTime-minutes]').clear()

        cy.get('[data-testid=completionTime-hour]').type('13')
        cy.get('[data-testid=completionTime-minutes]').type('01')

        cy.get('#notes').type('Tenant was not at home')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/01/19')
      cy.get('.govuk-table__row').contains('13:01')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('No Access')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains('Tenant was not at home')

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.wait('@apiCheck', { requestTimeout: 6000 })
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: '10000040',
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '70',
              otherType: 'completed',
              comments: 'Work order closed - Tenant was not at home',
              eventTime: '2021-01-19T13:01:00.000Z',
              noteGeneratedOnFrontend: false,
            },
          ],
        })

      // no operative assignment request made
      cy.requestsCountByUrl('/api/jobStatusUpdate').should('eq', 0)

      // Confirmation screen
      cy.get('.govuk-panel--confirmation').within(() => {
        cy.get('.govuk-panel__title').contains('Work order closed')
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10000040')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li')
        .contains('View work order')
        .should('have.attr', 'href', '/work-orders/10000040')

      cy.get('.lbh-list li')
        .contains('Manage work orders')
        .should('have.attr', 'href', '/')
    })

    it('sends request to /starttime when startTime selected', () => {
      cy.visit('/work-orders/10000040/close')

      cy.wait('@workOrder')

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'No access').click()
          })

        cy.get('#startDate').type('2021-01-20')

        cy.get('[data-testid=startTime-hour]').clear().type('13')
        cy.get('[data-testid=startTime-minutes]').clear().type('01')

        cy.get('#completionDate').type('2021-01-19')

        cy.get('[data-testid=completionTime-hour]').clear().type('13')
        cy.get('[data-testid=completionTime-minutes]').clear().type('01')

        cy.get('#notes').type('Tenant was not at home')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/01/19')
      cy.get('.govuk-table__row').contains('Start time')
      cy.get('.govuk-table__row').contains('2021/01/20')
      cy.get('.govuk-table__row').contains('13:01')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('No Access')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains('Tenant was not at home')

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.wait(['@apiCheck', '@startTime'])

      // Confirmation screen
      cy.get('.govuk-panel--confirmation').within(() => {
        cy.get('.govuk-panel__title').contains('Work order closed')
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10000040')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li')
        .contains('View work order')
        .should('have.attr', 'href', '/work-orders/10000040')

      cy.get('.lbh-list li')
        .contains('Manage work orders')
        .should('have.attr', 'href', '/')
    })

    it('shows validation errors when uploading files', () => {
      cy.visit('/work-orders/10000040/close')
      cy.wait('@workOrder')

      const notPhoto = 'notPhoto.txt'
      const photo1 = 'photo_1.jpg'
      // 1. invalid file type
      cy.get('input[type="file"]').selectFile({
        contents: `cypress/fixtures/photos/${notPhoto}`,
      })

      cy.get('[type="submit"]').contains('Close work order').click()

      // should contain error message
      cy.contains(
        `Unsupported file type "text/plain". Allowed types: PNG & JPG`
      )
      cy.get('input[type="file"]').then((x) =>
        x.hasClass('govuk-form-group--error')
      )

      // 2. too many files
      // Create array of 11 identical photo files
      cy.get('input[type="file"]').selectFile(
        Array(11)
          .fill()
          .map((_, i) => ({
            contents: `cypress/fixtures/photos/${photo1}`,
            fileName: `photo_${i + 1}.jpg`,
            mimeType: 'image/jpeg',
            lastModified: Date.now(),
          }))
      )
      cy.contains('Caching photos').should('exist')

      cy.get('[type="submit"]').contains('Close work order').click()

      // should contain error message
      cy.contains(`You cannot attach more than 10 photos`)

      // 3. removing additional file clears error message
      cy.get('button').contains('Remove').last().click()

      cy.get('[type="submit"]').contains('Close work order').click()

      cy.contains(`You cannot attach more than 10 photos`).should('not.exist')
      cy.get('input[type="file"]').should(
        'not.have.class',
        'govuk-form-group--error'
      )
    })

    // shows photo validation errors
    it('shows error when network request fails uploading photo', () => {
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/images/upload*' },
        { statusCode: 500 }
      ).as('getLinksRequest')

      cy.visit('/work-orders/10000040/close')
      cy.wait('@workOrder')

      // 1. invalid file type
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'file.png',
        mimeType: 'image/png',
        lastModified: Date.now(),
      })

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'No access').click()
          })

        cy.get('#startDate').type('2021-01-20')

        cy.get('[data-testid=startTime-hour]').clear().type('13')
        cy.get('[data-testid=startTime-minutes]').clear().type('01')

        cy.get('#completionDate').type('2021-01-19')

        cy.get('[data-testid=completionTime-hour]').clear().type('13')
        cy.get('[data-testid=completionTime-minutes]').clear().type('01')

        cy.get('#notes').type('Tenant was not at home')
      })

      cy.get('[type="submit"]').contains('Close work order').click()

      cy.get('.govuk-table__row').contains('Photos')

      cy.get('.govuk-table__row img').should('have.attr', 'src')

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.get('[type="submit"]').contains('Confirm and close').click()

      // should contain error message
      cy.contains('Request failed with status code 500')
    })

    // uploads photos to work order
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
      cy.visit('/work-orders/10000040/close')
      cy.wait('@workOrder')

      // 1. invalid file type
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'file.png',
        mimeType: 'image/png',
        lastModified: Date.now(),
      })

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'No access').click()
          })

        cy.get('#startDate').type('2021-01-20')

        cy.get('[data-testid=startTime-hour]').clear().type('13')
        cy.get('[data-testid=startTime-minutes]').clear().type('01')

        cy.get('#completionDate').type('2021-01-19')

        cy.get('[data-testid=completionTime-hour]').clear().type('13')
        cy.get('[data-testid=completionTime-minutes]').clear().type('01')

        cy.get('#notes').type('Tenant was not at home')
      })

      cy.get('[type="submit"]').contains('Close work order').click()

      cy.get('.govuk-table__row').contains('Photos')

      cy.get('.govuk-table__row img').should('have.attr', 'src')
      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.wait([
        '@getLinksRequest',
        '@uploadToS3Request',
        '@completeUploadRequest',
      ])

      cy.wait(['@apiCheck', '@startTime'])

      // Confirmation screen
      cy.get('.govuk-panel--confirmation').within(() => {
        cy.get('.govuk-panel__title').contains('Work order closed')
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10000040')
        })
      })
    })

    describe('when the work does not allow operative and payment type selection', () => {
      beforeEach(() => {
        cy.fixture('workOrders/workOrder.json').then((workOrder) => {
          workOrder.reference = 10000040
          workOrder.canAssignOperative = false

          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000040' },
            { body: workOrder }
          ).as('workOrder')
        })

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/appointments/10000040' },
          {
            fixture: 'workOrderAppointments/noAppointment.json',
          }
        )
      })

      it('payment type and operative selection is not possible', () => {
        cy.visit('/work-orders/10000040/close')

        cy.wait(['@workOrder'])

        cy.get('form').within(() => {
          cy.contains('Reason for closing')
            .parent()
            .within(() => {
              cy.contains('label', 'Visit completed').click()
              cy.contains('label', 'No further work required').click()
            })

          cy.get('#completionDate').type('2021-01-23')

          cy.get('[data-testid=completionTime-hour]').type('12')
          cy.get('[data-testid=completionTime-minutes]').type('00')

          cy.contains('operative', { matchCase: false }).should('not.exist')
          cy.contains('payment type', { matchCase: false }).should('not.exist')

          cy.get('#notes').type('A note')
          cy.get('[type="submit"]').contains('Close work order').click()
        })

        cy.contains('th', 'Payment type').should('not.exist')
        cy.contains('th', 'Operatives').should('not.exist')

        cy.get('[type="submit"]').contains('Confirm and close').click()

        cy.wait('@apiCheck')
          .its('request.body')
          .should(
            'have.deep.nested.property',
            'jobStatusUpdates[0].comments',
            'A note'
          )

        // no operative assignment request made
        cy.requestsCountByUrl('/api/jobStatusUpdate').should('eq', 0)

        cy.get('@apiCheck')
          .its('request.body')
          .should(
            'not.have.deep.nested.property',
            'jobStatusUpdates[0].paymentType'
          )
      })
    })

    it('shows validation message when further works required not specified', () => {
      cy.visit('/work-orders/10000040/close')
      cy.wait('@workOrder')

      cy.contains('Reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'Visit completed').click()
        })

      cy.get('[type="submit"]').contains('Close work order').click()

      cy.contains('Please confirm if further work is required')
    })

    it('shows validation when user enters follow-on details', () => {
      cy.visit('/work-orders/10000040/close')
      cy.wait('@workOrder')

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
            cy.contains('label', 'Further work required').click()
          })

        // assert error messages arent visible yet
        cy.contains(
          'Please confirm whether you have contacted your supervisor'
        ).should('not.exist')
        cy.contains('Please select the type of work').should('not.exist')
        cy.contains('Please provide detail of the work required').should(
          'not.exist'
        )

        // close work order
        cy.get('[type="submit"]').contains('Close work order').click()

        // assert error messages visible
        cy.contains('Please confirm whether you have contacted your supervisor')
        cy.contains('Please select at least one trade')
        cy.contains('Please confirm if multiple operatives are required')
        cy.contains('Please provide detail of the work required')

        // select an option - error should disappear
        cy.get('input[data-testid="supervisorCalled"]').check('Yes')
        cy.get('input[data-testid="followonRequestUrgency"]').check('true')
        cy.contains(
          'Please confirm whether you have contacted your supervisor'
        ).should('not.exist')

        // select a trade - error should disappear
        cy.get('input[data-testid="followon-trades-plumbing"]').check()
        cy.get('[type="submit"]').contains('Close work order').click()
        cy.contains('Please select at least one trade').should('not.exist')

        // select if multiple operatives are required - error should disappear
        cy.get('[data-testid="isMultipleOperatives"]').check('true')
        cy.get('[type="submit"]').contains('Close work order').click()
        cy.contains(
          'Please confirm if multiple operatives are required'
        ).should('not.exist')

        // add description of work - error should disappear
        cy.get('textarea[data-testid="followOnTypeDescription"]').type(
          'Blah blah blah'
        )
        cy.contains('Please provide detail of the work required').should(
          'not.exist'
        )

        // when one of the material options is selected, the description must not be empty
        cy.get('input[data-testid="stockItemsRequired"]').check()
        cy.get('[type="submit"]').contains('Close work order').click()
        cy.contains('Please describe the materials required')

        // Adding a description - error should disappear
        cy.get('textarea[data-testid="materialNotes"]').type('Blah blah blah')
        cy.contains('Please describe the materials required').should(
          'not.exist'
        )

        // additional notes
        cy.get('textarea[data-testid="additionalNotes"]').type(
          'Additional notes'
        )

        // other fields

        cy.get('#completionDate').type('2021-01-23')

        cy.get('[data-testid=completionTime-hour]').type('12')
        cy.get('[data-testid=completionTime-minutes]').type('00')

        cy.get('#notes').type('A note')

        // close work order
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      // assert validation passed, and on next page
      cy.contains('Summary of updates to work order')
    })

    it('submits a request and shows summary page when user enters follow-on details with multiple operatives needed', () => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000040
        workOrder.canAssignOperative = false

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040' },
          { body: workOrder }
        ).as('workOrder')
      })

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/appointments/10000040' },
        {
          fixture: 'workOrderAppointments/noAppointment.json',
        }
      )

      cy.visit('/work-orders/10000040/close')

      cy.wait('@workOrder')

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
            cy.contains('label', 'Further work required').click()
          })

        // populate follow-on fields
        cy.get('input[data-testid="supervisorCalled"]').check('Yes')
        cy.get('input[data-testid="followonRequestUrgency"]').check('false')
        cy.get('input[data-testid="followon-trades-plumbing"]').check()
        cy.get('textarea[data-testid="followOnTypeDescription"]').type(
          'follow on description'
        )
        cy.get('[data-testid="isMultipleOperatives"]').check('true')
        cy.get('textarea[data-testid="materialNotes"]').type('material notes')
        cy.get('textarea[data-testid="additionalNotes"]').type(
          'Additional notes desc'
        )

        // other fields
        cy.get('input[data-testid="stockItemsRequired"]').check()
        cy.get('#completionDate').type('2021-01-23')
        cy.get('[data-testid=completionTime-hour]').type('12')
        cy.get('[data-testid=completionTime-minutes]').type('00')
        cy.get('#notes').type('A note')

        // close work order
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      // assert validation passed, and on next page
      cy.contains('Summary of updates to work order')
      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/01/23')
      cy.get('.govuk-table__row').contains('12:00:00')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('Work Order Completed')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains('A note')

      cy.contains('Summary of further work required')

      cy.get('.govuk-table__row').contains('Type of work required')
      cy.get('.govuk-table__row').contains('Plumbing')
      cy.get('.govuk-table__row').contains('follow on description')

      cy.get('.govuk-table__row').contains('Materials required')
      cy.get('.govuk-table__row').contains('Stock items required')
      cy.get('.govuk-table__row').contains('material notes')

      cy.get('.govuk-table__row').contains('Additional notes')
      cy.get('.govuk-table__row').contains('Additional notes desc')

      // validate request object

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.wait('@apiCheck')
      cy.get('@apiCheck')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: '10000040',
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '0',
              otherType: 'completed',
              comments: 'A note',
              eventTime: '2021-01-23T12:00:00.000Z',
              noteGeneratedOnFrontend: true,
            },
          ],
          followOnRequest: {
            isEmergency: false,
            isMultipleOperatives: true,
            requiredFollowOnTrades: ['Plumbing'],
            followOnTypeDescription: 'follow on description',
            stockItemsRequired: true,
            nonStockItemsRequired: false,
            materialNotes: 'material notes',
            additionalNotes: 'Additional notes desc',
            supervisorCalled: true,
          },
        })
    })

    it('submits a request and shows summary page when user enters follow-on details with multiple operatives not needed', () => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000040
        workOrder.canAssignOperative = false

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040' },
          { body: workOrder }
        ).as('workOrder')
      })

      cy.visit('/work-orders/10000040/close')

      cy.wait('@workOrder')

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
            cy.contains('label', 'Further work required').click()
          })

        // populate follow-on fields
        cy.get('input[data-testid="supervisorCalled"]').check('Yes')
        cy.get('input[data-testid="followonRequestUrgency"]').check('true')
        cy.get('input[data-testid="followon-trades-plumbing"]').check()
        cy.get('textarea[data-testid="followOnTypeDescription"]').type(
          'follow on description'
        )
        cy.get('[data-testid="isMultipleOperatives"]').check('false')
        cy.get('textarea[data-testid="materialNotes"]').type('material notes')
        cy.get('textarea[data-testid="additionalNotes"]').type(
          'Additional notes desc'
        )

        // other fields
        cy.get('input[data-testid="stockItemsRequired"]').check()
        cy.get('#completionDate').type('2021-01-23')
        cy.get('[data-testid=completionTime-hour]').type('12')
        cy.get('[data-testid=completionTime-minutes]').type('00')
        cy.get('#notes').type('A note')

        // close work order
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      // assert validation passed, and on next page
      cy.contains('Summary of updates to work order')
      cy.get('.govuk-table__row').contains('Completion time')
      cy.get('.govuk-table__row').contains('2021/01/23')
      cy.get('.govuk-table__row').contains('12:00:00')
      cy.get('.govuk-table__row').contains('Reason')
      cy.get('.govuk-table__row').contains('Work Order Completed')
      cy.get('.govuk-table__row').contains('Notes')
      cy.get('.govuk-table__row').contains('A note')

      cy.contains('Summary of further work required')

      cy.get('.govuk-table__row').contains('Type of work required')
      cy.get('.govuk-table__row').contains('Plumbing')
      cy.get('.govuk-table__row').contains('follow on description')

      cy.get('.govuk-table__row').contains('Materials required')
      cy.get('.govuk-table__row').contains('Stock items required')
      cy.get('.govuk-table__row').contains('material notes')

      cy.get('.govuk-table__row').contains('Additional notes')
      cy.get('.govuk-table__row').contains('Additional notes desc')

      // validate request object

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.wait('@apiCheck')
      cy.get('@apiCheck')
        .its('request.body')
        .should('deep.equal', {
          workOrderReference: {
            id: '10000040',
            description: '',
            allocatedBy: '',
          },
          jobStatusUpdates: [
            {
              typeCode: '0',
              otherType: 'completed',
              comments: 'A note',
              eventTime: '2021-01-23T12:00:00.000Z',
              noteGeneratedOnFrontend: true,
            },
          ],
          followOnRequest: {
            isEmergency: true,
            isMultipleOperatives: false,
            requiredFollowOnTrades: ['Plumbing'],
            followOnTypeDescription: 'follow on description',
            stockItemsRequired: true,
            nonStockItemsRequired: false,
            materialNotes: 'material notes',
            additionalNotes: 'Additional notes desc',
            supervisorCalled: true,
          },
        })
    })
  })
})
