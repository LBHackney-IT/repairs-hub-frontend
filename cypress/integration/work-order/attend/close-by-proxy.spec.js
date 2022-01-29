/// <reference types="cypress" />
import 'cypress-audit/commands'

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
      { method: 'POST', path: '/api/workOrderComplete' },
      { body: '' }
    ).as('apiCheck')

    cy.intercept(
      { method: 'POST', path: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('jobStatusUpdateRequest')

    cy.loginWithContractorRole()
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
      cy.contains('Please enter a valid time')
    })

    // Input some invalid dates
    cy.get('form').within(() => {
      cy.get('#date').type('2021-01-17') //Raised on 2021-01-18

      cy.get('[data-testid=completionTime-hour]').type('32')
      cy.get('[data-testid=completionTime-minutes]').type('66')

      cy.get('#notes').type('test')
      cy.get('[type="submit"]').contains('Close work order').click()
    })

    cy.get('form').within(() => {
      cy.contains('Completion date must be on or after 18/01/2021')
    })

    cy.get('form').within(() => {
      cy.get('#date').clear().type('2028-01-15')

      cy.get('[data-testid=completionTime-hour]').type('32')
      cy.get('[data-testid=completionTime-minutes]').type('66')

      cy.get('#notes').type('test')
      cy.get('[type="submit"]').contains('Close work order').click()
    })

    cy.get('form').within(() => {
      cy.contains('Please select a date that is in the past')
      cy.contains('Please enter a valid time')
    })
  })

  it('allows valid inputs, shows a confirmation page, allows editing and and submits the form including a completed reason', () => {
    cy.visit('/work-orders/10000040/close')

    cy.wait('@workOrder')

    cy.visit('/work-orders/10000040/close')

    cy.wait('@workOrder')

    cy.get('form').within(() => {
      cy.contains('Select reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'Completed').click()
        })

      cy.get('#date').type('2021-01-18') //Raised on 2021-01-18, 15:28

      cy.get('[data-testid=completionTime-hour]').type('12')
      cy.get('[data-testid=completionTime-minutes]').type('45')

      cy.contains('Payment type')
        .parent()
        .within(() => {
          cy.get('[value="Bonus"]').should('be.checked')
          cy.get('[value="Overtime"]').should('not.be.checked')
          cy.get('[value="CloseToBase"]').should('not.be.checked')
        })

      cy.get('#notes').type('test')
      cy.get('[type="submit"]').contains('Close work order').click()
    })

    cy.contains('Summary of updates to work order')
    cy.get('.govuk-table__row').contains('Completion time')
    cy.get('.govuk-table__row').contains('2021/01/18')
    cy.get('.govuk-table__row').contains('12:45')
    cy.get('.govuk-table__row').contains('Reason')
    cy.get('.govuk-table__row').contains('Completed')
    cy.get('.govuk-table__row').contains('Notes')
    cy.get('.govuk-table__row').contains('test')

    cy.get('.govuk-table__row').within(() => {
      cy.contains('Edit').click()
    })

    // Enter 19 Janurary 2021 at 14:45
    cy.get('form').within(() => {
      cy.contains('Select reason for closing')
        .parent()
        .within(() => {
          cy.get('[value="Work Order Completed"]').should('be.checked')

          cy.contains('label', 'No access').click()
        })

      cy.get('#date').type('2021-01-19')

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

    cy.get('.govuk-table__row').within(() => {
      cy.contains('Edit').click()
    })

    cy.get('form').within(() => {
      cy.contains('Select reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'Completed').click()
        })

      cy.get('#date').type('2021-02-19')

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
    cy.get('.govuk-table__row').contains('Completed')
    cy.get('.govuk-table__row').contains('Notes')
    cy.get('.govuk-table__row').contains(
      'This has been repaired and I forgot I did it on a completely different date and time.'
    )

    cy.get('.govuk-table__row').contains('Operatives').should('not.exist')

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
            comments:
              'Work order closed - This has been repaired and I forgot I did it on a completely different date and time.',
            eventTime: '2021-02-19T13:01:00.000Z',
            paymentType: 'Bonus',
          },
        ],
      })

    cy.wait(['@workOrderFilters', '@workOrders'])

    cy.location('pathname').should('equal', '/')
    cy.contains('Manage work orders')

    cy.requestsCountByUrl('/api/jobStatusUpdate').should('eq', 0)

    cy.audit()
  })

  it('allows valid inputs, shows a confirmation page, allows editing and and submits the form including a no access reason', () => {
    cy.visit('/work-orders/10000040/close')

    cy.wait('@workOrder')

    cy.get('form').within(() => {
      cy.contains('Select reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'No access').click()
        })

      cy.get('#date').type('2021-01-19')

      cy.get('[data-testid=completionTime-hour]').clear()
      cy.get('[data-testid=completionTime-minutes]').clear()

      cy.get('[data-testid=completionTime-hour]').type('13')
      cy.get('[data-testid=completionTime-minutes]').type('01')

      cy.contains('Payment type')
        .parent()
        .within(() => {
          cy.get('[value="Bonus"]').should('be.checked')
          cy.get('[value="Overtime"]').should('not.be.checked')
          cy.get('[value="CloseToBase"]').should('not.be.checked')

          cy.contains('label', 'Close to base').click()
        })

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

    cy.contains('th', 'Payment type').parent().contains('Close to base')

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
            typeCode: '70',
            otherType: 'completed',
            comments:
              'Work order closed - Tenant was not at home - Closed to base (operative payment done)',
            eventTime: '2021-01-19T13:01:00.000Z',
            paymentType: 'CloseToBase',
          },
        ],
      })

    cy.wait(['@workOrderFilters', '@workOrders'])

    cy.location('pathname').should('equal', '/')
    cy.contains('Manage work orders')

    cy.audit()
  })

  it('allows specifying an order as overtime', () => {
    cy.visit('/work-orders/10000040/close')

    cy.wait(['@workOrder'])

    cy.get('.operatives').should('not.exist')

    cy.get('form').within(() => {
      cy.contains('Select reason for closing')
        .parent()
        .within(() => {
          cy.contains('label', 'Completed').click()
        })

      cy.get('#date').type('2021-01-23')

      cy.get('[data-testid=completionTime-hour]').type('12')
      cy.get('[data-testid=completionTime-minutes]').type('00')

      cy.contains('Payment type')
        .parent()
        .within(() => {
          cy.contains('label', 'Overtime').click()
        })

      cy.get('#notes').type('This has been repaired during overtime.')
      cy.get('[type="submit"]').contains('Close work order').click()
    })

    cy.contains('th', 'Payment type').parent().contains('Overtime')

    cy.get('[type="submit"]').contains('Confirm and close').click()

    cy.wait('@apiCheck')

    cy.get('@apiCheck')
      .its('request.body')
      .should(
        'have.deep.nested.property',
        'jobStatusUpdates[0].comments',
        'Work order closed - This has been repaired during overtime. - Overtime'
      )

    cy.get('@apiCheck')
      .its('request.body')
      .should(
        'have.deep.nested.property',
        'jobStatusUpdates[0].paymentType',
        'Overtime'
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

        cy.contains('Select reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'No access').click()
          })

        cy.get('#date').type('2021-01-19')

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

        cy.get('.select-percentage').within(() => {
          cy.get('select').should('have.length', 3)

          cy.get('select').eq(0).should('have.value', '33.3%')
          cy.get('select').eq(1).should('have.value', '33.3%')
          cy.get('select').eq(2).should('have.value', '33.3%')
        })

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
            cy.get('a').contains('Edit').click()
          })

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
            .contains(/Add operative from list/)
            .click()

          cy.get('input[list]').eq(3).type('Operative Z [26]')

          cy.get('input[list]').should('have.length', 4)
        })

        // total of split percentages is more than 100
        cy.get('.select-percentage').within(() => {
          cy.get('select').eq(0).select('70%')
          cy.get('select').eq(1).select('20%')
          cy.get('select').eq(2).select('30%')
          cy.get('select').eq(3).select('10%')
        })

        cy.get('.smv-read-only').should('have.length', 4)

        cy.get('.smv-read-only').eq(0).contains('53.20')
        cy.get('.smv-read-only').eq(1).contains('15.20')
        cy.get('.smv-read-only').eq(2).contains('22.80')
        cy.get('.smv-read-only').eq(3).contains('7.60')

        cy.get('[type="submit"]').contains('Close work order').click()

        cy.get('.operatives').within(() => {
          cy.contains('Work done total across operatives must be equal to 100%')
        })

        // now total is 100
        cy.get('.select-percentage').within(() => {
          cy.get('select').eq(0).select('70%')
          cy.get('select').eq(1).select('20%')
          cy.get('select').eq(2).select('10%')
          cy.get('select').eq(3).select('-')
        })

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

        cy.get('@workOrderCompleteRequest')
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
                  'Work order closed - A note - Assigned operatives Operative Y, Operative A, Operative B, Operative Z - Overtime',
                eventTime: '2021-01-19T13:01:00.000Z',
                paymentType: 'Overtime',
              },
            ],
          })

        cy.requestsCountByUrl('api/jobStatusUpdate').should('eq', 1)

        cy.audit()
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
          { method: 'GET', path: '/api/workOrders/?PageSize=10&PageNumber=1' },
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

        cy.contains('Select reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'Completed').click()
          })

        cy.get('#date').type('2021-01-19')

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

        cy.get('.select-percentage').within(() => {
          cy.get('select').should('have.length', 2)

          cy.get('select').eq(0).should('have.value', '40%')
          cy.get('select').eq(1).should('have.value', '60%')
        })

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

        cy.get('@workOrderCompleteRequest')
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
                  'Work order closed - A note - Assigned operatives Operative A : 40%, Operative B : 60%',
                eventTime: '2021-01-19T13:01:00.000Z',
                paymentType: 'Bonus',
              },
            ],
          })

        cy.requestsCountByUrl('api/jobStatusUpdate').should('eq', 1)

        cy.audit()
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
          { method: 'GET', path: '/api/operatives' },
          {
            body: [
              {
                id: 25,
                name: 'Operative Y',
              },
            ],
          }
        ).as('operatives')

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

        cy.contains('Select reason for closing')
          .parent()
          .within(() => {
            cy.contains('label', 'No access').click()
          })

        cy.get('#date').type('2021-01-19')

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

        cy.get('@workOrderCompleteRequest')
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
                  'Work order closed - A note - Assigned operatives Operative Y : 100%',
                eventTime: '2021-01-19T13:01:00.000Z',
                paymentType: 'Bonus',
              },
            ],
          })

        cy.requestsCountByUrl('api/jobStatusUpdate').should('eq', 1)

        cy.audit()
      })
    })
  })
})
