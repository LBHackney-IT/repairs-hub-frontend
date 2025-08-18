/// <reference types="cypress" />
import 'cypress-audit/commands'

describe('Contract manager can authorise variation', () => {
  beforeEach(() => {
    cy.loginWithContractManagerRole()

    cy.fixture('hubUser/user.json').then((user) => {
      user.varyLimit = 20000
      cy.intercept('GET', 'api/hub-user', user)
    })

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012' },
      { fixture: 'workOrders/statusVariationPendingApproval.json' }
    ).as('workOrderRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/appointments/10000012' },
      {
        fixture: 'workOrderAppointments/noAppointment.json',
      }
    )

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/variation-tasks' },
      { fixture: 'workOrders/variationTasks.json' }
    ).as('variationTasksRequest')

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/tasks' },
      { fixture: 'workOrders/tasksAndSors.json' }
    ).as('tasksAndSorsRequest')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
      },
      { body: [] }
    ).as('workOrdersRequest')

    cy.intercept(
      { method: 'POST', url: '/api/jobStatusUpdate' },
      { body: '' }
    ).as('apiCheck')
  })

  it('Rejects work order variation with a confirmation step', () => {
    cy.visit('/work-orders/10000012')

    cy.wait(['@workOrderRequest', '@tasksAndSorsRequest', '@propertyRequest'])

    cy.get('[data-testid="details"]')
      .contains('Variation Authorisation')
      .click({ force: true })

    cy.get('.govuk-grid-column-one-third')
      .contains('a', 'Variation Authorisation')
      .should(
        'have.attr',
        'href',
        '/work-orders/10000012/variation-authorisation'
      )
      .click()

    cy.wait([
      '@workOrderRequest',
      '@tasksAndSorsRequest',
      '@variationTasksRequest',
    ])

    cy.contains('Authorisation variation request: 10000012')

    cy.get('Add notes').should('not.exist')

    cy.get('[type="radio"]').check('Reject request')

    cy.contains('Add notes')

    cy.get('[type="submit"]').contains('Continue').click({ force: true })

    cy.contains('Please add notes')

    cy.get('#note').type('Can not approve it')

    cy.get('[type="submit"]').contains('Continue').click({ force: true })

    cy.contains('You are rejecting the variation request')

    cy.get('[type="submit"]').contains('Submit').click({ force: true })

    cy.wait('@apiCheck', { requestTimeout: 8000 })
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000012',
        },
        comments: 'Variation rejected: Can not approve it',
        typeCode: '125',
      })

    cy.get('.lbh-page-announcement').within(() => {
      cy.get('.lbh-page-announcement__title').contains(
        'Variation request rejected'
      )
      cy.get('.lbh-page-announcement__content').within(() => {
        cy.contains('Reference number')
        cy.contains('10000012')
      })
    })
    // Actions to see relevant pages
    cy.get('.lbh-list').within(() => {
      cy.contains(
        'Raise a new work order for 16 Pitcairn House St Thomass Square'
      ).should('have.attr', 'href', '/properties/00012345/raise-repair/new')

      cy.contains('Manage work orders').should('have.attr', 'href', '/')

      cy.contains('View work order').should(
        'have.attr',
        'href',
        '/work-orders/10000012'
      )
    })
  })

  it('Approves work order variation without a confirmation step', () => {
    cy.visit('/work-orders/10000012')

    cy.wait(['@workOrderRequest', '@tasksAndSorsRequest', '@propertyRequest'])

    cy.get('[data-testid="details"]')
      .contains('Variation Authorisation')
      .click({ force: true })

    cy.get('.govuk-grid-column-one-third')
      .contains('a', 'Variation Authorisation')
      .should(
        'have.attr',
        'href',
        '/work-orders/10000012/variation-authorisation'
      )
      .click()

    cy.wait([
      '@workOrderRequest',
      '@tasksAndSorsRequest',
      '@variationTasksRequest',
    ])

    cy.contains('Authorisation variation request: 10000012')

    cy.url().should('contains', '/work-orders/10000012/variation-authorisation')

    // When click approve default comments appear
    cy.get('[type="radio"]').check('Approve request')
    cy.get('[type="submit"]').contains('Submit').click({ force: true })

    cy.wait('@apiCheck', { requestTimeout: 8000 })

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000012',
        },
        typeCode: '100-20',
      })

    // Confirmation screen
    cy.get('.lbh-page-announcement').within(() => {
      cy.get('.lbh-page-announcement__title').contains(
        'Variation request approved'
      )
      cy.get('.lbh-page-announcement__content').within(() => {
        cy.contains('Reference number')
        cy.contains('10000012')
      })
    })

    cy.get('.lbh-list').within(() => {
      cy.contains('Manage work orders').should('have.attr', 'href', '/')

      cy.contains('View work order').should(
        'have.attr',
        'href',
        '/work-orders/10000012'
      )
    })
  })

  it('Shows summary page and calculation of variation cost', () => {
    cy.visit('/work-orders/10000012')

    cy.wait(['@workOrderRequest', '@tasksAndSorsRequest', '@propertyRequest'])

    cy.get('[data-testid="details"]')
      .contains('Variation Authorisation')
      .click({ force: true })

    cy.get('.govuk-grid-column-one-third')
      .contains('a', 'Variation Authorisation')
      .should(
        'have.attr',
        'href',
        '/work-orders/10000012/variation-authorisation'
      )
      .click()

    cy.wait([
      '@workOrderRequest',
      '@tasksAndSorsRequest',
      '@variationTasksRequest',
    ])

    cy.contains('Authorisation variation request: 10000012')
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
      cy.contains('td', 'Increase')
      cy.contains('td', 'DES5R005')
      cy.contains('p', 'Normal Call outs')
      cy.contains('td', '£4')
      cy.contains('td', '1')
      cy.contains('td', '£4')
      cy.contains('td', '4000')
      cy.contains('td', '£1600')

      //Reduced task
      cy.contains('td', 'Reduced')
      cy.contains('td', 'DES5R006')
      cy.contains('p', 'Normal Call outs')
      cy.contains('td', '£19')
      cy.contains('td', '10')
      cy.contains('td', '£190')
      cy.contains('td', '2')
      cy.contains('td', '£38')

      //New task
      cy.contains('td', 'Reduced')
      cy.contains('td', 'DES5R007')
      cy.contains('p', 'Normal Call outs')
      cy.contains('td', '£25')
      cy.contains('td', '0')
      cy.contains('td', '£0')
      cy.contains('td', '2')
      cy.contains('td', '£50')

      //Unchanged task
      cy.contains('td', 'Unchanged')
      cy.contains('td', 'DES5R006')
      cy.contains('p', 'Normal Call outs')
      cy.contains('td', '£10')
      cy.contains('td', '1')
      cy.contains('td', '£10')
      cy.contains('td', '1')
      cy.contains('td', '£10')
    })

    // Cost calculation
    cy.get('.calculated-cost').within(() => {
      cy.get('#cost-before-variation').within(() => {
        cy.contains('Budget code – Subjective:')
        cy.contains('H2555 - 200108 Gutter Clearance')
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

  it('Cannot approve variation if it is over my vary spend limit', () => {
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/10000012/variation-tasks' },
      { fixture: 'workOrders/highCostVariationTask.json' }
    ).as('highCostVariationTasks')

    cy.visit('/work-orders/10000012/variation-authorisation')

    cy.wait([
      '@workOrderRequest',
      '@tasksAndSorsRequest',
      '@highCostVariationTasks',
    ])

    cy.contains('Authorisation variation request: 10000012')

    cy.get('.govuk-warning-text.lbh-warning-text').contains(
      'Work order is over your vary limit of £20000, please contact a manager to approve. You can still reject the variation request.'
    )

    cy.get('[type="radio"]').contains('Approve request').should('not.exist')
    cy.get('[type="radio"]').check('Reject request')

    // Rejects with comments post request goes through
    cy.get('#note').type('Can not approve it')
    cy.get('[type="submit"]').contains('Continue').click({ force: true })
    cy.get('[type="submit"]').contains('Submit').click({ force: true })

    cy.wait('@apiCheck', { requestTimeout: 8000 })

    cy.get('@apiCheck')
      .its('request.body')
      .should('deep.equal', {
        relatedWorkOrderReference: {
          id: '10000012',
        },
        comments: 'Variation rejected: Can not approve it',
        typeCode: '125',
      })

    // Confirmation screen
    cy.get('.lbh-page-announcement').within(() => {
      cy.get('.lbh-page-announcement__title').contains(
        'Variation request rejected'
      )
      cy.get('.lbh-page-announcement__content').within(() => {
        cy.contains('Reference number')
        cy.contains('10000012')
      })
    })

    cy.get('.lbh-list').within(() => {
      cy.contains(
        'Raise a new work order for 16 Pitcairn House St Thomass Square'
      ).should('have.attr', 'href', '/properties/00012345/raise-repair/new')

      cy.contains('Manage work orders').should('have.attr', 'href', '/')

      cy.contains('View work order').should(
        'have.attr',
        'href',
        '/work-orders/10000012'
      )
    })
  })

  it('Shows summary page and calculation of variation cost with collapsible content', () => {
    cy.visit('/work-orders/10000012')

    cy.wait(['@workOrderRequest', '@tasksAndSorsRequest', '@propertyRequest'])

    cy.get('[data-testid="details"]')
      .contains('Variation Authorisation')
      .click({ force: true })

    cy.get('.govuk-grid-column-one-third')
      .contains('a', 'Variation Authorisation')
      .should(
        'have.attr',
        'href',
        '/work-orders/10000012/variation-authorisation'
      )
      .click()

    cy.wait([
      '@workOrderRequest',
      '@tasksAndSorsRequest',
      '@variationTasksRequest',
    ])

    cy.contains('Authorisation variation request: 10000012')
    cy.contains('Summary of Tasks and SORs')

    //collapse
    cy.get('.original-sors').click()
    cy.contains('.original-sor-summary').should('not.exist')

    cy.get('.updated-sors').click()
    cy.contains('.updated-tasks-table').should('not.exist')

    //un-collapse
    cy.get('.original-sors').click()
    cy.get('.original-sor-summary td').contains('DES5R006 - Urgent call outs')
    cy.get('.original-sor-summary td').contains('1')
    cy.get('.original-sor-summary td').contains('£10')

    cy.get('.updated-sors').click()

    // Increased task
    cy.get('.updated-tasks-table td').contains('Increase')
    cy.get('.updated-tasks-table td').contains('DES5R005')
    cy.get('.updated-tasks-table p').contains('Normal Call outs')
    cy.get('.updated-tasks-table td').contains('£4')
    cy.get('.updated-tasks-table td').contains('1')
    cy.get('.updated-tasks-table td').contains('£4')
    cy.get('.updated-tasks-table td').contains('4000')
    cy.get('.updated-tasks-table td').contains('£1600')

    //Reduced task
    cy.get('.updated-tasks-table td').contains('Reduced')
    cy.get('.updated-tasks-table td').contains('DES5R006')
    cy.get('.updated-tasks-table p').contains('Normal Call outs')
    cy.get('.updated-tasks-table td').contains('£19')
    cy.get('.updated-tasks-table td').contains('10')
    cy.get('.updated-tasks-table td').contains('£190')
    cy.get('.updated-tasks-table td').contains('2')
    cy.get('.updated-tasks-table td').contains('£38')

    //New task
    cy.get('.updated-tasks-table td').contains('Reduced')
    cy.get('.updated-tasks-table td').contains('DES5R007')
    cy.get('.updated-tasks-table p').contains('Normal Call outs')
    cy.get('.updated-tasks-table td').contains('£25')
    cy.get('.updated-tasks-table td').contains('0')
    cy.get('.updated-tasks-table td').contains('£0')
    cy.get('.updated-tasks-table td').contains('2')
    cy.get('.updated-tasks-table td').contains('£50')

    //Unchanged task
    cy.get('.updated-tasks-table td').contains('Unchanged')
    cy.get('.updated-tasks-table td').contains('DES5R006')
    cy.get('.updated-tasks-table p').contains('Normal Call outs')
    cy.get('.updated-tasks-table td').contains('£10')
    cy.get('.updated-tasks-table td').contains('1')
    cy.get('.updated-tasks-table td').contains('£10')
    cy.get('.updated-tasks-table td').contains('1')
    cy.get('.updated-tasks-table td').contains('£10')
  })
})
