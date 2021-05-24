/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Variation summary tab on work-order page', () => {
  context('work order status is Variation Pending approval', () => {
    beforeEach(() => {
      cy.server()
      // Stub requests
      cy.fixture('properties/property.json').as('property')
      cy.fixture('work-orders/status-variation-pending-approval.json').as(
        'workOrder'
      )
      cy.fixture('work-orders/variation-tasks.json').as('variation-tasks')
      cy.fixture('work-orders/tasks-and-sors.json').as('tasks-and-sors')

      cy.route('GET', 'api/properties/00012345', '@property')
      cy.route('GET', 'api/workOrders/10000012', '@workOrder')
      cy.route(
        'GET',
        'api/workOrders/10000012/variation-tasks',
        '@variation-tasks'
      ).as('variation-tasks-request')
      cy.route('GET', 'api/workOrders/10000012/tasks', '@tasks-and-sors').as(
        'tasks-and-sors-request'
      )
    })
    // Logged in as a contract-manager (has permission to authorise a variation)
    it('shows the summary of the variation in variation-summary tab and has link to authorise variation', () => {
      cy.loginWithContractManagerRole()

      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
      // Now select Variation Summary tab
      cy.get('a[id="tab_variation-summary-tab"]').click()
      cy.get('#variation-summary-tab').within(() => {
        cy.contains('a', 'Variation Authorisation')
        cy.contains('Summary of Tasks and SORs')

        cy.get('.original-sor-summary').within(() => {
          cy.contains('td', 'DES5R006 - Urgent call outs')
          cy.contains('td', '1')
          cy.contains('td', '£10')
        })

        cy.contains('Updated Tasks SORs')
        cy.contains('Updated by: John Johnson (Alphatrack)')
        cy.contains('Tuesday, 11 May 2021')

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

    //logged in as an Agent
    it('shows variation summary but does not show the link for variation authorisation to Agent', () => {
      cy.loginWithAgentRole()

      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
      // Now select Variation Summary tab
      cy.get('a[id="tab_variation-summary-tab"]').click()
      cy.get('#variation-summary-tab').within(() => {
        cy.contains('a', 'Variation Authorisation').should('not.exist')
        cy.contains('Summary of Tasks and SORs')

        cy.get('.original-sor-summary').within(() => {
          cy.contains('td', 'DES5R006 - Urgent call outs')
          cy.contains('td', '1')
          cy.contains('td', '£10')
        })

        cy.contains('Updated Tasks SORs')
        cy.contains('Updated by: John Johnson (Alphatrack)')
        cy.contains('Tuesday, 11 May 2021')

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

    //logged in as a Contractor
    it('shows variation summary but does not show the link for variation authorisation to Contractor', () => {
      cy.loginWithContractorRole()

      cy.visit(`${Cypress.env('HOST')}/work-orders/10000012`)
      // Now select Variation Summary tab
      cy.get('a[id="tab_variation-summary-tab"]').click()
      cy.get('#variation-summary-tab').within(() => {
        cy.contains('a', 'Variation Authorisation').should('not.exist')
        cy.contains('Summary of Tasks and SORs')

        cy.get('.original-sor-summary').within(() => {
          cy.contains('td', 'DES5R006 - Urgent call outs')
          cy.contains('td', '1')
          cy.contains('td', '£10')
        })

        cy.contains('Updated Tasks SORs')
        cy.contains('Updated by: John Johnson (Alphatrack)')
        cy.contains('Tuesday, 11 May 2021')

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
      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('work order status is NOT Variation Pending Approval', () => {
    beforeEach(() => {
      cy.loginWithContractManagerRole()
      cy.server()
      // Stub requests
      cy.fixture('properties/property.json').as('property')
      cy.route('GET', 'api/properties/00012345', '@property')
    })

    it('status is In Progress ', () => {
      cy.fixture('work-orders/work-order.json')
        .as('workOrder')
        .then((workOrder) => {
          workOrder.reference = 10000040
        })
      cy.route('GET', 'api/workOrders/10000040', '@workOrder')

      cy.visit(`${Cypress.env('HOST')}/work-orders/10000040`)
      // Now select Variation Summary tab
      cy.get('a[id="tab_variation-summary-tab"]').click({ force: true })
      cy.get('#variation-summary-tab').within(() => {
        cy.contains('There are no variations for this work order.')
      })
      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('status is Work complete ', () => {
      cy.fixture('work-orders/work-order.json')
        .as('workOrder')
        .then((workOrder) => {
          workOrder.reference = 10000037
        })
      cy.route('GET', 'api/workOrders/10000037', '@workOrder')
      cy.visit(`${Cypress.env('HOST')}/work-orders/10000037`)
      // Now select Variation Summary tab
      cy.get('a[id="tab_variation-summary-tab"]').click({ force: true })
      cy.get('#variation-summary-tab').within(() => {
        cy.contains('There are no variations for this work order.')
      })
      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    it('status is Authorisation Pending Approval ', () => {
      cy.fixture('work-orders/work-order.json')
        .as('workOrder')
        .then((workOrder) => {
          workOrder.reference = 10000032
        })
      cy.route('GET', 'api/workOrders/10000032', '@workOrder')

      cy.visit(`${Cypress.env('HOST')}/work-orders/10000032`)
      // Now select Variation Summary tab
      cy.get('a[id="tab_variation-summary-tab"]').click({ force: true })
      cy.get('#variation-summary-tab').within(() => {
        cy.contains('There are no variations for this work order.')
      })
      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
