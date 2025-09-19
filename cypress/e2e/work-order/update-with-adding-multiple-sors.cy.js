describe('Updating a work order', () => {
  context('Adding multiple SORs', () => {
    beforeEach(() => {
      cy.loginWithContractorRole()

      cy.fixture('workOrders/workOrder.json')
        .then((workOrder) => {
          workOrder.reference = 10000040
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000040' },
            { body: workOrder }
          )
        })
        .as('workOrder')

      cy.fixture('workOrders/tasksAndSors.json')
        .then((tasksAndSors) => {
          tasksAndSors.splice(1, 2)

          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000040/tasks' },
            { body: tasksAndSors }
          )
        })
        .as('taskListRequest')

      cy.intercept(
        { method: 'GET', path: '/api/contractors/*' },
        { fixture: 'contractor/contractor.json' }
      ).as('contractorRequest')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/schedule-of-rates/codes?tradeCode=DE&propertyReference=00012345&contractorReference=SCC&showAdditionalTrades=true',
        },
        { fixture: 'scheduleOfRates/codes.json' }
      ).as('sorCodesRequest')
    })

    it('allows adding multiple SORs', () => {
      cy.visit('/work-orders/10000040/update')

      cy.wait(['@taskListRequest', '@workOrder'])

      cy.get('#repair-request-form').within(() => {
        cy.contains('+ Add multiple SOR codes').click()
      })

      cy.get('#repair-request-form').should('not.exist')

      cy.contains('Add multiple SOR codes')
      cy.get('#adding-multiple-sors-form').within(() => {
        cy.contains('Enter SOR codes as a list:')
      })
    })

    it('throws an error', () => {
      cy.visit('/work-orders/10000040/update')

      cy.wait(['@taskListRequest', '@workOrder'])

      cy.get('#repair-request-form').within(() => {
        cy.contains('+ Add multiple SOR codes').click()
      })

      //when submitting without entering SOR codes
      cy.get('#adding-multiple-sors-form').within(() => {
        cy.contains('Enter SOR codes as a list:')
        cy.contains('Submit').click()
        cy.contains('Please enter SOR codes')
      })
    })
  })
})
