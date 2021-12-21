/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Updating a work order', () => {
  context('As a contractor', () => {
    beforeEach(() => {
      cy.loginWithContractorRole()

      // Viewing the home page
      cy.intercept(
        { method: 'GET', path: '/api/filter/WorkOrder' },
        {
          fixture: 'filter/workOrder.json',
        }
      )
      cy.intercept(
        {
          method: 'GET',
          path: '/api/workOrders/?PageSize=10&PageNumber=1&IncludeHistorical=false',
        },
        { fixture: 'workOrders/workOrders.json' }
      )

      // Viewing the work order page
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
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
          path: '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&IncludeHistorical=false',
        },
        { body: [] }
      )

      // Updating the work order
      cy.fixture('workOrders/tasksAndSors.json').then((tasksAndSors) => {
        tasksAndSors.splice(1, 2)

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040/tasks' },
          { body: tasksAndSors }
        ).as('taskListRequest')
      })

      cy.intercept(
        {
          method: 'GET',
          path: '/api/schedule-of-rates/codes?tradeCode=DE&propertyReference=00012345&contractorReference=SCC',
        },
        { fixture: 'scheduleOfRates/codes.json' }
      ).as('sorCodesRequest')

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

      cy.get('[data-testid="details"]')
        .contains('Update')
        .click({ force: true })

      cy.get('.govuk-grid-column-one-third').within(() => {
        cy.contains('a', 'Update')
          .should('have.attr', 'href', '/work-orders/10000040/update')
          .click()
      })

      cy.wait(['@taskListRequest', '@sorCodesRequest'])

      cy.contains('Update work order: 10000040')

      cy.get('a').contains('+ Add another SOR code').click()

      cy.get('form').within(() => {
        cy.get('[type="submit"]').contains('Next').click()
      })

      cy.get(
        'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Please select an SOR code')
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
        cy.get('input[id="rateScheduleItems[0][code]"]').type('fakecode')
        cy.get(
          'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
        )
        cy.get('[type="submit"]').contains('Next').click()

        cy.get('.govuk-error-message').eq(0).contains('SOR code is not valid')

        cy.contains('+ Add another SOR code').click()
        cy.get('input[id="rateScheduleItems[1][code]"]').type('anotherfakecode')
        cy.get(
          'div[id="rateScheduleItems[1][code]-form-group"] .govuk-error-message'
        )
        cy.get('[type="submit"]').contains('Next').click()

        cy.get('.govuk-error-message').eq(0).contains('SOR code is not valid')

        cy.get('.govuk-error-message').eq(1).contains('Please enter a quantity')

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
          cy.contains('Quantity must be greater than 0')
        })
        cy.get('input[id="rateScheduleItems[0][quantity]"]')
          .clear()
          .type('-1')
          .blur()
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('Quantity must be greater than 0')
        })
      })
    })

    it('allows the user to update the work order by changing the existing quantity', () => {
      cy.visit('/')

      cy.get('.govuk-table__cell').within(() => {
        cy.contains('a', '10000040').click()
      })

      cy.get('[data-testid="details"]')
        .contains('Update')
        .click({ force: true })

      cy.get('.govuk-grid-column-one-third').within(() => {
        cy.contains('a', 'Update')
          .should('have.attr', 'href', '/work-orders/10000040/update')
          .click()
      })

      cy.wait(['@taskListRequest', '@sorCodesRequest'])

      cy.get('#repair-request-form').within(() => {
        // Enter a non-number quantity
        cy.get('#quantity-0-form-group').within(() => {
          cy.get('input[id="quantity-0"]').clear().type('x')
        })

        cy.get('[type="submit"]').contains('Next').click()
        cy.get('div[id="quantity-0-form-group"] .govuk-error-message').within(
          () => {
            cy.contains('Quantity must be a number')
          }
        )

        // Enter a quantity with 1 decimal point
        cy.get('input[id="quantity-0"]').clear().type('1.5').blur()
        cy.get('div[id="quantity-0-form-group"] .govuk-error-message').should(
          'not.exist'
        )
        // Enter a quantity with 2 decimal points
        cy.get('input[id="quantity-0"]').clear().type('1.55').blur()
        cy.get('div[id="quantity-0-form-group"] .govuk-error-message').should(
          'not.exist'
        )
        // Enter a quantity less than 1 with 2 decimal points
        cy.get('input[id="quantity-0"]').clear().type('0.55').blur()
        cy.get('div[id="quantity-0-form-group"] .govuk-error-message').should(
          'not.exist'
        )
        // Enter a quantity with more than 2 decimal points
        cy.get('input[id="quantity-0"]').clear().type('1.555').blur()
        cy.get('div[id="quantity-0-form-group"] .govuk-error-message').within(
          () => {
            cy.contains(
              'Quantity including a decimal point is permitted a maximum of 2 decimal places'
            )
          }
        )
        // Enter a negative quantity
        cy.get('input[id="quantity-0"]').clear().type('-1').blur()
        cy.get('div[id="quantity-0-form-group"] .govuk-error-message').within(
          () => {
            cy.contains('Quantity must be 0 or more')
          }
        )

        // Enter valid number
        cy.get('#quantity-0-form-group').within(() => {
          cy.get('input[id="quantity-0"]').clear().type('0')
        })

        cy.get('#variationReason')
          .get('.govuk-textarea')
          .type('Needs more work')
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
          comments: 'Needs more work',
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
          cy.contains('Work order 10000040 has been successfully updated')
        })
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li').within(() => {
        cy.contains('View work order').should(
          'have.attr',
          'href',
          '/work-orders/10000040'
        )
        cy.contains('View work orders dashboard').should(
          'have.attr',
          'href',
          '/'
        )
      })
    })

    it('allows to update quantity, edit and add new sor codes', () => {
      cy.visit('/work-orders/10000040/update')

      cy.wait(['@taskListRequest', '@sorCodesRequest'])

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
        cy.get('#variationReason')
          .get('.govuk-textarea')
          .type('Needs more work')

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

        cy.get('input[id="rateScheduleItems[0][code]"]').type(
          'PLP5R082 - RE ENAMEL ANY SIZE BATH'
        )

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
          comments: 'Needs more work',
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
            'Work order 10000040 requires authorisation and has been sent to a manager'
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
        cy.contains('View work orders dashboard').should(
          'have.attr',
          'href',
          '/'
        )
      })

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('As an operative', () => {
    beforeEach(() => {
      cy.loginWithOperativeRole()

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

      cy.fixture('hubUser/user.json')
        .then((user) => {
          user.operativePayrollNumber = 'OP001'
          cy.intercept({ method: 'GET', path: '/api/hub-user' }, { body: user })
        })
        .as('hubUserRequest')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/schedule-of-rates/codes?tradeCode=DE&propertyReference=00012345&contractorReference=SCC',
        },
        { fixture: 'scheduleOfRates/codes.json' }
      ).as('sorCodesRequest')

      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000621
        workOrder.canAssignOperative = true
        workOrder.totalSMVs = 76
        workOrder.operatives = [
          {
            id: 1,
            payrollNumber: 'OP001',
            name: 'Operative A',
            trades: [],
            jobPercentage: 0,
          },
        ]
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000621' },
          { body: workOrder }
        ).as('workOrderRequest')
      })
    })

    it('does not show link list of operatives, when there is only one', () => {
      cy.visit('/operatives/1/work-orders/10000621')

      cy.contains('WO 10000621')

      cy.contains('Operatives').should('not.exist')

      cy.get('a').contains('Hackney User - 100%').should('not.exist')
    })

    it('allows editing of an existing task quantity', () => {
      cy.visit('/operatives/1/work-orders/10000621')

      cy.get('.latest-tasks-and-sors-table').within(() => {
        cy.get('a').contains('DES5R006').click()
      })

      cy.wait(['@workOrderRequest', '@tasksRequest'])

      cy.url().should(
        'contain',
        '/work-orders/10000621/tasks/ade7c53b-8947-414c-b88f-9c5e3d875cbf/edit'
      )

      cy.get('form').within(() => {
        cy.contains('DES5R006 - Urgent call outs')

        cy.get('#quantity').should('have.value', '2').clear()

        cy.get('button').contains('Confirm').click()

        cy.get('#quantity-form-group').contains('Please enter a quantity')

        cy.get('#quantity').type('3')

        cy.get('button').contains('Confirm').click()
      })

      cy.wait('@jobStatusUpdateRequest')

      cy.get('@jobStatusUpdateRequest')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000621',
          },
          typeCode: '80',
          moreSpecificSORCode: {
            rateScheduleItem: [
              {
                // updated code - new quantity
                id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
                customCode: 'DES5R006',
                customName: 'Urgent call outs',
                quantity: {
                  amount: [3],
                },
              },
              {
                // existing code - unchanged
                id: 'bde7c53b-8947-414c-b88f-9c5e3d875cbg',
                customCode: 'DES5R005',
                customName: 'Normal call outs',
                quantity: {
                  amount: [4],
                },
              },
              {
                // existing code - unchanged
                id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbh',
                customCode: 'DES5R013',
                customName: 'Inspect additional sec entrance',
                quantity: {
                  amount: [5],
                },
              },
            ],
          },
        })

      cy.wait(['@workOrderRequest', '@tasksRequest', '@propertyRequest'])

      cy.contains('WO 10000621')
    })

    it('allows editing of an existing task quantity with a "Remove SOR" shortcut', () => {
      cy.visit('/operatives/1/work-orders/10000621')

      cy.get('.latest-tasks-and-sors-table').within(() => {
        cy.get('a').contains('DES5R006').click()
      })

      cy.url().should(
        'contain',
        '/work-orders/10000621/tasks/ade7c53b-8947-414c-b88f-9c5e3d875cbf/edit'
      )

      cy.get('form').within(() => {
        cy.contains('DES5R006 - Urgent call outs')

        cy.get('#quantity').should('have.value', '2')

        cy.get('button').contains('Remove SOR').click()
      })

      cy.wait('@jobStatusUpdateRequest')

      cy.get('@jobStatusUpdateRequest')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000621',
          },
          typeCode: '80',
          moreSpecificSORCode: {
            rateScheduleItem: [
              {
                // updated code - new quantity
                id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
                customCode: 'DES5R006',
                customName: 'Urgent call outs',
                quantity: {
                  amount: [0],
                },
              },
              {
                // existing code - unchanged
                id: 'bde7c53b-8947-414c-b88f-9c5e3d875cbg',
                customCode: 'DES5R005',
                customName: 'Normal call outs',
                quantity: {
                  amount: [4],
                },
              },
              {
                // existing code - unchanged
                id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbh',
                customCode: 'DES5R013',
                customName: 'Inspect additional sec entrance',
                quantity: {
                  amount: [5],
                },
              },
            ],
          },
        })

      cy.url().should('contain', '/work-orders/10000621')
    })

    it('allows adding new SOR', () => {
      cy.visit('/operatives/1/work-orders/10000621')
      cy.contains('Add new SOR').click()

      cy.wait('@sorCodesRequest')

      cy.url().should('contain', '/work-orders/10000621/tasks/new')

      // when form submitted without any value
      cy.get('form').within(() => {
        cy.get('[type="submit"]').contains('Confirm').click()
      })

      cy.get(
        'div[id="rateScheduleItems[operative][code]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Please select an SOR code')
      })
      cy.get(
        'div[id="rateScheduleItems[operative][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Please enter a quantity')
      })

      cy.get('form').within(() => {
        cy.get('input[id="rateScheduleItems[operative][code]"]')
          .clear()
          .type('DES5R003 - Immediate call outs')
        cy.get('input[id="rateScheduleItems[operative][quantity]"]')
          .clear()
          .type('3')

        cy.get('button').contains('Confirm').click()
      })
      cy.wait('@jobStatusUpdateRequest')

      cy.get('@jobStatusUpdateRequest')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000621',
          },
          typeCode: '80',
          moreSpecificSORCode: {
            rateScheduleItem: [
              {
                // existing code - unchanged
                id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
                customCode: 'DES5R006',
                customName: 'Urgent call outs',
                quantity: {
                  amount: [2],
                },
              },
              {
                // existing code - unchanged
                id: 'bde7c53b-8947-414c-b88f-9c5e3d875cbg',
                customCode: 'DES5R005',
                customName: 'Normal call outs',
                quantity: {
                  amount: [4],
                },
              },
              {
                // existing code - unchanged
                id: 'cde7c53b-8947-414c-b88f-9c5e3d875cbh',
                customCode: 'DES5R013',
                customName: 'Inspect additional sec entrance',
                quantity: {
                  amount: [5],
                },
              },
              {
                // new added code
                customCode: 'DES5R003',
                customName: 'Immediate call outs',
                quantity: {
                  amount: [3],
                },
              },
            ],
          },
        })

      cy.wait(['@workOrderRequest', '@tasksRequest', '@propertyRequest'])

      cy.contains('WO 10000621')
    })

    it('allows adding operatives with percentage splits', () => {
      cy.intercept(
        { method: 'GET', path: '/api/operatives' },
        { fixture: 'operatives/operatives.json' }
      ).as('operatives')

      cy.visit('/operatives/1/work-orders/10000621')
      cy.wait(['@workOrderRequest', '@tasksRequest', '@propertyRequest'])

      cy.contains('a', 'Add operatives').click()

      cy.wait(['@operatives', '@workOrderRequest'])

      cy.get('.operatives').within(() => {
        cy.get('input[list]').should('have.length', 1)
        cy.get('input[list]')
          .eq(0)
          .should('have.value', 'Operative A [1]')
          .should('be.disabled')
        cy.get('select')
          .eq(0)
          .should('have.value', '100%')
          .should('be.disabled')

        cy.get('a')
          .contains(/Add operative from list/)
          .click()
        cy.get('a')
          .contains(/Add operative from list/)
          .click()

        cy.get('input[list]').should('have.length', 3)

        cy.get('input[list]').eq(1).type('Operative B [2]')
        cy.get('input[list]').eq(2).type('Operative C [3]')
      })

      cy.get('.select-percentage').within(() => {
        cy.get('select').should('have.length', 3)

        cy.get('select').eq(0).should('have.value', '100%')
        cy.get('select').eq(1).should('have.value', '-')
        cy.get('select').eq(2).should('have.value', '-')

        cy.get('select').eq(1).select('20%')
      })

      cy.get('[type="submit"]').contains('Confirm').click()

      cy.get('.operatives').within(() => {
        cy.contains('Work done total across operatives must be equal to 100%')
      })

      cy.get('.select-percentage').within(() => {
        cy.get('select').eq(0).select('50%')
        cy.get('select').eq(1).select('50%')
        cy.get('select').eq(2).select('-')
      })

      cy.get('.smv-read-only').should('have.length', 3)

      cy.get('.smv-read-only').eq(0).contains('38')
      cy.get('.smv-read-only').eq(1).contains('38')
      cy.get('.smv-read-only').eq(2).contains('-')

      cy.get('[type="submit"]').contains('Confirm').click()

      cy.wait('@jobStatusUpdateRequest')

      cy.get('@jobStatusUpdateRequest')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000621',
          },
          operativesAssigned: [
            {
              identification: {
                number: 1,
              },
              calculatedBonus: 50,
            },
            {
              identification: {
                number: 2,
              },
              calculatedBonus: 50,
            },
            {
              identification: {
                number: 3,
              },
              calculatedBonus: 0,
            },
          ],
          comments:
            'Work order updated - Assigned operatives Operative A : 50%, Operative B : 50%, Operative C : -',
          isSplit: true,
          typeCode: '10',
        })

      cy.wait(['@workOrderRequest', '@tasksRequest', '@propertyRequest'])

      cy.contains('WO 10000621')
    })

    it('allows updating operatives with percentage splits', () => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000621
        workOrder.canAssignOperative = true
        workOrder.totalSMVs = 76
        workOrder.operatives = [
          {
            id: 2,
            payrollNumber: 'OP002',
            name: 'Operative B',
            trades: [],
            jobPercentage: 50,
          },
          {
            id: 1,
            payrollNumber: 'OP001',
            name: 'Operative A',
            trades: [],
            jobPercentage: 50,
          },
        ]
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000621' },
          { body: workOrder }
        ).as('workOrderRequestMultipleOperatives')
      })

      cy.intercept(
        { method: 'GET', path: '/api/operatives' },
        { fixture: 'operatives/operatives.json' }
      ).as('operatives')

      cy.visit('/operatives/1/work-orders/10000621')
      cy.wait([
        '@workOrderRequestMultipleOperatives',
        '@tasksRequest',
        '@propertyRequest',
      ])

      cy.contains('a', 'Add operatives').should('not.exist')

      cy.contains('WO 10000621')

      cy.contains('Operatives')

      cy.contains('a', 'Operative A - 50%').should(
        'have.attr',
        'href',
        '/work-orders/10000621/operatives/edit'
      )
      cy.contains('a', 'Operative B - 50%').should(
        'have.attr',
        'href',
        '/work-orders/10000621/operatives/edit'
      )

      cy.contains('a', 'Update operatives').click()

      cy.wait(['@operatives', '@workOrderRequestMultipleOperatives'])

      cy.get('.operatives').within(() => {
        cy.get('input[list]').should('have.length', 2)
        cy.get('input[list]').eq(0).should('have.value', 'Operative A [1]')
        cy.get('input[list]').eq(0).should('be.disabled')

        cy.get('input[list]').eq(1).should('have.value', 'Operative B [2]')
      })

      cy.get('.select-percentage').within(() => {
        cy.get('select').should('have.length', 2)

        cy.get('select').eq(0).should('have.value', '50%')
        cy.get('select').eq(1).should('have.value', '50%')
      })

      // Update percentage of current operatives
      cy.get('.select-percentage').within(() => {
        cy.get('select').eq(0).select('30%')
        cy.get('select').eq(1).select('20%')
      })

      // Add operative
      cy.get('a')
        .contains(/Add operative from list/)
        .click()

      cy.get('input[list]').eq(2).type('Operative C [3]')

      // Update percentage of new operative
      cy.get('.select-percentage').within(() => {
        cy.get('select').should('have.length', 3)
        cy.get('select').eq(2).select('50%')
      })

      cy.get('.smv-read-only').should('have.length', 3)

      cy.get('.smv-read-only').eq(0).contains('22.80')
      cy.get('.smv-read-only').eq(1).contains('15.20')
      cy.get('.smv-read-only').eq(2).contains('38')

      cy.get('[type="submit"]').contains('Confirm').click()

      cy.wait('@jobStatusUpdateRequest')

      cy.get('@jobStatusUpdateRequest')
        .its('request.body')
        .should('deep.equal', {
          relatedWorkOrderReference: {
            id: '10000621',
          },
          operativesAssigned: [
            {
              identification: {
                number: 1,
              },
              calculatedBonus: 30,
            },
            {
              identification: {
                number: 2,
              },
              calculatedBonus: 20,
            },
            {
              identification: {
                number: 3,
              },
              calculatedBonus: 50,
            },
          ],
          comments:
            'Work order updated - Assigned operatives Operative A : 30%, Operative B : 20%, Operative C : 50%',
          isSplit: true,
          typeCode: '10',
        })

      cy.wait([
        '@workOrderRequestMultipleOperatives',
        '@tasksRequest',
        '@propertyRequest',
      ])

      cy.contains('WO 10000621')
    })
  })
})
