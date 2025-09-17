/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Pending variation tab on work-order page', () => {
  context('work order status is Variation Pending approval', () => {
    beforeEach(() => {
      // Stub requests
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/new' },
        { fixture: 'workOrders/statusVariationPendingApproval.json' }
      )

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/appointments/10000012' },
        {
          fixture: 'workOrderAppointments/noAppointment.json',
        }
      )

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
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/tasks' },
        { fixture: 'workOrders/tasksAndSors.json' }
      )
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000012/variation-tasks' },
        { fixture: 'workOrders/variationTasks.json' }
      )
    })
    // Logged in as a contract-manager (has permission to authorise a variation)
    it('shows the summary of the variation in variation-summary tab and has link to authorise variation', () => {
      cy.loginWithContractManagerRole()
      cy.visit('/work-orders/10000012')

      // Now select Pending variation tab
      cy.contains('.tabs-button', 'Pending variation').click()

      cy.get('#pending-variation-tab').within(() => {
        cy.contains('a', 'Variation Authorisation')
        cy.contains('Summary of Tasks and SORs')

        cy.get('.original-sor-summary').within(() => {
          cy.contains('td', 'DES5R006 - Urgent call outs')
          cy.contains('td', '1')
          cy.contains('td', '£10')
        })

        cy.contains('Updated Tasks SORs')
        cy.contains('Updated by: John Johnson (Alphatrack)')
        cy.contains('Tuesday 11 May 2021')

        cy.contains('Variation reason: More work needed')
        cy.get('.updated-tasks-table').within(() => {
          // Increased task
          cy.get('tbody>tr')
            .eq(0)
            .within(() => {
              cy.contains('td', 'Increase')
              cy.contains('td', 'DES5R005')
              cy.contains('p', 'Normal Call outs')
              cy.contains('td', '£4')
              cy.contains('td', '1')
              cy.contains('td', '£4')
              cy.contains('td', '4000')
              cy.contains('td', '£1600')
            })

          //Reduced task
          cy.get('tbody>tr')
            .eq(1)
            .within(() => {
              cy.contains('td', 'Reduced')
              cy.contains('td', 'DES5R006')

              cy.contains('td', '£19')
              cy.contains('td', '10')
              cy.contains('td', '£190')
              cy.contains('td', '2')
              cy.contains('td', '£38')
            })

          //New task
          cy.get('tbody>tr')
            .eq(2)
            .within(() => {
              cy.contains('td', 'New')
              cy.contains('td', 'DES5R007')

              cy.contains('td', '£25')
              cy.contains('td', '0')
              cy.contains('td', '£0')
              cy.contains('td', '2')
              cy.contains('td', '£50')
            })

          //Unchanged task
          cy.get('tbody>tr')
            .eq(3)
            .within(() => {
              cy.contains('td', 'Unchanged')
              cy.contains('td', 'DES5R006')

              cy.contains('td', '£10')
              cy.contains('td', '1')
              cy.contains('td', '£10')
              cy.contains('td', '1')
              cy.contains('td', '£10')
            })
        })
        // Cost calculation
        cy.get('.calculated-cost').within(() => {
          cy.get('#cost-before-variation').within(() => {
            cy.contains('td', 'Cost before variation')
            cy.contains('td', '£204.00')
          })
          cy.get('#change-in-cost').within(() => {
            cy.contains('td', 'Change in cost')
            cy.contains('td', '£15894.00')
          })
          cy.get('#total-cost-after-variation').within(() => {
            cy.contains('td', 'Total cost after variation')
            cy.contains('td', '£16098.00')
          })
        })
      })
    })

    //logged in as an Agent
    it('shows Pending variation but does not show the link for variation authorisation to Agent', () => {
      cy.loginWithAgentRole()
      cy.visit('/work-orders/10000012')

      // Now select Pending variation tab
      cy.contains('.tabs-button', 'Pending variation').click()
      cy.get('#pending-variation-tab').within(() => {
        cy.contains('a', 'Variation Authorisation').should('not.exist')
        cy.contains('Summary of Tasks and SORs')

        cy.get('.original-sor-summary').within(() => {
          cy.contains('td', 'DES5R006 - Urgent call outs')
          cy.contains('td', '1')
          cy.contains('td', '£10')
        })

        cy.contains('Updated Tasks SORs')
        cy.contains('Updated by: John Johnson (Alphatrack)')
        cy.contains('Tuesday 11 May 2021')

        cy.contains('Variation reason: More work needed')
        cy.get('.updated-tasks-table').within(() => {
          // Increased task
          cy.get('tbody>tr')
            .eq(0)
            .within(() => {
              cy.contains('td', 'Increase')
              cy.contains('td', 'DES5R005')
              cy.contains('p', 'Normal Call outs')
              cy.contains('td', '£4')
              cy.contains('td', '1')
              cy.contains('td', '£4')
              cy.contains('td', '4000')
              cy.contains('td', '£1600')
            })

          //Reduced task
          cy.get('tbody>tr')
            .eq(1)
            .within(() => {
              cy.contains('td', 'Reduced')
              cy.contains('td', 'DES5R006')

              cy.contains('td', '£19')
              cy.contains('td', '10')
              cy.contains('td', '£190')
              cy.contains('td', '2')
              cy.contains('td', '£38')
            })

          //New task
          cy.get('tbody>tr')
            .eq(2)
            .within(() => {
              cy.contains('td', 'New')
              cy.contains('td', 'DES5R007')

              cy.contains('td', '£25')
              cy.contains('td', '0')
              cy.contains('td', '£0')
              cy.contains('td', '2')
              cy.contains('td', '£50')
            })

          //Unchanged task
          cy.get('tbody>tr')
            .eq(3)
            .within(() => {
              cy.contains('td', 'Unchanged')
              cy.contains('td', 'DES5R006')

              cy.contains('td', '£10')
              cy.contains('td', '1')
              cy.contains('td', '£10')
              cy.contains('td', '1')
              cy.contains('td', '£10')
            })
        })

        cy.get('.calculated-cost').within(() => {
          cy.get('#cost-before-variation').within(() => {
            cy.contains('td', 'Cost before variation')
            cy.contains('td', '£204.00')
          })
          cy.get('#change-in-cost').within(() => {
            cy.contains('td', 'Change in cost')
            cy.contains('td', '£15894.00')
          })
          cy.get('#total-cost-after-variation').within(() => {
            cy.contains('td', 'Total cost after variation')
            cy.contains('td', '£16098.00')
          })
        })
      })
    })

    //logged in as a Contractor
    it('shows Pending variation but does not show the link for variation authorisation to Contractor', () => {
      cy.loginWithContractorRole()
      cy.visit('/work-orders/10000012')

      // Now select Pending variation tab
      cy.contains('.tabs-button', 'Pending variation').click()
      cy.get('#pending-variation-tab').within(() => {
        cy.contains('a', 'Variation Authorisation').should('not.exist')
        cy.contains('Summary of Tasks and SORs')

        cy.get('.original-sor-summary').within(() => {
          cy.contains('td', 'DES5R006 - Urgent call outs')
          cy.contains('td', '1')
          cy.contains('td', '£10')
        })

        cy.contains('Updated Tasks SORs')
        cy.contains('Updated by: John Johnson (Alphatrack)')
        cy.contains('Tuesday 11 May 2021')

        cy.contains('Variation reason: More work needed')
        cy.get('.updated-tasks-table').within(() => {
          // Increased task
          cy.get('tbody>tr')
            .eq(0)
            .within(() => {
              cy.contains('td', 'Increase')
              cy.contains('td', 'DES5R005')
              cy.contains('p', 'Normal Call outs')
              cy.contains('td', '£4')
              cy.contains('td', '1')
              cy.contains('td', '£4')
              cy.contains('td', '4000')
              cy.contains('td', '£1600')
            })

          //Reduced task
          cy.get('tbody>tr')
            .eq(1)
            .within(() => {
              cy.contains('td', 'Reduced')
              cy.contains('td', 'DES5R006')

              cy.contains('td', '£19')
              cy.contains('td', '10')
              cy.contains('td', '£190')
              cy.contains('td', '2')
              cy.contains('td', '£38')
            })

          //New task
          cy.get('tbody>tr')
            .eq(2)
            .within(() => {
              cy.contains('td', 'New')
              cy.contains('td', 'DES5R007')

              cy.contains('td', '£25')
              cy.contains('td', '0')
              cy.contains('td', '£0')
              cy.contains('td', '2')
              cy.contains('td', '£50')
            })

          //Unchanged task
          cy.get('tbody>tr')
            .eq(3)
            .within(() => {
              cy.contains('td', 'Unchanged')
              cy.contains('td', 'DES5R006')

              cy.contains('td', '£10')
              cy.contains('td', '1')
              cy.contains('td', '£10')
              cy.contains('td', '1')
              cy.contains('td', '£10')
            })
        })
        // Cost calculation
        cy.get('.calculated-cost').within(() => {
          // Cost calculation
          cy.get('#cost-before-variation').within(() => {
            cy.contains('td', 'Cost before variation')
            cy.contains('td', '£204.00')
          })
          cy.get('#change-in-cost').within(() => {
            cy.contains('td', 'Change in cost')
            cy.contains('td', '£15894.00')
          })
          cy.get('#total-cost-after-variation').within(() => {
            cy.contains('td', 'Total cost after variation')
            cy.contains('td', '£16098.00')
          })
        })
      })
    })
  })

  context('work order status is NOT Variation Pending Approval', () => {
    beforeEach(() => {
      cy.loginWithContractManagerRole()

      // Stub requests
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      )
    })

    it('status is In Progress', () => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000040
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000040/new' },
          { body: workOrder }
        )
      })

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/appointments/10000040' },
        {
          fixture: 'workOrderAppointments/noAppointment.json',
        }
      )

      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
        },
        { body: [] }
      )
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000040/tasks' },
        { fixture: 'workOrders/tasksAndSors.json' }
      )
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000040/variation-tasks' },
        { body: [] }
      )

      cy.visit('/work-orders/10000040')

      // Now select Pending variation tab
      cy.contains('.tabs-button', 'Pending variation').click({ force: true })
      cy.get('#pending-variation-tab').within(() => {
        cy.contains('There are no variations for this work order.')
      })
    })

    it('status is Work complete', () => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000037
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000037/new' },
          { body: workOrder }
        )
      })

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/appointments/10000037' },
        {
          fixture: 'workOrderAppointments/noAppointment.json',
        }
      )

      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
        },
        { body: [] }
      )
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000037/tasks' },
        { fixture: 'workOrders/tasksAndSors.json' }
      )
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000037/variation-tasks' },
        { body: [] }
      )

      cy.visit('/work-orders/10000037')

      // Now select Pending variation tab
      cy.contains('.tabs-button', 'Pending variation').click({ force: true })
      cy.get('#pending-variation-tab').within(() => {
        cy.contains('There are no variations for this work order.')
      })
    })

    it('status is Authorisation Pending Approval', () => {
      cy.fixture('workOrders/workOrder.json').then((workOrder) => {
        workOrder.reference = 10000032
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000032/new' },
          { body: workOrder }
        )
      })

      cy.intercept(
        { method: 'GET', path: '/api/workOrders/appointments/10000032' },
        {
          fixture: 'workOrderAppointments/noAppointment.json',
        }
      )

      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
        },
        { body: [] }
      )
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000032/tasks' },
        { fixture: 'workOrders/tasksAndSors.json' }
      )
      cy.intercept(
        { method: 'GET', path: '/api/workOrders/10000032/variation-tasks' },
        { body: [] }
      )

      cy.visit('/work-orders/10000032')

      // Now select Variation Pending variation tab
      cy.contains('.tabs-button', 'Pending variation').click({ force: true })
      cy.get('#pending-variation-tab').within(() => {
        cy.contains('There are no variations for this work order.')
      })
    })
  })
})
