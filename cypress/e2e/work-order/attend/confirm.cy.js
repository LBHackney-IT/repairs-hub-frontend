describe('confirm close work order without a photo', () => {
  const workOrderReference = '10000621'
  const operativeId = '1234'

  beforeEach(() => {
    cy.intercept(
      { method: 'POST', path: '/api/workOrderComplete' },
      { body: '' }
    ).as('workOrderCompleteRequest')

    cy.intercept(
      { method: 'POST', path: '/api/feedback/close-work-order-without-photo' },
      { body: '' }
    ).as('submitFeedbackRequest')

    cy.loginWithOperativeRole()
  })

  it('shows status of closed work order', () => {
    cy.intercept(`/api/workOrders/${workOrderReference}`, {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.visit(
      `/operatives/${operativeId}/work-orders/${workOrderReference}/confirmation`
    )

    cy.contains('h1', `Work order ${workOrderReference} successfully closed`)
  })

  it('shows status of no access work order', () => {
    cy.intercept(`/api/workOrders/${workOrderReference}`, {
      fixture: 'workOrders/noAccessWorkOrder.json',
    }).as('noAccessWorkOrderRequest')

    cy.visit(
      `/operatives/${operativeId}/work-orders/${workOrderReference}/confirmation`
    )

    cy.contains(
      'h1',
      `Work order ${workOrderReference} successfully closed with no access`
    )
  })

  it('validates the form', () => {
    cy.intercept(`/api/workOrders/${workOrderReference}`, {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.visit(
      `/operatives/${operativeId}/work-orders/${workOrderReference}/confirmation`
    )

    // submit form
    cy.contains('button', 'Submit').click()

    // contains error
    cy.contains('Please select a reason')

    // select other
    cy.get("input[value='other']").check()
    cy.contains('button', 'Submit').click()

    cy.contains('Please select a reason').should('not.exist')

    // contains error
    cy.contains('Please give a reason')

    cy.get('[data-testid="comments"]').type('some comments')

    // submit form
    cy.contains('button', 'Submit').click()

    cy.wait('@submitFeedbackRequest')

    cy.contains('Please give a reason').should('not.exist')
  })

  it('submits the form', () => {
    cy.intercept(`/api/workOrders/${workOrderReference}`, {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.visit(
      `/operatives/${operativeId}/work-orders/${workOrderReference}/confirmation`
    )

    // submit form
    cy.get("input[value='uploadFailed']").check()
    cy.get('[data-testid="comments"]').type('some comments')

    cy.contains('button', 'Submit').click()

    cy.wait('@submitFeedbackRequest')

    cy.get('@submitFeedbackRequest').its('request.body').should('deep.equal', {
      uploadWasTakingTooLong: false,
      uploadFailed: true,
      photosWereNotNecessary: false,
      comments: 'some comments',
      workOrderId: workOrderReference,
    })

    // user redirected
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/')
    })
  })

  it('skips the form', () => {
    cy.intercept(`/api/workOrders/${workOrderReference}`, {
      fixture: 'workOrders/workOrder.json',
    }).as('workOrderRequest')

    cy.visit(
      `/operatives/${operativeId}/work-orders/${workOrderReference}/confirmation`
    )

    // click close button
    cy.contains('button', 'Close').click()

    // user redirected
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal('/')
    })
  })
})
