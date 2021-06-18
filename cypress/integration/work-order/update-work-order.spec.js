/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contractor update a job', () => {
  beforeEach(() => {
    cy.loginWithContractorRole()

    // Viewing the home page
    cy.intercept(
      { method: 'GET', path: '/api/filter/WorkOrder' },
      {
        fixture: 'filter/work-order.json',
      }
    )
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/?PageSize=10&PageNumber=1' },
      { fixture: 'work-orders/work-orders.json' }
    )

    // Viewing the work order page
    cy.fixture('work-orders/work-order.json').then((workOrder) => {
      workOrder.reference = 10000040
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000040' },
        { body: workOrder }
      )
    })
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
      },
      { body: [] }
    )

    // Updating the work order
    cy.fixture('work-orders/tasks-and-sors.json').then((tasksAndSors) => {
      tasksAndSors.splice(1, 2)

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000040/tasks' },
        { body: tasksAndSors }
      ).as('taskListRequest')
    })

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes/PLP5R082?propertyReference=00012345?contractorReference=SCC',
      },
      { fixture: 'schedule-of-rates/code.json' }
    ).as('sorCodeRequest')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes/FAKECODE?propertyReference=00012345?contractorReference=SCC',
      },
      (req) => {
        req.reply({
          statusCode: 404,
          body: {
            message: 'Could not find SOR code',
          },
        })
      }
    ).as('sorCodeNotFound')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes/ANOTHERFAKECODE?propertyReference=00012345?contractorReference=SCC',
      },
      (req) => {
        req.reply({
          statusCode: 404,
          body: {
            message: 'Could not find SOR code',
          },
        })
      }
    ).as('sorCodeNotFound')

    cy.intercept(
      { method: 'POST', path: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('apiCheck')
  })

  it('throws errors if input values are empty or not valid', () => {
    cy.visit('/')

    cy.get('.govuk-table__cell').within(() => {
      cy.contains('a', '10000040').click()
    })

    cy.get('[data-testid="details"]').contains('Update').click({ force: true })

    cy.get('.govuk-grid-column-one-third').within(() => {
      cy.contains('a', 'Update')
        .should('have.attr', 'href', '/work-orders/10000040/update')
        .click()
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
      cy.get('input[id="rateScheduleItems[0][code]"]').type('fakecode')
      cy.get(
        'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
      )
      cy.get('[type="submit"]').contains('Next').click()
      cy.wait('@sorCodeNotFound')
      cy.get('[data-error-id="error-0"]').within(() => {
        cy.contains('Could not find SOR code: FAKECODE')
      })

      cy.contains('+ Add another SOR code').click()
      cy.get('input[id="rateScheduleItems[1][code]"]').type('anotherfakecode')
      cy.get(
        'div[id="rateScheduleItems[1][code]-form-group"] .govuk-error-message'
      )
      cy.get('[type="submit"]').contains('Next').click()
      cy.wait('@sorCodeNotFound')
      cy.get('[data-error-id="error-0"]').within(() => {
        cy.contains('Could not find SOR code: FAKECODE')
      })
      cy.get('[data-error-id="error-1"]').within(() => {
        cy.contains('Could not find SOR code: ANOTHERFAKECODE')
      })

      // Enter a non-number quantity
      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('x')

      cy.get('[type="submit"]').contains('Next').click()

      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('x')
      cy.get(
        'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Quantity must be a number')
      })

      // Enter a quantity with 1 decimal point
      cy.get('input[id="rateScheduleItems[0][quantity]"]')
        .clear()
        .type('1.5')
        .blur()
      cy.get(
        'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
      ).should('not.exist')
      // Enter a quantity with 2 decimal points
      cy.get('input[id="rateScheduleItems[0][quantity]"]')
        .clear()
        .type('1.55')
        .blur()
      cy.get(
        'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
      ).should('not.exist')
      // Enter a quantity less than 1 with 2 decimal points
      cy.get('input[id="rateScheduleItems[0][quantity]"]')
        .clear()
        .type('0.55')
        .blur()
      cy.get(
        'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
      ).should('not.exist')
      // Enter a quantity with more than 2 decimal points
      cy.get('input[id="rateScheduleItems[0][quantity]"]')
        .clear()
        .type('1.555')
        .blur()
      cy.get(
        'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains(
          'Quantity including a decimal point is permitted a maximum of 2 decimal places'
        )
      })

      // Enter a quantity less than the minimum
      cy.get('input[id="rateScheduleItems[0][quantity]"]')
        .clear()
        .type('0')
        .blur()
      cy.get(
        'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Quantity must be 0 or more')
      })
      cy.get('input[id="rateScheduleItems[0][quantity]"]')
        .clear()
        .type('-1')
        .blur()
      cy.get(
        'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Quantity must be 0 or more')
      })
    })
  })

  it('allows the user to update the job by changing the existing quantity', () => {
    cy.visit('/')

    cy.get('.govuk-table__cell').within(() => {
      cy.contains('a', '10000040').click()
    })

    cy.get('[data-testid="details"]').contains('Update').click({ force: true })

    cy.get('.govuk-grid-column-one-third').within(() => {
      cy.contains('a', 'Update')
        .should('have.attr', 'href', '/work-orders/10000040/update')
        .click()
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

    // Confirmation screen
    cy.get('.govuk-panel--confirmation.background-dark-green').within(() => {
      cy.get('.govuk-panel__body').within(() => {
        cy.contains('Job 10000040 has been successfully updated')
      })
    })

    // Actions to see relevant pages
    cy.get('.lbh-list li').within(() => {
      cy.contains('View work order').should(
        'have.attr',
        'href',
        '/work-orders/10000040'
      )
      cy.contains('View jobs dashboard').should('have.attr', 'href', '/')
    })
  })

  it('allows to update quantity, edit and add new sor codes', () => {
    cy.visit('/work-orders/10000040/update')

    cy.wait('@taskListRequest')

    cy.get('#repair-request-form').within(() => {
      cy.get('#original-rate-schedule-items').within(() => {
        cy.get('.lbh-heading-h2').contains(
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
        cy.get('.lbh-heading-h2').contains(
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
      cy.get('.lbh-link').click()
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
      cy.wait('@sorCodeNotFound')
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
    cy.get('.govuk-warning-text.lbh-warning-text').within(() => {
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

    // Confirmation screen
    cy.get('.govuk-panel--confirmation.background-yellow').within(() => {
      cy.get('.govuk-panel__body').within(() => {
        cy.contains(
          'Job 10000040 requires authorisation and has been sent to a manager'
        )
      })
    })

    // Actions to see relevant pages
    cy.get('.lbh-list li').within(() => {
      cy.contains('View work order').should(
        'have.attr',
        'href',
        '/work-orders/10000040'
      )
      cy.contains('View jobs dashboard').should('have.attr', 'href', '/')
    })

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
