describe('Close-WorkOrders', () => {
  it('Shows access denied when user doesnt have correct permissions', () => {
    cy.loginWithOperativeRole()
    cy.visit('/backoffice/close-workorders')

    cy.contains('Access denied')
  })

  it('Shows error messages when form fields invalid', () => {
    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/close-workorders')

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'Please enter a reason to close'
    )
    cy.get('.govuk-error-message.lbh-error-message').contains(
      'Please enter workOrder references'
    )
  })

  it('shows an error when date is empty', () => {
    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/close-workorders')

    cy.get('#selectedOption_CloseToBase').click()

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'Please enter a closed date'
    )
  })

  it('shows an error when the date is in the future', () => {
    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/close-workorders')

    cy.get('#selectedOption_CloseToBase').click()

    const futureDate = '3023-01-01'
    cy.get('[data-testid="ClosedDate"]').type(futureDate)

    cy.get("[data-test='submit-button']").click()

    cy.get('.govuk-error-message.lbh-error-message').contains(
      'The closed date cannot be in the future'
    )
  })

  it('sends request to /cancel', () => {
    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/close-workorders')

    const workOrderReference = '11111111'
    const reasonToClose = 'Blah blh blah'

    cy.intercept(
      {
        method: 'POST',
        path: '/api/backOffice/bulk-close/cancel',
      },
      {
        body: {
          completionDate: '',
          reason: reasonToClose,
          workOrderReferences: [workOrderReference],
        },
      }
    ).as('cancelRequest')

    cy.get('[data-test="workOrderReferences"]').type(workOrderReference)
    cy.get('[data-test="reasonToClose"]').type(reasonToClose)

    // const futureDate = "3023-01-01"
    // cy.get('[data-testid="ClosedDate"]').type(futureDate)

    cy.get("[data-test='submit-button']").click()

    cy.wait('@cancelRequest')

    cy.contains('WorkOrders cancelled')
    cy.contains('Bulk-close workOrders')
  })

  it('sends request to /close-to-base', () => {
    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/close-workorders')

    const workOrderReference = '11111111'
    const reasonToClose = 'Blah blh blah'
    const closedDate = '2022-01-01'

    cy.intercept(
      {
        method: 'POST',
        path: '/api/backOffice/bulk-close/close-to-base',
      },
      {
        body: {
          completionDate: closedDate,
          reason: reasonToClose,
          workOrderReferences: [workOrderReference],
        },
      }
    ).as('cancelRequest')

    cy.get('#selectedOption_CloseToBase').click()

    cy.get('[data-test="workOrderReferences"]').type(workOrderReference)
    cy.get('[data-test="reasonToClose"]').type(reasonToClose)

    cy.get('[data-testid="ClosedDate"]').type(closedDate)

    cy.get("[data-test='submit-button']").click()

    cy.wait('@cancelRequest')

    cy.contains('WorkOrders cancelled')
    cy.contains('Bulk-close workOrders')
  })

  it("Resets the form when 'close more' button clicked", () => {
    cy.loginWithDataAdminRole()
    cy.visit('/backoffice/close-workorders')

    const workOrderReference = '11111111'
    const reasonToClose = 'Blah blh blah'
    const closedDate = '2022-01-01'

    cy.intercept(
      {
        method: 'POST',
        path: '/api/backOffice/bulk-close/close-to-base',
      },
      {
        body: {
          completionDate: closedDate,
          reason: reasonToClose,
          workOrderReferences: [workOrderReference],
        },
      }
    ).as('cancelRequest')

    cy.get('#selectedOption_CloseToBase').click()

    cy.get('[data-test="workOrderReferences"]').type(workOrderReference)
    cy.get('[data-test="reasonToClose"]').type(reasonToClose)

    cy.get('[data-testid="ClosedDate"]').type(closedDate)

    cy.get("[data-test='submit-button']").click()

    cy.wait('@cancelRequest')

    cy.get("[data-test='closeMoreButton']").click()

    cy.get('[data-test="workOrderReferences"]').should('be.empty')
    cy.get('[data-test="reasonToClose"]').should('be.empty')
    cy.get('[data-testid="ClosedDate"]').should('be.empty')
  })
})
