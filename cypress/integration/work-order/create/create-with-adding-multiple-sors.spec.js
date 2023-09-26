import dedent from 'dedent'

const now = new Date('2022-02-11T12:00:00')

describe('Raise repair form', () => {
  beforeEach(() => {
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
      {
        method: 'GET',
        path: '/api/workOrders?*',
      },
      { body: [] }
    ).as('workOrdersRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders/budget-codes?contractorReference=PCL',
      },
      { fixture: 'scheduleOfRates/budgetCodes.json' }
    ).as('budgetCodesRequest')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/check?tradeCode=PL&propertyReference=00012345&contractorReference=PCL&sorCode=ABCDEFGH&sorCode=00000001&sorCode=00000002&sorCode=ABCD1234&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/firstMultipleSorCodesValidation.json' }
    ).as('firstValidation')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/check?tradeCode=PL&propertyReference=00012345&contractorReference=PCL&sorCode=00000001&sorCode=00000002&sorCode=00000001&sorCode=00000002&sorCode=00000003&sorCode=00000004&sorCode=00000004&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/secondMultipleSorCodesValidation.json' }
    ).as('secondValidation')

    cy.intercept(
      {
        method: 'GET',
        pathname: '/api/schedule-of-rates/codes',
        query: {
          tradeCode: 'PL',
          propertyReference: '00012345',
          contractorReference: 'PCL',
          isRaisable: 'true',
        },
      },
      { fixture: 'scheduleOfRates/dummyCodes.json' }
    ).as('dummyCodes')

    cy.intercept(
      { method: 'GET', path: '/api/toggles' },
      {
        body: [
          {
            featureToggles: { MultiTradeSORIncrementalSearch: true },
          },
        ],
      }
    ).as('featureToggle')

    cy.clock(now, ['Date'])
  })
  context('When choosing to add multiple SOR codes option', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('allows to add multiple SORs', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL', { delay: 0 })

        cy.wait('@contractorsRequest')

        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL', {
          delay: 0,
        })

        cy.wait('@dummyCodes')

        cy.get('input[id="rateScheduleItems[0][code]"]').type(
          '00000005 - shortDescription5 - £1',
          {
            delay: 0,
          }
        )

        cy.get('input[id="rateScheduleItems[0][code]"]').should(
          'have.value',
          '00000005 - shortDescription5 - £1'
        )

        cy.contains('+ Add multiple SOR codes').click()
      })

      cy.contains('Add multiple SOR codes')

      cy.get('#adding-multiple-sors-form').within(() => {
        cy.contains('Enter SOR codes as a list:')

        cy.wrap(
          dedent(`
            1234567
            ABCDEFGH
            1
            00000001
            00000002
            1
            ABCD1234
          `)
        ).as('multipleSORInput')

        cy.get('@multipleSORInput').then((multipleSORInput) => {
          cy.get('[data-testid="newSorCodes"]').type(multipleSORInput, {
            delay: 0,
          })
        })

        cy.get('[type="submit"]').contains('Submit').click()
      })

      cy.wait('@firstValidation')

      cy.get('.govuk-warning-text__text').within(() => {
        cy.contains(
          'Invalid SOR code(s) entered: "1234567" "ABCDEFGH" "1" "1" "ABCD1234"'
        )
      })

      cy.get('#adding-multiple-sors-form').within(() => {
        cy.contains('Enter SOR codes as a list:')

        cy.wrap(
          dedent(`
            00000001
            00000002
            00000001
            00000002
            00000003

            00000004
            00000004
          `)
        ).as('multipleSORInput')

        cy.get('@multipleSORInput').then((multipleSORInput) => {
          cy.get('[data-testid="newSorCodes"]').clear().type(multipleSORInput, {
            delay: 0,
          })
        })

        cy.get('[type="submit"]').contains('Submit').click()
      })

      cy.wait('@secondValidation')

      cy.get('.lbh-page-announcement').contains(
        'Duplicate SOR codes have been removed'
      )

      cy.get('#repair-request-form').within(() => {
        // First code was added using the regular form and still remains
        // with no duplicates added following batch upload
        cy.get('input[id="rateScheduleItems[0][code]"]').should(
          'have.value',
          '00000005 - shortDescription5 - £1'
        )

        cy.get('input[id="rateScheduleItems[1][code]"]').should(
          'have.value',
          '00000001 - shortDescription1 - £1'
        )

        cy.get('input[id="rateScheduleItems[2][code]"]').should(
          'have.value',
          '00000002 - shortDescription2 - £1'
        )

        cy.get('input[id="rateScheduleItems[3][code]"]').should(
          'have.value',
          '00000003 - shortDescription3 - £1'
        )

        cy.get('input[id="rateScheduleItems[4][code]"]').should(
          'have.value',
          '00000004 - shortDescription4 - £1'
        )
      })
    })

    it('throws an error', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait('@contractorsRequest')

        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')
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
