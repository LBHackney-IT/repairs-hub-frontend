/// <reference types="cypress" />

// Only the happy path and the paths that need the whole app (request URLs,
// navigation and permissions) are tested here. Everything else on the property
// page is covered by the Jest tests for its components and hooks.
describe('Show property', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('property')

    cy.intercept(
      { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
      { body: { propertyIsInLegalDisrepair: false } }
    ).as('legalDisrepair')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/properties/guid-pk/4552c539-2e00-8533-078d-9cc59d9115da',
      },
      { fixture: 'properties/boilerHouse.json' }
    ).as('boilerHouse')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
      },
      { body: [] }
    ).as('workOrdersHistory')

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
  })

  it('displays the property', () => {
    cy.visit('/properties/00012345')
    cy.wait([
      '@property',
      '@legalDisrepair',
      '@alerts',
      '@boilerHouse',
      '@workOrdersHistory',
    ])

    cy.get('.lbh-heading-h1').contains('Dwelling: 16 Pitcairn House')

    cy.get('.property-details-main-section').within(() => {
      cy.contains('Property details')
      cy.contains('16 Pitcairn House')
      cy.contains('St Thomass Square')
      cy.contains('E9 6PT')
    })

    cy.contains('a', 'Raise a work order on this dwelling').should(
      'have.attr',
      'href',
      '/properties/00012345/raise-repair/new'
    )

    cy.checkForTenureDetails('Tenure: Secure', [
      'Alert 1',
      'Specific Requirements',
      'Reason 1, very important',
    ])

    cy.get('[data-testid="boiler-house-details"]').contains(
      'Booster Pump 1-93 Pitcairn House St Thomass Square'
    )

    cy.contains('This property is currently under legal disrepair').should(
      'not.exist'
    )

    cy.get('.lbh-heading-h2').contains('Work orders history')
    cy.get('.lbh-heading-h4').contains('There are no historical repairs')
  })

  context('when the property is in legal disrepair', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
        { fixture: 'properties/propertyInLegalDisrepair.json' }
      ).as('legalDisrepair')
    })

    it('shows the legal disrepair warning', () => {
      cy.visit('/properties/00012345')
      cy.wait(['@property', '@legalDisrepair'])

      cy.get('.warning-info-box').within(() => {
        cy.contains('This property is currently under legal disrepair')
        cy.contains(
          'Before raising a work order you must call the Legal Disrepair Team'
        )
      })
    })
  })

  describe('Work Order History', () => {
    context('when many repairs have been raised on the property', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012' },
          { fixture: 'workOrders/workOrder.json' }
        ).as('workOrder')

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/appointments/10000012' },
          {
            fixture: 'workOrderAppointments/noAppointment.json',
          }
        )

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/tasks' },
          { body: [] }
        )
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/tasks' },
          { body: [] }
        )

        // Mock many properties for the first page of results
        const properties: any[] = [...Array(50).keys()]

        properties.forEach((property, index) => {
          const referenceIndex = (50 - index).toString()

          const referenceIndexString = `100000${referenceIndex.padStart(
            2,
            '0'
          )}`

          properties[index] = {
            reference: parseInt(referenceIndexString),
            dateRaised: '2021-01-22T11:02:00.334849',
            lastUpdated: null,
            priority: '2 [E] EMERGENCY',
            property: '315 Banister House  Homerton High Street',
            owner: 'Alphatrack (S) Systems Lt',
            description: 'A non-latest repair',
            propertyReference: '00012345',
            tradeCode: 'DE',
            tradeDescription: 'Door Entry Engineer - DE',
            status: 'In Progress',
          }
        })

        // Set some fields on the latest repair to check
        properties[0] = {
          ...properties[0],
          dateRaised: '2021-02-01T11:02:00.334849',
          description: 'The latest repair',
          status: 'In Progress',
        }

        // Set some fields on the earliest repair on this page to check
        properties[properties.length - 1] = {
          ...properties[properties.length - 1],
          dateRaised: '2021-01-01T11:02:00.334849',
          description: 'The earliest repair for page one',
          status: 'Work complete',
        }

        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
          },
          { body: properties }
        )
        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=2&sort=dateraised%3Adesc',
          },
          {
            body: [
              {
                ...properties[properties.length - 1],
                dateRaised: '2020-01-01T11:02:00.334849',
                reference: 10000000,
                description: 'The oldest repair for all pages',
                status: 'Work complete',
              },
            ],
          }
        )

        cy.visit('/properties/00012345')
      })

      it('Displays the first page of repairs', () => {
        cy.get('.lbh-heading-h2').contains('Work orders history')

        // Work orders history table headers
        cy.get('.govuk-table').within(() => {
          cy.contains('th', 'Reference')
          cy.contains('th', 'Date raised')
          cy.contains('th', 'Trade')
          cy.contains('th', 'Status')
          cy.contains('th', 'Description')
        })
        // Check the first row
        cy.get('[data-ref=10000050]').within(() => {
          cy.contains('10000050')
          cy.contains('1 Feb 2021')
          cy.contains('11:02')
          cy.contains('Door Entry Engineer - DE')
          cy.contains('In progress')
          cy.contains('The latest repair')
        })
        // Check the last row
        cy.get('[data-ref=10000001]').within(() => {
          cy.contains('10000001')
          cy.contains('1 Jan 2021')
          cy.contains('11:02')
          cy.contains('Door Entry Engineer - DE')
          cy.contains('Work complete')
          cy.contains('The earliest repair for page one')
        })
      })

      it('Clicks the first repair of work orders history', () => {
        cy.contains('10000012').click()
        cy.url().should('contains', 'work-orders/10000012')

        cy.get('.lbh-heading-h1').contains('Work order: 10000012')
      })

      it('Displays more repairs after clicking Load more button', () => {
        // our first mocked response contains 50 results, matching this
        cy.get('.work-orders-history-table > tbody > tr').should(
          'have.length',
          50
        )

        cy.contains('Load more').click({ force: true })

        // our second mocked response adds one more property to the list
        cy.get('.work-orders-history-table > tbody > tr').should(
          'have.length',
          51
        )

        cy.get('[data-ref=10000000]').within(() => {
          cy.contains('10000000')
          cy.contains('1 Jan 2020')
          cy.contains('11:02')
          cy.contains('Door Entry Engineer - DE')
          cy.contains('Work complete')
          cy.contains('The oldest repair')
        })
      })
    })

    context('When filter dropdown is used', () => {
      beforeEach(() => {
        const workOrderCount = 50
        const workOrders = []

        for (let i = 0; i < workOrderCount; i++) {
          const referenceIndexString = `100000${i}`

          workOrders.push({
            reference: parseInt(referenceIndexString),
            dateRaised: '2021-01-22T11:02:00.334849',
            lastUpdated: null,
            priority: '2 [E] EMERGENCY',
            property: '315 Banister House  Homerton High Street',
            owner: 'Alphatrack (S) Systems Lt',
            description: 'A non-latest repair',
            propertyReference: '00012345',
            tradeCode: 'DE',
            tradeDescription: 'Door Entry Engineer - DE',
            status: 'In Progress',
          })
        }

        // Set some fields on the latest repair to check

        workOrders[25] = {
          reference: 10000025,
          ' dateRaised': '2021-01-22T11:02:00.334849',
          lastUpdated: null,
          priority: '2 [E] EMERGENCY',
          property: '315 Banister House  Homerton High Street',
          owner: 'Alphatrack (S) Systems Lt',
          description: 'A non-latest repair',
          propertyReference: '00012345',
          tradeCode: 'PL',
          tradeDescription: 'Plumbing',
          status: 'In Progress',
        }

        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
          },
          { body: workOrders }
        ).as('workOrder')
        cy.intercept(
          {
            method: 'GET',
            path: '/api/filter/WorkOrder',
          },
          {
            fixture: 'filter/trades.json',
          }
        ).as('trades')
        cy.visit('/properties/00012345')
      })
      it('Displays a dropdown populated with trades to filter by', () => {
        cy.fixture('filter/trades.json').then((trades) => {
          cy.contains('Filter by trade:')
          trades.Trades.map((trade) => {
            cy.get('select').contains(trade.description)
          })
        })
      })

      it('Filters by selected trade and clears the filter when clear filter is clicked', () => {
        cy.get('[data-ref="10000025"]').as('plumbingWorkOrder')
        cy.get('.trade-picker-container > .lbh-link').as('clearAllFiltersLink')
        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders?**&TradeCodes=DE&PageSize=0',
          },
          {
            fixture: 'workOrders/filteredWorkOrders.json',
          }
        ).as('filteredWorkOrders')
        cy.wait('@workOrder')
        cy.get('@plumbingWorkOrder').should('exist')
        cy.get('select').select('Door Entry Engineer')
        cy.wait('@filteredWorkOrders')
        cy.get('@plumbingWorkOrder').should('not.exist')
        cy.get('@clearAllFiltersLink').click()
        cy.get('[data-ref="10000025"] > :nth-child(3)').should('exist')
      })
      it('Displays error text when no work orders exist in filtered trade', () => {
        cy.get('.trade-picker-container > .lbh-link').as('clearAllFiltersLink')
        cy.get('select').select('Electrical')
        cy.contains('There are no historical repairs with Electrical')
        cy.get('@clearAllFiltersLink').click()
        cy.contains('Door Entry Engineer')
      })
    })
  })

  context('when signed in with a role that cannot view properties', () => {
    beforeEach(() => {
      cy.clearCookies()
      cy.loginWithOperativeRole()
    })

    it('denies access to the property page', () => {
      cy.visit('/properties/00012345')

      cy.url().should('contain', '/access-denied')
      cy.contains('Access denied')
      cy.contains('Dwelling: 16 Pitcairn House').should('not.exist')
    })
  })
})
