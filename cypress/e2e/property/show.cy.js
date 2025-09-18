/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Show property', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('property')

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
              type: 'type2',
              comments: 'Alert 2',
            },
          ],
        },
      }
    ).as('alerts')
  })

  it('displays property details', () => {
    cy.visit('/properties/00012345')
    cy.wait(['@property', '@workOrdersHistory'])

    cy.get('.lbh-heading-h1').contains('Dwelling: 16 Pitcairn House')

    cy.get('.property-details-main-section').within(() => {
      cy.contains('Property details')
      cy.contains('16 Pitcairn House')
      cy.contains('St Thomass Square')
      cy.contains('E9 6PT')
    })
  })

  describe('Work Order History', () => {
    it('Displays the history tab active', () => {
      cy.visit('/properties/00012345')
      cy.wait(['@property', '@workOrdersHistory'])

      cy.contains('.tabs-button', 'Work orders history')
    })

    context('when no repairs have been raised on the property', () => {
      it('Displays no repairs text', () => {
        cy.visit('/properties/00012345')
        cy.wait(['@property', '@workOrdersHistory'])
        cy.contains('.tabs-button', 'Work orders history').click()
        cy.get('.lbh-heading-h2').contains('Work orders history')
        cy.get('.lbh-heading-h4').contains('There are no historical repairs')
      })
    })

    context('when many repairs have been raised on the property', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/new' },
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
        let properties = [...Array(50).keys()]

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
        // cy.get('.govuk-tabs').within(() => {
        cy.contains('.tabs-button', 'Work orders history')
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
        // })
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

        // Run lighthouse audit for accessibility report
        //  cy.audit()
      })
    })

    context('When filter dropdown is used', () => {
      beforeEach(() => {
        let workOrderCount = 50
        let workOrders = []

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

    context('when the are fewer repairs than the initial page size', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
          },
          {
            body: [
              {
                reference: 10000000,
                dateRaised: '2021-01-22T11:02:00.334849',
                lastUpdated: null,
                priority: '2 [E] EMERGENCY',
                property: '315 Banister House  Homerton High Street',
                owner: 'Alphatrack (S) Systems Lt',
                description: 'The only repair',
                propertyReference: '00012345',
                tradeCode: 'DE',
                tradeDescription: 'Door Entry Engineer - DE',
                status: 'In Progress',
              },
            ],
          }
        )

        cy.visit('/properties/00012345')
      })

      it('Does not display a Load more button', () => {
        cy.contains('.tabs-button', 'Work orders history').click()
        cy.contains('button', 'Load more').should('not.exist')
      })
    })

    context('when a repair cannot be raised on the property', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/propertyRepairNotRaisable.json' }
        ).as('propertyNotRaisable')
      })

      it('Work order history is still visible', () => {
        cy.visit('/properties/00012345')
        cy.contains('.tabs-button', 'Work orders history')
      })
    })
  })

  describe('Raise work order', () => {
    context('when a repair can be raised on this property', () => {
      it('shows a raise a work order link', () => {
        cy.visit('/properties/00012345')
        cy.wait(['@property', '@workOrdersHistory'])

        cy.contains('a', 'Raise a work order on this dwelling').should(
          'have.attr',
          'href',
          '/properties/00012345/raise-repair/new'
        )
      })
    })

    context('when a repair cannot be raised on this property', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/propertyRepairNotRaisable.json' }
        ).as('propertyNotRaisable')
      })

      it('does not show a raise work order link', () => {
        cy.visit('/properties/00012345')
        cy.wait('@propertyNotRaisable')

        cy.contains('Raise a work order on this dwelling').should('not.exist')

        cy.get('.govuk-warning-text.lbh-warning-text').within(() => {
          cy.contains(
            'Cannot raise a work order on this property due to tenure type'
          )
        })
      })
    })
  })

  describe('Tenures and Alerts', () => {
    it('shows Tenure and Alerts section', () => {
      cy.visit('/properties/00012345')
      cy.wait(['@property', '@workOrdersHistory', '@alerts'])

      cy.checkForTenureDetails(
        'Tenure: Secure',
        ['Alert 1', 'Alert 2'],
        ['Alert 1', 'Alert 2']
      )
    })

    context('when the alerts API responds with an error', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/properties/00012345/alerts',
          },
          {
            statusCode: 404,
            body: {
              message: 'Cannot fetch alerts',
            },
          }
        ).as('alertsError')
      })

      it('shows an error message in the place of the component', () => {
        cy.visit('/properties/00012345')
        cy.wait(['@property', '@workOrdersHistory', '@alertsError'])

        // Some page content rendered
        cy.contains('Dwelling: 16 Pitcairn House')

        cy.get('.hackney-property-alerts').within(() => {
          cy.contains('Cannot fetch alerts')
        })
      })
    })

    context('when the property has no tenure type', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/propertyNoTenure.json' }
        ).as('propertyNoTenureType')

        cy.intercept(
          { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
          { body: { propertyIsInLegalDisrepair: false } }
        ).as('propertyInLegalDisrepair')

        cy.visit('/properties/00012345')
        cy.wait(['@propertyNoTenureType', '@propertyInLegalDisrepair'])
      })

      it('does not show Tenure', () => {
        cy.contains('Tenure').should('not.exist')
      })
    })
  })

  describe('TMO', () => {
    context('when the property has a valid TMO', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/propertyWithTmo.json' }
        ).as('propertyValidTMO')

        cy.intercept(
          { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
          { body: { propertyIsInLegalDisrepair: false } }
        ).as('propertyInLegalDisrepair')
      })

      it('shows TMO details', () => {
        cy.visit('/properties/00012345')
        cy.wait(['@propertyValidTMO', '@propertyInLegalDisrepair'])

        cy.get('.hackney-property-alerts').contains('TMO: Testing TMO')
      })
    })

    context("when the TMO is 'London Borough of Hackney'", () => {
      beforeEach(() => {
        cy.fixture('properties/propertyWithTmo.json')
          .then((property) => {
            property.tmoName = 'London Borough of Hackney'
            cy.intercept(
              { method: 'GET', path: '/api/properties/00012345' },
              { body: property }
            )
          })
          .as('propertyTMOHackney')
      })

      it('does not show TMO details', () => {
        cy.visit('/properties/00012345')
        cy.wait(['@propertyTMOHackney'])

        // Hard-coded rule in frontend to ignore a TMO matching the above name
        cy.contains('London Borough of Hackney').should('not.exist')
      })
    })
  })

  describe('Out of hours link', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      ).as('workOrder')

      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1&sort=dateraised%3Adesc',
        },
        { body: [] }
      ).as('workOrdersHistory')
    })

    context('when the current time is out of working hours', () => {
      beforeEach(() => {
        cy.clock(new Date('Thursday 16 September 2021 18:01:00'))

        cy.visit('/properties/00012345')
        cy.wait(['@workOrdersHistory', '@workOrder'])
      })

      it('displays a link', () => {
        cy.contains('a', 'Out of hours note').should(
          'have.attr',
          'href',
          Cypress.env('NEXT_PUBLIC_OUT_OF_HOURS_LINK')
        )
      })
    })

    context('when the current time is within working hours', () => {
      beforeEach(() => {
        cy.clock(new Date('Thursday 16 September 2021 08:01:00'))

        cy.visit('/properties/00012345')
        cy.wait(['@workOrdersHistory', '@workOrder'])
      })

      it('does not display a link', () => {
        cy.contains('a', 'Out of hours note').should('not.exist')
      })
    })
  })
})
