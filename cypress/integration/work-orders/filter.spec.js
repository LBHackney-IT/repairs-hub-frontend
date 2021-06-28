/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Filter work orders', () => {
  // Stub work orders and work orders filter response
  beforeEach(() => {
    // Work order filters
    cy.intercept(
      { method: 'GET', path: '/api/filter/WorkOrder' },
      { fixture: 'filter/work-order.json' }
    ).as('filters')

    // All work orders
    cy.intercept(
      { path: '/api/workOrders/?PageSize=10&PageNumber=1' },
      { fixture: 'work-orders/work-orders.json' }
    )

    // No work orders for work cancelled
    cy.intercept(
      { path: '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=30' },
      { body: [] }
    )

    // Work complete (50)
    cy.fixture('work-orders/work-orders.json').then((workOrders) => {
      cy.intercept(
        { path: '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=50' },
        workOrders.filter((workOrder) => workOrder.status === 'Work complete')
      )
    })

    // Variation Pending Approval (90)
    cy.fixture('work-orders/work-orders.json').then((workOrders) => {
      cy.intercept(
        { path: '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=90' },
        workOrders.filter(
          (workOrder) => workOrder.status === 'Variation Pending Approval'
        )
      )
    })

    // Work Complete (50) and Variation Pending Approval (90)
    cy.fixture('work-orders/work-orders.json').then((workOrders) => {
      cy.intercept(
        {
          path:
            '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=50&StatusCode=90',
        },
        workOrders.filter(
          (workOrder) =>
            workOrder.status === 'Work complete' ||
            workOrder.status === 'Variation Pending Approval'
        )
      )
    })

    // In Progress (80) and Variation Pending Approval (90) and Emergency priority
    cy.fixture('work-orders/work-orders.json').then((workOrders) => {
      cy.intercept(
        {
          path:
            '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=80&StatusCode=90&Priorities=2',
        },
        workOrders.filter(
          (workOrder) =>
            (workOrder.status === 'In progress' ||
              workOrder.status === 'Variation Pending Approval') &&
            workOrder.priority === '2 [E] EMERGENCY'
        )
      ).as('workOrdersInProgressVariationPendingApprovalEmergency')
    })

    // Work order with Emergency priority
    cy.fixture('work-orders/work-orders.json').then((workOrders) => {
      cy.intercept(
        { path: '/api/workOrders/?PageSize=10&PageNumber=1&Priorities=2' },
        workOrders.filter(
          (workOrder) => workOrder.priority === '2 [E] EMERGENCY'
        )
      )
    })

    // Work order with Plumbing and Purdys
    cy.fixture('work-orders/work-orders.json').then((workOrders) => {
      cy.intercept(
        {
          path:
            '/api/workOrders/?PageSize=10&PageNumber=1&TradeCodes=PL&ContractorReference=PCL',
        },
        workOrders.filter(
          (workOrder) =>
            workOrder.tradeCode === 'PL' &&
            workOrder.owner === 'Purdy Contracts (P) Ltd'
        )
      )
    })
  })

  context('When logged in as a contract manager', () => {
    beforeEach(() => {
      cy.loginWithContractManagerRole()
      cy.visit('/')
    })

    it('Filter work orders', () => {
      // Status filter options
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      // Variation pending approval selected by default
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.30"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1080"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1090"]')
        .should('not.be.checked')
      cy.get('.status-filters').within(() => {
        cy.contains('Show all 7')
      })

      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.3"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.4"]')
        .should('not.be.checked')
      // Contractor filter options
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.AVP"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.PCL"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.SCC"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.H01"]')
        .should('not.be.checked')
      // Trade filter options
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.AD"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.CA"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.CP"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.DE"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.EL"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.PL"]')
        .should('not.be.checked')
      cy.get('.trade-filters').within(() => {
        cy.contains('Show all 6')
      })

      // Selected filters summary
      cy.get('.selected-filters').within(() => {
        cy.contains('Clear filters')
        cy.contains('Save selected filters as my default preset')
        cy.contains('Remove saved default filter preset')

        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').within(() => {
          cy.contains('Variation Pending Approval')
        })
        cy.get('#selected-filters-Priority').should('not.exist')
        cy.get('#selected-filters-Trade').should('not.exist')
      })

      // Only variation pending approval work orders are displayed
      cy.get('[data-ref=10000030]').within(() => {
        cy.contains('Variation Pending Approval')
      })
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000040]').should('not.exist')
      cy.get('[data-ref=10000032]').should('not.exist')

      // Remove variation pending approval filter
      cy.get('.govuk-checkboxes').find('[name="StatusCode.90"]').uncheck()
      cy.get('[type="submit"]').contains('Apply filters').click()

      // Expect all work orders to be displayed
      cy.get('[data-ref=10000040]')
      cy.get('[data-ref=10000035]')
      cy.get('[data-ref=10000036]')
      cy.get('[data-ref=10000037]')
      cy.get('[data-ref=10000030]')
      cy.get('[data-ref=10000032]')

      // Filter by work order complete
      cy.get('.govuk-checkboxes').find('[name="StatusCode.50"]').check()
      cy.get('[type="submit"]').contains('Apply filters').click()

      cy.get('[data-ref=10000037]').within(() => {
        cy.contains('Work complete')
      })
      cy.get('[data-ref=10000036]').within(() => {
        cy.contains('Work complete')
      })
      cy.get('[data-ref=10000030]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000040]').should('not.exist')
      cy.get('[data-ref=10000032]').should('not.exist')

      cy.url().should('contains', '/?pageNumber=1&StatusCode=50')

      // Filter by work order complete and Variation Pending Approval
      cy.get('.govuk-checkboxes').find('[name="StatusCode.90"]').check()
      cy.get('[type="submit"]').contains('Apply filters').click()

      cy.get('[data-ref=10000037]').within(() => {
        cy.contains('Work complete')
      })
      cy.get('[data-ref=10000036]').within(() => {
        cy.contains('Work complete')
      })
      cy.get('[data-ref=10000030]').within(() => {
        cy.contains('Variation Pending Approval')
      })
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000040]').should('not.exist')

      cy.url().should('contains', '/?pageNumber=1&StatusCode=50&StatusCode=90')

      // Remove filter by work order complete
      cy.get('.govuk-checkboxes').find('[name="StatusCode.50"]').uncheck()
      cy.get('[type="submit"]').contains('Apply filters').click()

      cy.get('[data-ref=10000030]').within(() => {
        cy.contains('Variation Pending Approval')
      })
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000040]').should('not.exist')

      cy.url().should('contains', '/?pageNumber=1&StatusCode=90')

      // Add filter by work order in progress and emergency priority
      cy.get('.govuk-checkboxes').find('[name="StatusCode.80"]').check()
      cy.get('.govuk-checkboxes').find('[name="Priorities.2"]').check()
      cy.get('[type="submit"]').contains('Apply filters').click()

      cy.get('[data-ref=10000040]').within(() => {
        cy.contains('In progress')
        cy.contains('2 [E] EMERGENCY')
      })
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')
      cy.get('[data-ref=10000032]').should('not.exist')

      cy.url().should(
        'contains',
        '/?pageNumber=1&StatusCode=80&StatusCode=90&Priorities=2'
      )

      // Navigate directly to URL with query parameters
      cy.visit('/?pageNumber=1&StatusCode=50&StatusCode=90')

      cy.get('[data-ref=10000037]').within(() => {
        cy.contains('Work complete')
      })
      cy.get('[data-ref=10000036]').within(() => {
        cy.contains('Work complete')
      })
      cy.get('[data-ref=10000030]').within(() => {
        cy.contains('Variation Pending Approval')
      })
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000040]').should('not.exist')

      // Expect only work complete and Variation Pending Approval filter checkbox to be selected
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.30"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1080"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1090"]')
        .should('not.be.checked')

      // Filter by work cancelled (30) - expect to see no work orders
      cy.get('.govuk-checkboxes').find('[name="StatusCode.50"]').uncheck()
      cy.get('.govuk-checkboxes').find('[name="StatusCode.90"]').uncheck()
      cy.get('.govuk-checkboxes').find('[name="StatusCode.30"]').check()
      cy.get('[type="submit"]').contains('Apply filters').click()

      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000040]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')
      cy.get('[data-ref=10000032]').should('not.exist')

      cy.url().should('contains', '/?pageNumber=1&StatusCode=30')

      // Navigate to url directly again with emergency priority query parameter
      cy.visit('/?pageNumber=1&StatusCode=80&StatusCode=90&Priorities=2')

      cy.get('[data-ref=10000040]').within(() => {
        cy.contains('In progress')
        cy.contains('2 [E] EMERGENCY')
      })
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')
      cy.get('[data-ref=10000032]').should('not.exist')

      // Expect only work in progress, Variation Pending Approval and emergency filter checkbox to be selected
      // Status filter options
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.30"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1080"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1090"]')
        .should('not.be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.3"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.4"]')
        .should('not.be.checked')

      // Uncheck all status options and now we should see all emergency work orders
      cy.get('.govuk-checkboxes').find('[name="StatusCode.90"]').uncheck()
      cy.get('.govuk-checkboxes').find('[name="StatusCode.80"]').uncheck()
      cy.get('[type="submit"]').contains('Apply filters').click()

      // Only emergency priority work orders
      cy.get('[data-ref=10000040]').within(() => {
        cy.contains('2 [E] EMERGENCY')
      })
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')
      cy.get('[data-ref=10000032]').should('not.exist')

      // Uncheck emergency checkbox and now we should see all the work orders
      cy.get('.govuk-checkboxes').find('[name="Priorities.2"]').uncheck()
      cy.get('[type="submit"]').contains('Apply filters').click()

      // All work orders
      cy.get('[data-ref=10000040]')
      cy.get('[data-ref=10000035]')
      cy.get('[data-ref=10000036]')
      cy.get('[data-ref=10000037]')
      cy.get('[data-ref=10000030]')
      cy.get('[data-ref=10000032]')

      cy.url().should('contains', '/?pageNumber=1')

      // Filter by trade and contractor
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.PCL"]')
        .check()
      cy.get('.trade-filters').within(() => {
        cy.contains('Show all 6').click()
      })
      cy.get('.govuk-checkboxes').find('[name="TradeCodes.PL"]').check()
      cy.get('[type="submit"]').contains('Apply filters').click()

      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.PCL"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.PL"]')
        .should('be.checked')

      // Plumbing trade and Purdy contractor work orders
      cy.get('[data-ref=10000040]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')
      cy.get('[data-ref=10000032]')
    })

    it('Clears all filters', () => {
      // Check a few filter options
      cy.get('.govuk-checkboxes').find('[name="StatusCode.90"]').check()
      cy.get('.govuk-checkboxes').find('[name="StatusCode.80"]').check()
      cy.get('.govuk-checkboxes').find('[name="Priorities.2"]').check()
      cy.get('[type="submit"]').contains('Apply filters').click()

      // Selected filters summary
      cy.get('.selected-filters').within(() => {
        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').within(() => {
          cy.contains('Variation Pending Approval')
          cy.contains('In Progress')
        })
        cy.get('#selected-filters-Priority').within(() => {
          cy.contains('Emergency')
        })
        cy.get('#selected-filters-Trade').should('not.exist')
      })

      cy.get('[data-ref=10000040]').within(() => {
        cy.contains('In progress')
        cy.contains('2 [E] EMERGENCY')
      })
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')

      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.30"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1080"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1090"]')
        .should('not.be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.3"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.4"]')
        .should('not.be.checked')

      cy.contains('Clear filters').click()

      // Selected filters summary
      cy.get('.selected-filters').within(() => {
        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').should('not.exist')
        cy.get('#selected-filters-Priority').should('not.exist')
        cy.get('#selected-filters-Trade').should('not.exist')

        cy.contains('You have no selected filters')
      })

      // All work orders now appear
      cy.get('[data-ref=10000040]')
      cy.get('[data-ref=10000035]')
      cy.get('[data-ref=10000036]')
      cy.get('[data-ref=10000037]')
      cy.get('[data-ref=10000030]')

      // All filter options are unchecked
      // Status filter options
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.30"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1080"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1090"]')
        .should('not.be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.3"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.4"]')
        .should('not.be.checked')

      cy.url().should('contains', '/?pageNumber=1')
    })
  })

  context('When logged in as an authorisation manager', () => {
    beforeEach(() => {
      // Stub authorisation pending approval work order (1010)
      cy.fixture('work-orders/work-orders.json').then((workOrders) => {
        cy.intercept(
          { path: '/api/workOrders/?PageSize=10&PageNumber=1&StatusCode=1010' },
          workOrders.filter(
            (workOrder) => workOrder.status === 'Authorisation Pending Approval'
          )
        )
      })

      cy.loginWithAuthorisationManagerRole()
      cy.visit('/')
    })

    it('Has Authorisation Pending Approval work order filter selected by default', () => {
      // Status filter options
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.30"]')
        .should('not.be.checked')
      // Authorisation Pending Approval work order filter selected
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1010"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1080"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1090"]')
        .should('not.be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.3"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.4"]')
        .should('not.be.checked')
      // Contractor filter options
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.AVP"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.PCL"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.SCC"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.H01"]')
        .should('not.be.checked')
      // Trade filter options
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.AD"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.CA"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.CP"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.DE"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.EL"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.PL"]')
        .should('not.be.checked')

      cy.get('[data-ref=10000032]').within(() => {
        cy.contains('Authorisation Pending Approval')
      })
      cy.get('[data-ref=10000040]').should('not.exist')
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')
    })
  })

  context('When logged in as a contractor in one contractor group', () => {
    beforeEach(() => {
      cy.fixture('filter/work-order.json').then((filters) => {
        filters.Contractors.splice(1)
        cy.intercept({ method: 'GET', path: '/api/filter/WorkOrder' }, filters)
      })

      cy.loginWithContractorRole()
      cy.visit('/')
    })

    it('Lists all filtering options with the exception of the contractors filter', () => {
      // No contractor filter
      cy.get('#contractor-filters').should('not.exist')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.AVP"]')
        .should('not.exist')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.PCL"]')
        .should('not.exist')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.SCC"]')
        .should('not.exist')
      cy.get('.govuk-checkboxes')
        .find('[name="ContractorReference.H01"]')
        .should('not.exist')

      // Status filter options (none selected by default)
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.30"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1010"]')
        .should('not.exist')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1080"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.1090"]')
        .should('not.be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.3"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.4"]')
        .should('not.be.checked')
      // Trade filter options (none selected by default)
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.AD"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.CA"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.CP"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.DE"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.EL"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="TradeCodes.PL"]')
        .should('not.be.checked')

      // Expect all work orders to be displayed
      cy.get('[data-ref=10000040]')
      cy.get('[data-ref=10000035]')
      cy.get('[data-ref=10000036]')
      cy.get('[data-ref=10000037]')
      cy.get('[data-ref=10000030]')
    })
  })

  context(
    'When logged in as a contractor in more than one contractor group',
    () => {
      beforeEach(() => {
        cy.loginWithMultipleContractorRole()
        cy.visit('/')
      })

      it('Lists all filtering options and displays contractors filter', () => {
        // Contractor filter options
        cy.get('#contractor-filters').should('exist')
        cy.get('.govuk-checkboxes')
          .find('[name="ContractorReference.AVP"]')
          .should('exist')
        cy.get('.govuk-checkboxes')
          .find('[name="ContractorReference.PCL"]')
          .should('exist')
        cy.get('.govuk-checkboxes')
          .find('[name="ContractorReference.SCC"]')
          .should('exist')
        cy.get('.govuk-checkboxes')
          .find('[name="ContractorReference.H01"]')
          .should('exist')

        // Status filter options (none selected by default)
        cy.get('.govuk-checkboxes')
          .find('[name="StatusCode.50"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="StatusCode.90"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="StatusCode.80"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="StatusCode.30"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="StatusCode.1010"]')
          .should('not.exist')
        cy.get('.govuk-checkboxes')
          .find('[name="StatusCode.1080"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="StatusCode.1090"]')
          .should('not.be.checked')
        // Priority filter options
        cy.get('.govuk-checkboxes')
          .find('[name="Priorities.1"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="Priorities.2"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="Priorities.3"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="Priorities.4"]')
          .should('not.be.checked')
        // Trade filter options (none selected by default)
        cy.get('.govuk-checkboxes')
          .find('[name="TradeCodes.AD"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="TradeCodes.CA"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="TradeCodes.CP"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="TradeCodes.DE"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="TradeCodes.EL"]')
          .should('not.be.checked')
        cy.get('.govuk-checkboxes')
          .find('[name="TradeCodes.PL"]')
          .should('not.be.checked')

        // Expect all work orders to be displayed
        cy.get('[data-ref=10000040]')
        cy.get('[data-ref=10000035]')
        cy.get('[data-ref=10000036]')
        cy.get('[data-ref=10000037]')
        cy.get('[data-ref=10000030]')
      })
    }
  )

  context('Saving and removing default filter options', () => {
    beforeEach(() => {
      cy.loginWithContractManagerRole()
    })

    it('Saves selected filters in localStorage as the default filter preset', () => {
      cy.visit('/?pageNumber=1&StatusCode=80&StatusCode=90&Priorities=2')
      cy.wait('@filters')
      cy.wait('@workOrdersInProgressVariationPendingApprovalEmergency')

      // Selected filters summary
      cy.get('.selected-filters').within(() => {
        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').within(() => {
          cy.contains('In Progress')
          cy.contains('Variation Pending Approval')
        })
        cy.get('#selected-filters-Priority').within(() => {
          cy.contains('Emergency')
        })
        cy.get('#selected-filters-Trade').should('not.exist')
      })

      // Save selected filters to localStorage
      cy.get('.selected-filters').within(() => {
        cy.contains('Save selected filters as my default preset')
          .click({ force: true })
          .then(() => {
            expect(
              localStorage.getItem('RH - default work order filters')
            ).to.equal(
              '{"pageNumber":"1","StatusCode":["80","90"],"Priorities":"2"}'
            )
            cy.on('window:confirm', (string) => {
              expect(string).to.equal(
                'Save my selected filters:\n  Status  [ In Progress , Variation Pending Approval ], Priority  [ Emergency ]  as the default preset?'
              )
            })
          })
      })

      cy.visit('/')

      // Selected filters summary
      // Expect saved default filters to be applied
      cy.get('.selected-filters').within(() => {
        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').within(() => {
          cy.contains('In Progress')
          cy.contains('Variation Pending Approval')
        })
        cy.get('#selected-filters-Priority').within(() => {
          cy.contains('Emergency')
        })
        cy.get('#selected-filters-Trade').should('not.exist')
      })

      cy.get('[data-ref=10000040]').within(() => {
        cy.contains('In progress')
        cy.contains('2 [E] EMERGENCY')
      })
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000030]').should('not.exist')

      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('be.checked')
    })

    it('Removes selected default filters from localStorage', () => {
      localStorage.setItem(
        'RH - default work order filters',
        '{"pageNumber":"1","StatusCode":["80","90"],"Priorities":"2"}'
      )
      cy.visit('/')
      cy.wait('@filters')

      // Save selected filters to localStorage
      cy.get('.selected-filters').within(() => {
        cy.contains('Remove saved default filter preset')
          .click({ force: true })
          .then(() => {
            expect(
              localStorage.getItem('RH - default work order filters')
            ).to.equal(null)
            cy.on('window:confirm', (string) => {
              expect(string).to.equal('Remove my default saved filters?')
            })
          })
      })

      cy.visit('/')

      // Selected filters summary
      cy.get('.selected-filters').within(() => {
        cy.get('#selected-filters-Contractor').should('not.exist')
        cy.get('#selected-filters-Status').within(() => {
          cy.contains('In Progress').should('not.exist')
          // Default filter for contract managers still applied
          cy.contains('Variation Pending Approval')
        })
        cy.get('#selected-filters-Priority').should('not.exist')
        cy.get('#selected-filters-Trade').should('not.exist')
      })

      cy.get('[data-ref=10000040]').should('not.exist')
      cy.get('[data-ref=10000037]').should('not.exist')
      cy.get('[data-ref=10000036]').should('not.exist')
      cy.get('[data-ref=10000035]').should('not.exist')
      cy.get('[data-ref=10000030]').within(() => {
        cy.contains('Variation Pending Approval')
      })

      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.50"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.90"]')
        .should('be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="StatusCode.80"]')
        .should('not.be.checked')
      // Priority filter options
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.1"]')
        .should('not.be.checked')
      cy.get('.govuk-checkboxes')
        .find('[name="Priorities.2"]')
        .should('not.be.checked')
    })
  })
})
