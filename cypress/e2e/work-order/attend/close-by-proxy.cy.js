/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Closing a work order on behalf of an operative', () => {
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
            noteGeneratedOnFrontend: false,
            comments:
              'Work order closed - This has been repaired and I forgot I did it on a completely different date and time.',
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

    //  cy.audit()
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

    //  cy.audit()
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

    //  cy.audit()
  })

  it('shows validation errors when uploading files', () => {
    cy.visit('/work-orders/10000040/close')
    cy.wait('@workOrder')

    // 1. invalid file type
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.txt',
      mimeType: 'text/plain',
      lastModified: Date.now(),
    })

    cy.get('[type="submit"]').contains('Close work order').click()

    // should contain error message
    cy.contains(`Unsupported file type "text/plain". Allowed types: PNG & JPG`)
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
      { method: 'GET', path: '/api/workOrders/images/uploadLink?*' },
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

  describe('when the work allows operative and payment type selection', () => {
    beforeEach(() => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000040
        workOrder.contractorReference = 'H10' // DLO contractor reference
        workOrder.canAssignOperative = true
        workOrder.operatives = []
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040' },
          { body: workOrder }
        ).as('workOrder')
      })

      cy.intercept(
        { method: 'GET', path: '/api/operatives' },
        {
          body: [
            {
              id: 1,
              name: 'Operative A',
            },
            {
              id: 2,
              name: 'Operative B',
            },
            {
              id: 3,
              name: 'Operative C',
            },
            {
              id: 25,
              name: 'Operative Y',
            },
            {
              id: 26,
              name: 'Operative Z',
            },
          ],
        }
      ).as('operatives')
    })

    it('allows specifying a payment type of bonus by default', () => {
      cy.visit('/work-orders/10000040/close')

      cy.wait(['@workOrder', '@operatives'])

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
          })

        cy.get('#completionDate').type('2021-01-23')

        cy.get('[data-testid=completionTime-hour]').type('12')
        cy.get('[data-testid=completionTime-minutes]').type('00')

        cy.contains('Payment type')
          .parent()
          .within(() => {
            cy.get('[value="Bonus"]').should('be.checked')
            cy.get('[value="Overtime"]').should('not.be.checked')
            cy.get('[value="CloseToBase"]').should('not.be.checked')
          })

        cy.get('.operatives').within(() => {
          cy.get('input[list]').eq(0).type('Operative A [1]')
        })

        cy.get('#notes').type('A note')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.contains('th', 'Payment type').parent().contains('Bonus')

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.wait('@apiCheck')
        .its('request.body')
        .should(
          'have.deep.nested.property',
          'jobStatusUpdates[0].comments',
          'Work order closed - A note - Assigned operatives Operative A : 100% - Bonus calculation'
        )

      cy.get('@apiCheck')
        .its('request.body')
        .should(
          'have.deep.nested.property',
          'jobStatusUpdates[0].paymentType',
          'Bonus'
        )
    })

    it('allows specifying a payment type of overtime', () => {
      cy.visit('/work-orders/10000040/close')

      cy.wait(['@workOrder', '@operatives'])

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
          })

        cy.get('#completionDate').type('2021-01-23')

        cy.get('[data-testid=completionTime-hour]').type('12')
        cy.get('[data-testid=completionTime-minutes]').type('00')

        cy.contains('Payment type')
          .parent()
          .within(() => {
            cy.contains('label', 'Overtime').click()
          })

        cy.get('.operatives').within(() => {
          cy.get('input[list]').eq(0).type('Operative A [1]')
        })

        cy.get('#notes').type('A note')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.contains('th', 'Payment type').parent().contains('Overtime')

      cy.get('[type="submit"]').contains('Confirm and close').click()

      // Notes when closing with overtime do not include work percentage values
      cy.wait('@apiCheck')
        .its('request.body')
        .should(
          'have.deep.nested.property',
          'jobStatusUpdates[0].comments',
          'Work order closed - A note - Assigned operatives Operative A - Overtime work order (SMVs not included in Bonus)'
        )

      cy.get('@apiCheck')
        .its('request.body')
        .should(
          'have.deep.nested.property',
          'jobStatusUpdates[0].paymentType',
          'Overtime'
        )
    })

    it('allows specifying a payment type of close to base', () => {
      cy.visit('/work-orders/10000040/close')

      cy.wait(['@workOrder', '@operatives'])

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
          })

        cy.get('#completionDate').type('2021-01-23')

        cy.get('[data-testid=completionTime-hour]').type('12')
        cy.get('[data-testid=completionTime-minutes]').type('00')

        cy.contains('Payment type')
          .parent()
          .within(() => {
            cy.contains('label', 'Close to base').click()
          })

        cy.get('.operatives').within(() => {
          cy.get('input[list]').eq(0).type('Operative A [1]')
        })

        cy.get('#notes').type('A note')
        cy.get('[type="submit"]').contains('Close work order').click()
      })

      cy.contains('th', 'Payment type').parent().contains('Close to base')

      cy.get('[type="submit"]').contains('Confirm and close').click()

      cy.wait('@apiCheck')
        .its('request.body')
        .should(
          'have.deep.nested.property',
          'jobStatusUpdates[0].comments',
          'Work order closed - A note - Assigned operatives Operative A : 100% - Close to base (Operative payment made)'
        )

      cy.get('@apiCheck')
        .its('request.body')
        .should(
          'have.deep.nested.property',
          'jobStatusUpdates[0].paymentType',
          'CloseToBase'
        )
    })

    describe('When the order requires operative assignment', () => {
      describe('And the workorder has existing operatives assigned', () => {
        beforeEach(() => {
          cy.fixture('workOrders/workOrder.json').then((workOrder) => {
            workOrder.reference = 10000040
            workOrder.canAssignOperative = true
            workOrder.totalSMVs = 76
            workOrder.operatives = [
              {
                id: 1,
                name: 'Operative A',
              },
              {
                id: 2,
                name: 'Operative B',
              },
              {
                id: 3,
                name: 'Operative C',
              },
            ]
            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000040' },
              { body: workOrder }
            ).as('workOrder')
          })

          cy.intercept(
            { method: 'POST', path: '/api/workOrderComplete' },
            { body: '' }
          ).as('workOrderCompleteRequest')

          cy.intercept(
            { method: 'POST', path: '/api/jobStatusUpdate' },
            { body: '' }
          ).as('jobStatusUpdateRequest')
        })

        it('requires total value of split % to be 100', () => {
          cy.visit('/work-orders/10000040/close')

          cy.wait(['@workOrder', '@operatives'])

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

          cy.get('#notes').type('A note')

          cy.contains('Payment type')
            .parent()
            .within(() => {
              cy.get('[value="Bonus"]').should('be.checked')
              cy.get('[value="Overtime"]').should('not.be.checked')
              cy.get('[value="CloseToBase"]').should('not.be.checked')

              cy.contains('label', 'Overtime').click()
            })

          cy.get('.operatives').within(() => {
            cy.get('input[list]').should('have.length', 3)

            cy.get('input[list]').eq(0).should('have.value', 'Operative A [1]')
            cy.get('input[list]').eq(1).should('have.value', 'Operative B [2]')
            cy.get('input[list]').eq(2).should('have.value', 'Operative C [3]')
          })

          cy.get('.select-percentage select').should('have.length', 3)
          cy.get('.select-percentage select')
            .eq(0)
            .should('have.value', '33.3%')
          cy.get('.select-percentage select')
            .eq(1)
            .should('have.value', '33.3%')
          cy.get('.select-percentage select')
            .eq(2)
            .should('have.value', '33.3%')

          cy.get('.smv-read-only').should('have.length', 3)

          cy.get('.smv-read-only').eq(0).contains('25.31')
          cy.get('.smv-read-only').eq(1).contains('25.31')
          cy.get('.smv-read-only').eq(2).contains('25.31')

          cy.get('[type="submit"]').contains('Close work order').click()

          cy.get('.govuk-table__row')
            .contains('Operatives')
            .parent()
            .within(() => {
              cy.contains(
                'Operative A : 33.3%, Operative B : 33.3%, Operative C : 33.3%'
              )
            })

          cy.contains('Go back and edit').click()

          cy.get('.operatives').within(() => {
            cy.get('input[list]').eq(0).clear()
            cy.get('input[list]').eq(1).clear()
            cy.get('input[list]').eq(2).clear()
          })

          cy.get('[type="submit"]').contains('Close work order').click()

          cy.get('.operatives').within(() => {
            cy.get('#operative-0-form-group').contains(
              'Please select an operative'
            )
            cy.get('#operative-1-form-group').contains(
              'Please select an operative'
            )
            cy.get('#operative-2-form-group').contains(
              'Please select an operative'
            )
          })

          cy.get('.operatives').within(() => {
            cy.get('input[list]').eq(0).type('Operative Y [25]')
            cy.get('input[list]').eq(1).type('Operative A [1]')
            cy.get('input[list]').eq(2).type('Operative B [2]')

            cy.get('a')
              .contains(/Add operative/)
              .click()

            cy.get('input[list]').eq(3).type('Operative Z [26]')

            cy.get('input[list]').should('have.length', 4)
          })

          // total of split percentages is more than 100
          cy.get('.select-percentage select').eq(0).select('70%')
          cy.get('.select-percentage select').eq(1).select('20%')
          cy.get('.select-percentage select').eq(2).select('30%')
          cy.get('.select-percentage select').eq(3).select('10%')

          cy.get('.smv-read-only').should('have.length', 4)

          cy.get('.smv-read-only').eq(0).contains('53.20')
          cy.get('.smv-read-only').eq(1).contains('15.20')
          cy.get('.smv-read-only').eq(2).contains('22.80')
          cy.get('.smv-read-only').eq(3).contains('7.60')

          cy.get('[type="submit"]').contains('Close work order').click()

          cy.get('.operatives').within(() => {
            cy.contains(
              'Work done total across operatives must be equal to 100%'
            )
          })

          // now total is 100
          cy.get('.select-percentage select').eq(0).select('70%')
          cy.get('.select-percentage select').eq(1).select('20%')
          cy.get('.select-percentage select').eq(2).select('10%')
          cy.get('.select-percentage select').eq(3).select('-')

          cy.get('.smv-read-only').should('have.length', 4)

          cy.get('.smv-read-only').eq(0).contains('53.20')
          cy.get('.smv-read-only').eq(1).contains('15.20')
          cy.get('.smv-read-only').eq(2).contains('7.60')
          cy.get('.smv-read-only').eq(3).contains('-')

          cy.get('[type="submit"]').contains('Close work order').click()

          cy.get('.govuk-table__row')
            .contains('Operatives')
            .parent()
            .within(() => {
              cy.contains(
                'Operative Y : 70%, Operative A : 20%, Operative B : 10%, Operative Z : -'
              )
            })

          cy.get('[type="submit"]').contains('Confirm and close').click()

          cy.wait('@jobStatusUpdateRequest', { requestTimeout: 6000 })
            .its('request.body')
            .should('deep.equal', {
              relatedWorkOrderReference: {
                id: '10000040',
              },
              operativesAssigned: [
                {
                  identification: {
                    number: 25,
                  },
                  calculatedBonus: 70,
                },
                {
                  identification: {
                    number: 1,
                  },
                  calculatedBonus: 20,
                },
                {
                  identification: {
                    number: 2,
                  },
                  calculatedBonus: 10,
                },
                {
                  identification: {
                    number: 26,
                  },
                  calculatedBonus: 0,
                },
              ],
              typeCode: '10',
            })

          cy.wait('@workOrderCompleteRequest')
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
                  comments:
                    'Work order closed - A note - Assigned operatives Operative Y, Operative A, Operative B, Operative Z - Overtime work order (SMVs not included in Bonus)',
                  eventTime: '2021-01-19T13:01:00.000Z',
                  paymentType: 'Overtime',
                  noteGeneratedOnFrontend: false,
                },
              ],
            })

          cy.get('@workOrderCompleteRequest.all').should('have.length', 1)

          //  cy.audit()
        })
      })

      describe('And has existing operatives assigned and job split was done by operative', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', path: '/api/filter/WorkOrder' },
            {
              fixture: 'filter/workOrder.json',
            }
          ).as('workOrderFilters')

          cy.intercept(
            {
              method: 'GET',
              path: '/api/workOrders/?PageSize=10&PageNumber=1',
            },
            { fixture: 'workOrders/workOrders.json' }
          ).as('workOrders')

          cy.fixture('workOrders/workOrder.json').then((workOrder) => {
            workOrder.reference = 10000040
            workOrder.canAssignOperative = true
            workOrder.totalSMVs = 76
            workOrder.isSplit = true
            workOrder.operatives = [
              {
                id: 1,
                jobPercentage: 40,
                name: 'Operative A',
              },
              {
                id: 2,
                jobPercentage: 60,
                name: 'Operative B',
              },
            ]
            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000040' },
              { body: workOrder }
            ).as('workOrder')
          })

          cy.intercept(
            { method: 'POST', path: '/api/workOrderComplete' },
            { body: '' }
          ).as('workOrderCompleteRequest')

          cy.intercept(
            { method: 'POST', path: '/api/jobStatusUpdate' },
            { body: '' }
          ).as('jobStatusUpdateRequest')
        })

        it('closes work order with existing pre-split by operative', () => {
          cy.visit('/work-orders/10000040/close')

          cy.wait(['@workOrder', '@operatives'])

          cy.contains('Reason for closing')
            .parent()
            .within(() => {
              cy.contains('label', 'Visit completed').click()
            })

          cy.get('#completionDate').type('2021-01-19')

          cy.get('[data-testid=completionTime-hour]').clear()
          cy.get('[data-testid=completionTime-minutes]').clear()

          cy.get('[data-testid=completionTime-hour]').type('13')
          cy.get('[data-testid=completionTime-minutes]').type('01')

          cy.get('#notes').type('A note')

          cy.get('.operatives').within(() => {
            cy.get('input[list]').should('have.length', 2)

            cy.get('input[list]').eq(0).should('have.value', 'Operative A [1]')
            cy.get('input[list]').eq(1).should('have.value', 'Operative B [2]')
          })

          cy.get('.select-percentage select').should('have.length', 2)
          cy.get('.select-percentage select').eq(0).should('have.value', '40%')
          cy.get('.select-percentage select').eq(1).should('have.value', '60%')

          cy.get('.smv-read-only').should('have.length', 2)

          cy.get('.smv-read-only').eq(0).contains('30.40')
          cy.get('.smv-read-only').eq(1).contains('45.60')

          cy.get('[type="submit"]').contains('Close work order').click()

          cy.get('.govuk-table__row')
            .contains('Operatives')
            .parent()
            .within(() => {
              cy.contains('Operative A : 40%, Operative B : 60%')
            })

          cy.get('[type="submit"]').contains('Confirm and close').click()

          cy.wait('@jobStatusUpdateRequest')
            .its('request.body')
            .should('deep.equal', {
              relatedWorkOrderReference: {
                id: '10000040',
              },
              operativesAssigned: [
                {
                  identification: {
                    number: 1,
                  },
                  calculatedBonus: 40,
                },
                {
                  identification: {
                    number: 2,
                  },
                  calculatedBonus: 60,
                },
              ],
              typeCode: '10',
            })

          cy.wait('@workOrderCompleteRequest')
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
                  comments:
                    'Work order closed - A note - Assigned operatives Operative A : 40%, Operative B : 60% - Bonus calculation',
                  eventTime: '2021-01-19T13:01:00.000Z',
                  paymentType: 'Bonus',
                  noteGeneratedOnFrontend: false,
                },
              ],
            })

          cy.get('@workOrderCompleteRequest.all').should('have.length', 1)

          //  cy.audit()
        })
      })

      describe('And the workorder has no existing operatives assigned', () => {
        beforeEach(() => {
          // Viewing the work order page
          cy.fixture('workOrders/workOrder.json').then((workOrder) => {
            workOrder.reference = 10000040
            workOrder.contractorReference = 'H10' // DLO contractor reference
            workOrder.canAssignOperative = true
            workOrder.operatives = []
            cy.intercept(
              { method: 'GET', path: '/api/workOrders/10000040' },
              { body: workOrder }
            ).as('workOrder')
          })

          cy.intercept(
            { method: 'POST', path: '/api/workOrderComplete' },
            { body: '' }
          ).as('workOrderCompleteRequest')

          cy.intercept(
            { method: 'POST', path: '/api/jobStatusUpdate' },
            { body: '' }
          ).as('jobStatusUpdateRequest')
        })

        it('requires the submission of at least one operative', () => {
          cy.visit('/work-orders/10000040/close')

          cy.wait(['@workOrder', '@operatives'])

          cy.get('.operatives').within(() => {
            cy.get('input[list]').should('have.length', 1)

            cy.get('input[list]').eq(0).should('have.value', '')
          })

          cy.get('[type="submit"]').contains('Close work order').click()

          cy.get('.operatives').within(() => {
            cy.get('#operative-0-form-group').contains(
              'Please select an operative'
            )
          })

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

          cy.get('#notes').type('A note')

          cy.get('.operatives').within(() => {
            cy.get('input[list]').eq(0).type('Operative Y [25]')
            cy.get('input[list]').should('have.length', 1)
          })

          // should add 100% by default
          cy.get('.select-percentage').within(() => {
            cy.get('select').eq(0).should('have.value', '100%')
          })

          cy.get('.smv-read-only').should('have.length', 1)

          cy.get('.smv-read-only').eq(0).contains('76')

          cy.get('[type="submit"]').contains('Close work order').click()

          cy.get('.govuk-table__row')
            .contains('Operatives')
            .parent()
            .within(() => {
              cy.contains('Operative Y : 100%')
            })

          cy.get('[type="submit"]').contains('Confirm and close').click()

          cy.wait('@jobStatusUpdateRequest')
            .its('request.body')
            .should('deep.equal', {
              relatedWorkOrderReference: {
                id: '10000040',
              },
              operativesAssigned: [
                {
                  identification: {
                    number: 25,
                  },
                  calculatedBonus: 100,
                },
              ],
              typeCode: '10',
            })

          cy.wait('@workOrderCompleteRequest')
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
                  comments:
                    'Work order closed - A note - Assigned operatives Operative Y : 100% - Bonus calculation',
                  eventTime: '2021-01-19T13:01:00.000Z',
                  paymentType: 'Bonus',
                  noteGeneratedOnFrontend: false,
                },
              ],
            })

          cy.get('@workOrderCompleteRequest.all').should('have.length', 1)

          //  cy.audit()
        })
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
    })

    it('payment type and operative selection is not possible', () => {
      cy.visit('/work-orders/10000040/close')

      cy.wait(['@workOrder'])

      cy.get('form').within(() => {
        cy.contains('Reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Visit completed').click()
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
          'Work order closed - A note'
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
})
