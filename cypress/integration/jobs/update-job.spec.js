/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contractor update a job', () => {
  beforeEach(() => {
    cy.loginWithContractorRole()
    cy.server()
    cy.fixture('schedule-of-rates/codes.json').as('sorCodes')
    cy.fixture('schedule-of-rates/code.json').as('sorCode')
    cy.fixture('repairs/work-order.json')
      .as('workOrder')
      .then((workOrder) => {
        workOrder.reference = 10000040
      })
    cy.fixture('repairs/work-orders.json').as('workOrdersList')
    // Return first item
    cy.fixture('repairs/tasks-and-sors.json')
      .then((tasksAndSors) => {
        tasksAndSors.splice(1, 2)
      })
      .as('tasksList')
    cy.fixture('hub-user/user.json').then((user) => {
      cy.intercept('GET', 'api/hub-user', user)
    })

    cy.route('GET', 'api/repairs/?PageSize=10&PageNumber=1', '@workOrdersList')
    cy.route('GET', 'api/repairs/10000040', '@workOrder')
    cy.route('GET', 'api/repairs/10000040/tasks', '@tasksList').as(
      'taskListRequest'
    )
    cy.route(
      'GET',
      'api/repairs/?propertyReference=00012345&PageSize=50&PageNumber=1',
      []
    )
    cy.route({
      method: 'GET',
      url: 'api/schedule-of-rates/codes/FAKECODE?propertyReference=00012345',
      status: 404,
      response: '',
    }).as('sorCodeNotFound')
    cy.route({
      method: 'GET',
      url:
        'api/schedule-of-rates/codes/ANOTHERFAKECODE?propertyReference=00012345',
      status: 404,
      response: '',
    }).as('sorCodeNotFound')
    cy.route(
      'GET',
      'api/schedule-of-rates/codes/PLP5R082?propertyReference=00012345',
      '@sorCode'
    ).as('sorCodeRequest')
    cy.route({
      method: 'POST',
      url: '/api/jobStatusUpdate',
      response: '',
    }).as('apiCheck')

    // Viewing the work order page
    cy.fixture('properties/property.json').then((property) => {
      cy.intercept('GET', 'api/properties/00012345', property)
    })
    cy.fixture('repairs/work-orders.json').then((workOrders) => {
      cy.intercept('GET', 'api/repairs/10000040', workOrders[0])
    })
  })

  it('throws errors if input values are empty or not valid', () => {
    cy.visit(`${Cypress.env('HOST')}/`)

    cy.get('.govuk-table__cell').within(() => {
      cy.contains('a', '10000040').click()
    })
    cy.contains('a', 'Update Works Order').click()
    cy.contains('Update work order: 10000040')
    cy.get('form').within(() => {
      cy.get('[type="radio"]').check('Update')
      cy.get('[type="submit"]').contains('Next').click()
    })

    cy.wait('@taskListRequest')

    // Update page
    cy.contains('Update work order: 10000040')

    cy.contains('+ Add another SOR code').click()

    cy.get('form').within(() => {
      cy.get('[type="submit"]').contains('Next').click()
    })

    cy.get(
      'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
    ).within(() => {
      cy.contains('Please enter an SOR code')
    })
    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).within(() => {
      cy.contains('Please enter a quantity')
    })
    cy.get('#variationReason-form-group .govuk-error-message').within(() => {
      cy.contains('Please enter a reason')
    })

    cy.get('#repair-request-form').within(() => {
      // Enter multiple invalid SOR codes
      cy.get('input[id="rateScheduleItems[0][code]"]').type('fakecode').blur()
      cy.wait('@sorCodeNotFound')
      cy.get('[type="submit"]').contains('Next').click()
      cy.get(
        'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('SOR code is not valid')
      })
      cy.get('[data-error-id="error-0"]').within(() => {
        cy.contains('Could not find SOR code: FAKECODE')
      })

      cy.contains('+ Add another SOR code').click()
      cy.get('input[id="rateScheduleItems[1][code]"]')
        .type('anotherfakecode')
        .blur()
      cy.wait('@sorCodeNotFound')
      cy.get('[type="submit"]').contains('Next').click()
      cy.get(
        'div[id="rateScheduleItems[1][code]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('SOR code is not valid')
      })
      cy.get('[data-error-id="error-0"]').within(() => {
        cy.contains('Could not find SOR code: FAKECODE')
      })
      cy.get('[data-error-id="error-1"]').within(() => {
        cy.contains('Could not find SOR code: ANOTHERFAKECODE')
      })

      // Enter a non-number quantity
      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('x')

      cy.get('[type="submit"]').contains('Next').click()

      cy.contains('Quantity must be a whole number')
      // Enter a quantity more than the maximum
      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('60')

      cy.contains('Quantity must be 50 or less')
      // Enter a quantity less then the minimum
      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('0')
      cy.contains('Quantity must be 1 or more')

      // Enter a non-integer quantity
      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('1.5')
      cy.contains('Quantity must be a whole number')
    })
  })

  it('allows the user to update the job by changing the existing quantity', () => {
    cy.visit(`${Cypress.env('HOST')}/`)
    cy.get('.govuk-table__cell').within(() => {
      cy.contains('a', '10000040').click()
    })
    cy.contains('a', 'Update Works Order').click()
    cy.contains('Update work order: 10000040')
    cy.get('form').within(() => {
      cy.get('[type="radio"]').check('Update')
      cy.get('[type="submit"]').contains('Next').click()
    })
    cy.wait('@taskListRequest')
    cy.get('#repair-request-form').within(() => {
      cy.get('#quantity-0-form-group').within(() => {
        cy.get('input[id="quantity-0"]').clear().type('0')
      })
      cy.get('#variationReason').get('.govuk-textarea').type('Needs more work')
      cy.get('[type="submit"]').contains('Next').click()
    })
    cy.get('[type="submit"]').contains('Confirm and close').click()
    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000040',
        },
        typeCode: '80',
        comments: 'Variation reason: Needs more work',
        moreSpecificSORCode: {
          rateScheduleItem: [
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              customCode: 'DES5R006',
              customName: 'Urgent call outs',
              quantity: {
                amount: [Number.parseInt('0')],
              },
            },
          ],
        },
      })
  })

  it('allows to update quantity, edit and add new sor codes', () => {
    cy.visit(`${Cypress.env('HOST')}/repairs/jobs/10000040/update-job`)
    cy.wait('@taskListRequest')

    cy.get('#repair-request-form').within(() => {
      cy.get('#original-rate-schedule-items').within(() => {
        cy.get('.govuk-heading-m').contains(
          'Original tasks and SORS raised with work order'
        )
        // Expect all input fields to be disabled
        cy.get('input[id="originalRateScheduleItems[0][code]"]').should(
          'be.disabled'
        )
        cy.get('input[id="originalRateScheduleItems[0][quantity]"]').should(
          'be.disabled'
        )
      })
      cy.get('#existing-rate-schedule-items').within(() => {
        cy.get('.govuk-heading-m').contains(
          'Latest tasks and SORS against the work order'
        )
        // Expect SOR code input fields to be disabled
        cy.get('input[id="sor-code-0"]').should('be.disabled')
      })
      cy.get('#quantity-0-form-group').within(() => {
        cy.get('input[id="quantity-0"]').clear().type('12')
      })

      // Enter variation reason
      cy.get('#variationReason').get('.govuk-textarea').type('Needs more work')

      cy.get('[type="submit"]').contains('Next').click()
    })

    cy.contains('Summary of updates to work order')

    cy.get('.govuk-table__body').contains('DES5R006 - Urgent call outs')
    cy.get('.govuk-table__body').contains('12')
    cy.get('.govuk-table__body').contains('0')
    // Go back and add new SOR code
    cy.get('.govuk-table__row').within(() => {
      cy.contains('Edit').click()
    })

    cy.get('#quantity-0-form-group').within(() => {
      cy.get('input[id="quantity-0"]').clear().type('3')
    })
    cy.get('#repair-request-form').within(() => {
      cy.get('.repairs-hub-link').click()
      // Enter in full SOR Code and blur text input
      cy.get('input[id="rateScheduleItems[0][code]"]').type('PLP5R082').blur()
      cy.wait('@sorCodeRequest')
      cy.get('.sor-code-summary').within(() => {
        cy.contains('SOR code summary: RE ENAMEL ANY SIZE BATH')
      })
      // Enter case insensitive SOR code
      cy.get('input[id="rateScheduleItems[0][code]"]')
        .clear()
        .type('plp5R082')
        .blur()
      cy.wait('@sorCodeRequest')
      cy.get('.sor-code-summary').within(() => {
        cy.contains('SOR code summary: RE ENAMEL ANY SIZE BATH')
      })

      // Enter invalid SOR Code
      cy.get('input[id="rateScheduleItems[0][code]"]')
        .clear()
        .type('fakecode')
        .blur()
      cy.get('.sor-code-summary').should('not.exist')
      cy.get('[data-error-id="error-0"]').within(() => {
        cy.contains('Could not find SOR code: FAKECODE')
      })
      // Enter valid SOR code
      cy.get('input[id="rateScheduleItems[0][code]"]')
        .clear()
        .type('PLP5R082')
        .blur()
      cy.wait('@sorCodeRequest')
      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('5')

      cy.get('[type="submit"]').contains('Next').click()
    })

    cy.contains('Summary of updates to work order')
    // Check original tasks and SORS table
    cy.contains('Original Tasks and SORs')
    cy.get('.govuk-table.original-tasks-table').within(() => {
      cy.get('.govuk-table__head').within(() => {
        cy.get('.govuk-table__header').contains('SOR code')
        cy.get('.govuk-table__header').contains('Quantity')
        cy.get('.govuk-table__header').contains('Cost (unit)')
      })
      cy.get('.govuk-table__body').within(() => {
        cy.get('tr[id="original-task-0"]').within(() => {
          cy.contains('DES5R006 - Urgent call outs')
          cy.contains('1')
          cy.contains('0')
        })
      })
    })
    // Check updated tasks and SORS table
    cy.contains('Updated Tasks and SORs')
    cy.get('.govuk-table.updated-tasks-table').within(() => {
      cy.get('.govuk-table__head').within(() => {
        cy.get('.govuk-table__header').contains('SOR code')
        cy.get('.govuk-table__header').contains('Quantity')
        cy.get('.govuk-table__header').contains('Cost (unit)')
      })
      cy.get('.govuk-table__body').within(() => {
        cy.get('tr[id="existing-task-0"]').within(() => {
          cy.contains('DES5R006 - Urgent call outs')
          cy.contains('3')
          cy.contains('0')
        })
        cy.get('tr[id="added-task-0"]').within(() => {
          cy.contains('PLP5R082 - RE ENAMEL ANY SIZE BATH')
          cy.contains('5')
          cy.contains('148.09')
        })
        cy.get('#original-cost').within(() => {
          cy.contains('Original cost')
          cy.contains('10.00')
        })
        cy.get('#variation-cost').within(() => {
          cy.contains('Variation cost')
          cy.contains('760.45')
        })
        cy.get('#total-cost').within(() => {
          cy.contains('Total cost')
          cy.contains('770.45')
        })
      })
    })
    cy.get('.variation-reason-summary').within(() => {
      cy.contains('Variation reason')
      cy.contains('Needs more work')
    })
    // Warning text as logged in user's vary limit has been exceeded
    cy.get('.govuk-warning-text').within(() => {
      cy.contains(
        'Your variation cost exceeds £250 and will be sent for approval.'
      )
    })

    cy.get('[type="submit"]').contains('Confirm and close').click()

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000040',
        },
        typeCode: '80',
        comments: 'Variation reason: Needs more work',
        moreSpecificSORCode: {
          rateScheduleItem: [
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              customCode: 'DES5R006',
              customName: 'Urgent call outs',
              quantity: {
                amount: [Number.parseInt('3')],
              },
            },
            {
              customCode: 'PLP5R082',
              customName: 'RE ENAMEL ANY SIZE BATH',
              quantity: {
                amount: [Number.parseInt('5')],
              },
            },
          ],
        },
      })

    cy.location('pathname').should('eq', '/')
    cy.contains('Manage jobs')

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
