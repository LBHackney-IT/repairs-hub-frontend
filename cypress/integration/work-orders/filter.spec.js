/// <reference types="cypress" />

import 'cypress-audit/commands'
import { PAGE_SIZE_CONTRACTORS } from '../../../src/utils/frontend-api-client/repairs'

describe('Filter work orders', () => {
  // Stub work orders and work orders filter response
  beforeEach(() => {
    cy.loginWithContractorRole()
    cy.server()
    // Work order filters
    cy.fixture('filter/work-order.json').as('workOrderFilters')
    cy.route('GET', `api/filter/WorkOrder`, '@workOrderFilters')
    // All work orders
    cy.fixture('repairs/work-orders.json').as('workOrderslist')
    cy.route(
      'GET',
      `api/repairs/?PageSize=${PAGE_SIZE_CONTRACTORS}&PageNumber=1`,
      '@workOrderslist'
    )
    // No work orders for work cancelled
    cy.route(
      'GET',
      `api/repairs/?PageSize=${PAGE_SIZE_CONTRACTORS}&PageNumber=1&StatusCode=30`,
      []
    )
    // Work complete (50)
    cy.fixture('repairs/work-orders.json')
      .then((workOrders) => {
        return workOrders.filter(
          (workOrder) => workOrder.status === 'Work complete'
        )
      })
      .as('workComplete')
    cy.route(
      'GET',
      `api/repairs/?PageSize=${PAGE_SIZE_CONTRACTORS}&PageNumber=1&StatusCode=50`,
      '@workComplete'
    )
    // Pending Approval (90)
    cy.fixture('repairs/work-orders.json')
      .then((workOrders) => {
        return workOrders.filter(
          (workOrder) => workOrder.status === 'Pending Approval'
        )
      })
      .as('pendingApproval')
    cy.route(
      'GET',
      `api/repairs/?PageSize=${PAGE_SIZE_CONTRACTORS}&PageNumber=1&StatusCode=90`,
      '@pendingApproval'
    )
    // Work Complete (50) and Pending Approval (90)
    cy.fixture('repairs/work-orders.json')
      .then((workOrders) => {
        return workOrders.filter(
          (workOrder) =>
            workOrder.status === 'Work complete' ||
            workOrder.status === 'Pending Approval'
        )
      })
      .as('workCompleteAndPendingApproval')
    cy.route(
      'GET',
      `api/repairs/?PageSize=${PAGE_SIZE_CONTRACTORS}&PageNumber=1&StatusCode=50&StatusCode=90`,
      '@workCompleteAndPendingApproval'
    )

    cy.visit(`${Cypress.env('HOST')}/`)
  })

  it('Filters by work order status', () => {
    // Expect all work orders to be displayed
    cy.get('[data-ref=10000040]')
    cy.get('[data-ref=10000035]')
    cy.get('[data-ref=10000036]')
    cy.get('[data-ref=10000037]')
    cy.get('[data-ref=10000030]')

    // Expand filter component
    cy.get('.govuk-details__summary-text').contains('Filters').click()
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
      .find('[name="StatusCode.70"]')
      .should('not.be.checked')
    cy.get('.govuk-checkboxes')
      .find('[name="StatusCode.110"]')
      .should('not.be.checked')
    cy.get('.govuk-checkboxes')
      .find('[name="StatusCode.1080"]')
      .should('not.be.checked')
    cy.get('.govuk-checkboxes')
      .find('[name="StatusCode.1090"]')
      .should('not.be.checked')

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

    cy.url().should('contains', '/?pageNumber=1&StatusCode=50')

    // Filter by work order complete and pending approval
    cy.get('.govuk-checkboxes').find('[name="StatusCode.90"]').check()
    cy.get('[type="submit"]').contains('Apply filters').click()

    cy.get('[data-ref=10000037]').within(() => {
      cy.contains('Work complete')
    })
    cy.get('[data-ref=10000036]').within(() => {
      cy.contains('Work complete')
    })
    cy.get('[data-ref=10000030]').within(() => {
      cy.contains('Pending Approval')
    })
    cy.get('[data-ref=10000035]').should('not.exist')
    cy.get('[data-ref=10000040]').should('not.exist')

    cy.url().should('contains', '/?pageNumber=1&StatusCode=50&StatusCode=90')

    // Remove filter by work order complete
    cy.get('.govuk-checkboxes').find('[name="StatusCode.50"]').uncheck()
    cy.get('[type="submit"]').contains('Apply filters').click()

    cy.get('[data-ref=10000030]').within(() => {
      cy.contains('Pending Approval')
    })
    cy.get('[data-ref=10000037]').should('not.exist')
    cy.get('[data-ref=10000036]').should('not.exist')
    cy.get('[data-ref=10000035]').should('not.exist')
    cy.get('[data-ref=10000040]').should('not.exist')

    cy.url().should('contains', '/?pageNumber=1&StatusCode=90')

    // Navigate directly to URL with query parameters
    cy.visit(`${Cypress.env('HOST')}/?pageNumber=1&StatusCode=50&StatusCode=90`)

    cy.get('[data-ref=10000037]').within(() => {
      cy.contains('Work complete')
    })
    cy.get('[data-ref=10000036]').within(() => {
      cy.contains('Work complete')
    })
    cy.get('[data-ref=10000030]').within(() => {
      cy.contains('Pending Approval')
    })
    cy.get('[data-ref=10000035]').should('not.exist')
    cy.get('[data-ref=10000040]').should('not.exist')

    // Expect only work complete and pending approval filter checkbox to be selected
    cy.get('.govuk-details__summary-text').contains('Filters').click()
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
      .find('[name="StatusCode.70"]')
      .should('not.be.checked')
    cy.get('.govuk-checkboxes')
      .find('[name="StatusCode.110"]')
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

    cy.url().should('contains', '/?pageNumber=1&StatusCode=30')

    // Uncheck all and now we should see all work orders
    cy.get('.govuk-checkboxes').find('[name="StatusCode.30"]').uncheck()
    cy.get('[type="submit"]').contains('Apply filters').click()

    cy.get('[data-ref=10000040]')
    cy.get('[data-ref=10000035]')
    cy.get('[data-ref=10000036]')
    cy.get('[data-ref=10000037]')
    cy.get('[data-ref=10000030]')

    cy.url().should('contains', '/?pageNumber=1')
  })
})
