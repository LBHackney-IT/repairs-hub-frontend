/// <reference types="cypress" />

const now = new Date('2022-02-11T12:00:00')

describe('Raise repair form', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/simple-feature-toggle',
      },
      {
        body: {},
      }
    ).as('feature-toggle')

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/contact-details/4552c539-2e00-8533-078d-9cc59d9115da',
      },
      { fixture: 'contactDetails/contactDetails.json' }
    ).as('contactDetailsRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/contractors?propertyReference=00012345&tradeCode=PL',
      },
      { fixture: 'contractors/contractors.json' }
    ).as('contractorsRequest')

    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/priorities' },
      { fixture: 'scheduleOfRates/priorities.json' }
    ).as('sorPrioritiesRequest')

    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/trades?propRef=00012345' },
      { fixture: 'scheduleOfRates/trades.json' }
    ).as('tradesRequest')

    cy.intercept(
      { method: 'GET', path: '/api/contractors/*' },
      { fixture: 'contractor/contractor.json' }
    ).as('contractorRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/properties/00012345/alerts',
      },
      {
        body: {
          alerts: [
            {
              type: 'type1',
              comments: 'Alert 1',
            },
            {
              type: 'SPR',
              comments: 'Specific Requirements',
              reason: 'Reason 1, very important',
            },
          ],
        },
      }
    ).as('alerts')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders?*',
      },
      { body: [] }
    ).as('workOrdersRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders/budget-codes*',
      },
      { fixture: 'scheduleOfRates/budgetCodes.json' }
    ).as('budgetCodesRequest')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=*&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
    ).as('sorCodesRequest')

    cy.intercept(
      { method: 'POST', path: '/api/workOrders/schedule' },
      {
        body: {
          id: 10102030,
          statusCode: 200,
          statusCodeDescription: '???',
          externallyManagedAppointment: false,
        },
      }
    ).as('apiCheck')

    cy.clock(now, ['Date'])
  })

  context('as a user with an agent role only', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('does not allow budget code selection', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait('@contractorsRequest')

        cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

        cy.get('[data-testid=budgetCode]').should('not.exist')

        cy.get('input[id="rateScheduleItems[0][code]"]').clear()
        cy.get('input[id="rateScheduleItems[0][code]"]').type(
          'DES5R003 - Immediate call outs - £0'
        )

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
        cy.get('input[id="rateScheduleItems[0][quantity]"]').type('1')

        cy.get('[data-testid="reasonForRepair"]').select('None of the above')

        cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')

        cy.get('[data-testid=callerName]').type('Test Caller')
        cy.get('[data-testid=contactNumber]').type('12345678910')

        cy.get('[type="submit"]').contains('Create work order').click()
      })

      cy.wait('@apiCheck').then(({ request }) => {
        cy.wrap(request.body).should('not.have.property', 'budgetCode')
      })
    })
  })

  context('When property is in legal disrepair', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
        { fixture: 'properties/propertyInLegalDisrepair.json' }
      ).as('propertyInLegalDisrepair')
    })

    it('Shows warning text', () => {
      cy.loginWithAgentRole()

      cy.visit('/properties/00012345')

      cy.wait(['@propertyRequest', '@workOrdersRequest'])

      cy.contains('a', 'Raise a work order on this dwelling').click()

      cy.wait([
        '@propertyRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
        '@propertyInLegalDisrepair',
      ])

      cy.contains('This property is currently under legal disrepair')
      cy.contains(
        'Before raising a work order you must call the Legal Disrepair Team'
      )
    })
  })

  context(
    'When property is not in legal desrepair and request response has body false',
    () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
          { body: { propertyIsInLegalDisrepair: false } }
        ).as('propertyInLegalDisrepair')
      })

      it('Does not show warning text', () => {
        cy.loginWithAgentRole()

        cy.visit('/properties/00012345')

        cy.wait(['@propertyRequest', '@workOrdersRequest'])

        cy.contains('a', 'Raise a work order on this dwelling').click()

        cy.wait([
          '@propertyRequest',
          '@sorPrioritiesRequest',
          '@tradesRequest',
          '@propertyInLegalDisrepair',
        ])

        cy.get('[data-testid=over-spend-limit]').should('not.exist')
      })
    }
  )

  context('When legal disrepair request returns an error', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
        {
          statusCode: 404,
          body: {
            message: 'Cannot fetch legal disrepairs',
          },
        }
      ).as('propertyInLegalDisrepairError')
    })

    it('Shows a custom error message for legal disrepair', () => {
      cy.loginWithAgentRole()

      cy.visit('/properties/00012345')

      cy.wait(['@propertyRequest', '@workOrdersRequest'])

      cy.contains('a', 'Raise a work order on this dwelling').click()

      cy.wait([
        '@propertyRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
        '@propertyInLegalDisrepairError',
      ])

      cy.get('[data-testid=over-spend-limit]').should('not.exist')
      cy.contains(
        'Error loading legal disrepair status: 404 with message: Cannot fetch legal disrepairs'
      )
    })
  })

  context('When a user removes a contact detail', () => {
    const contactId = '5b718087-33cd-746d-8f91-e7cec2299a73'
    const personId = 'cfe9c99f-7636-e23d-f08a-f36083e57d5d'

    const modalConfirmationMessage = `Are you sure you want to remove mainNumber: 00000111111 from Mark Gardner?`

    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('shows a confirmation message when clicking on the remove button', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      // remove first tenant
      cy.contains('Remove').first().click()

      // assert modal open
      cy.contains(modalConfirmationMessage)
    })

    it('hides confirmation modal when cancel clicked', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      // remove first tenant
      cy.contains('Remove').first().click()

      // assert modal open
      cy.contains(modalConfirmationMessage)

      // click cancel button
      cy.contains('Cancel').click()

      // confirm hidden
      cy.contains('Remove contact details').should('not.exist')
      cy.contains(modalConfirmationMessage).should('not.exist')
    })

    it('sends displays a network error in the modal', () => {
      cy.intercept(
        {
          method: 'DELETE',
          path: `/api/contact-details?contactId=${contactId}&personId=${personId}`,
        },
        {
          statusCode: 401,
        }
      ).as('deleteContactRequest')

      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      // remove first tenant
      cy.contains('Remove').first().click()

      // assert modal open
      cy.contains(modalConfirmationMessage)

      // click confirmation button
      cy.contains('Remove phone number').click()

      // wait for network request
      cy.wait(['@deleteContactRequest'])

      // assert modal still open
      cy.contains('Remove contact details')
      cy.contains(modalConfirmationMessage)

      // assert error message
      cy.contains('Request failed with status code 401')
    })

    it('sends delete request when modal confirmed', () => {
      cy.intercept(
        {
          method: 'DELETE',
          path: `/api/contact-details?contactId=${contactId}&personId=${personId}`,
        },
        {
          statusCode: 204,
        }
      ).as('deleteContactRequest')

      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      // remove first tenant
      cy.contains('Remove').first().click()

      // assert modal open
      cy.contains(modalConfirmationMessage)

      // click confirmation button
      cy.contains('Remove phone number').click()

      // wait for network request
      cy.wait(['@deleteContactRequest'])

      // assert modal closed
      cy.contains(modalConfirmationMessage).should('not.exist')

      // assert new contact details fetched
      cy.wait(['@contactDetailsRequest'])
    })
  })

  context('When a user sets contact detail as main', () => {
    const contactId = 'd00e640a-5df2-27f2-bb78-e1860040d21f'
    const personId = 'cfe9c99f-7636-e23d-f08a-f36083e57d5d'

    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('shows a confirmation message when clicking on the set as main button', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      // update last tenant
      cy.get('button:contains(Set as main contact)').last().click()

      // assert modal open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )
    })

    it('hides confirmation modal when cancel clicked', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      // update last tenant
      cy.get('button:contains(Set as main contact)').last().click()

      // assert modal open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )

      // click cancel button
      cy.contains('Cancel').click()

      // confirm hidden
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      ).should('not.exist')
    })

    it('sends displays a network error in the modal', () => {
      cy.intercept(
        {
          method: 'PATCH',
          path: `/api/contact-details?contactId=${contactId}&personId=${personId}`,
        },
        {
          statusCode: 400,
        }
      ).as('patchContactRequest')

      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      // update last tenant
      cy.get('button:contains(Set as main contact)').last().click()

      // assert modal open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )

      // click confirmation button
      cy.get('[data-test=confirm-button]').click()

      // wait for network request
      cy.wait(['@patchContactRequest'])

      // assert modal still open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )

      // assert error message
      cy.contains('Request failed with status code 400')
    })

    it('sends delete request when modal confirmed', () => {
      cy.intercept(
        {
          method: 'PATCH',
          path: `/api/contact-details?contactId=${contactId}&personId=${personId}`,
        },
        {
          statusCode: 204,
        }
      ).as('patchContactRequest')

      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      // update last tenant
      cy.get('button:contains(Set as main contact)').last().click()

      // assert modal open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )

      // click confirmation button
      cy.get('[data-test=confirm-button]').click()

      // wait for network request
      cy.wait(['@patchContactRequest'])

      // assert modal closed
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      ).should('not.exist')

      // assert new contact details fetched
      cy.wait(['@contactDetailsRequest'])
    })
  })

  context('When a user edits a persons contact details', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('the edit contact details link contains the correct href', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      cy.contains('Edit contact details').should(
        'have.attr',
        'href',
        'https://manage-my-home-development.hackney.gov.uk/person/cfe9c99f-7636-e23d-f08a-f36083e57d5d/edit-contact-details'
      )
    })
  })

  // This is a "special" integration test to end-to-end test
  // our permission system. We don't need to replicate this
  // for all our features because we have broad low-level test coverage.
  describe('When a contractor tries to raise a work order using the UI', () => {
    beforeEach(() => {
      cy.loginWithContractorRole()
    })

    it('rejects the request and shows the access-denied page instead', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.contains('New repair').should('not.exist')
      cy.url().should('not.contain', 'properties/00012345/raise-repair/new')

      cy.contains('Access denied')
      cy.url().should('contain', 'access-denied')
    })
  })
})
