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
        path: '/api/properties/00012345/location-alerts',
      },
      {
        body: {
          alerts: [
            {
              type: 'type1',
              comments: 'Location Alert 1',
            },
            {
              type: 'type2',
              comments: 'Location Alert 2',
            },
          ],
        },
      }
    ).as('locationAlerts')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/properties/tenureId1/person-alerts',
      },
      {
        body: {
          alerts: [
            {
              type: 'type3',
              comments: 'Person Alert 1',
            },
            {
              type: 'type4',
              comments: 'Person Alert 2',
            },
          ],
        },
      }
    ).as('personAlerts')
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

      cy.get('.govuk-tabs__list-item--selected a').contains(
        'Work orders history'
      )
    })

    context('when no repairs have been raised on the property', () => {
      it('Displays no repairs text', () => {
        cy.visit('/properties/00012345')
        cy.wait(['@property', '@workOrdersHistory'])
        cy.get('.govuk-tabs__tab').contains('Work orders history').click()
        cy.get('.lbh-heading-h2').contains('Work orders history')
        cy.get('.lbh-heading-h4').contains('There are no historical repairs')
      })
    })

    context('when many repairs have been raised on the property', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012' },
          { fixture: 'workOrders/workOrder.json' }
        ).as('workOrder')

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
            tradeDescription: 'DOOR ENTRY ENGINEER - DE',
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
        cy.get('.govuk-tabs').within(() => {
          cy.get('.govuk-tabs__tab').contains('Work orders history')
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
            cy.contains('DOOR ENTRY ENGINEER - DE')
            cy.contains('In progress')
            cy.contains('The latest repair')
          })
          // Check the last row
          cy.get('[data-ref=10000001]').within(() => {
            cy.contains('10000001')
            cy.contains('1 Jan 2021')
            cy.contains('11:02')
            cy.contains('DOOR ENTRY ENGINEER - DE')
            cy.contains('Work complete')
            cy.contains('The earliest repair for page one')
          })
        })
      })

      it('Clicks the first repair of work orders history', () => {
        cy.contains('10000012').click()
        cy.url().should('contains', 'work-orders/10000012')

        cy.get('.lbh-heading-h1').within(() => {
          cy.contains('Work order: 10000012')
        })
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
          cy.contains('DOOR ENTRY ENGINEER - DE')
          cy.contains('Work complete')
          cy.contains('The oldest repair')
        })

        // Run lighthouse audit for accessibility report
        cy.audit()
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
                tradeDescription: 'DOOR ENTRY ENGINEER - DE',
                status: 'In Progress',
              },
            ],
          }
        )

        cy.visit('/properties/00012345')
      })

      it('Does not display a Load more button', () => {
        cy.get('.govuk-tabs__tab').contains('Work orders history').click()
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
        cy.get('.govuk-tabs__list-item--selected a').contains(
          'Work orders history'
        )
      })
    })
  })

  describe('Raise work order', () => {
    context('when a repair can be raised on this property', () => {
      it('shows a raise a work order link', () => {
        cy.visit('/properties/00012345')
        cy.wait(['@property', '@workOrdersHistory'])

        cy.get('.lbh-heading-h2').within(() => {
          cy.contains('Raise a work order on this dwelling').should(
            'have.attr',
            'href',
            '/properties/00012345/raise-repair/new'
          )
        })
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
      cy.wait([
        '@property',
        '@workOrdersHistory',
        '@locationAlerts',
        '@personAlerts',
      ])

      cy.checkForTenureDetails(
        'Tenure: Secure',
        [
          'Address Alert: Location Alert 1 (type1)',
          'Address Alert: Location Alert 2 (type2)',
        ],
        [
          'Contact Alert: Person Alert 1 (type3)',
          'Contact Alert: Person Alert 2 (type4)',
        ]
      )
    })

    context('when the alerts API responds with an error', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/properties/00012345/location-alerts',
          },
          {
            statusCode: 404,
            body: {
              message: 'Cannot fetch location alerts',
            },
          }
        ).as('locationAlertsError')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/properties/tenureId1/person-alerts',
          },
          {
            statusCode: 404,
            body: {
              message: 'Cannot fetch person alerts',
            },
          }
        ).as('personAlertsError')
      })

      it('shows an error message in the place of the component', () => {
        cy.visit('/properties/00012345')
        cy.wait([
          '@property',
          '@workOrdersHistory',
          '@locationAlertsError',
          '@personAlertsError',
        ])

        // Some page content rendered
        cy.contains('Dwelling: 16 Pitcairn House')

        cy.get('.hackney-property-alerts').within(() => {
          cy.contains('Cannot fetch location alerts')
          cy.contains('Cannot fetch person alerts')
        })
      })
    })

    context('when the property has no tenure type', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/propertyNoTenure.json' }
        ).as('propertyNoTenureType')

        cy.visit('/properties/00012345')
        cy.wait(['@propertyNoTenureType', '@locationAlerts'])
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
      })

      it('shows TMO details', () => {
        cy.visit('/properties/00012345')
        cy.wait(['@propertyValidTMO'])

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
