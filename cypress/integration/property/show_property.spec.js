/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Show property', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()
  })

  context(
    'Displays property details, tenure, alerts and permit to raise a repair',
    () => {
      beforeEach(() => {
        // Stub request with property response
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/property.json' }
        )
        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
          },
          { body: [] }
        ).as('repairsHistory')

        cy.visit('/properties/00012345')
        cy.wait('@repairsHistory')
      })

      it('shows property address in the heading', () => {
        cy.get('.lbh-heading-h1').contains('Dwelling: 16 Pitcairn House')
      })

      it('shows can raise a repair link', () => {
        cy.get('.lbh-heading-h2').within(() => {
          cy.contains('Raise a repair on this dwelling')
        })
      })

      it('shows property details section', () => {
        cy.get('.property-details-main-section').within(() => {
          cy.contains('Property details')
          cy.contains('16 Pitcairn House')
          cy.contains('St Thomass Square')
          cy.contains('E9 6PT')
        })
      })

      it('shows Tenure and Alerts section', () => {
        cy.checkForTenureAlertDetails(
          'Tenure: Secure',
          ['Address Alert: Property Under Disrepair (DIS)'],
          [
            'Contact Alert: No Lone Visits (CV)',
            'Contact Alert: Verbal Abuse or Threat of (VA)',
          ]
        )
      })

      it('Displays the history tab active', () => {
        cy.get('.govuk-tabs__list-item--selected a').contains('Repairs history')
      })

      context('when no repairs have been raised on the property', () => {
        it('Displays no repairs text', () => {
          cy.get('.govuk-tabs__tab').contains('Repairs history').click()
          cy.get('.lbh-heading-h2').contains('Repairs history')
          cy.get('.lbh-heading-h4').contains('There are no historical repairs')
        })
      })
    }
  )

  context('when many repairs have been raised on the property', () => {
    beforeEach(() => {
      // Stub request with property response
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      )

      // Mock many properties for the first page of results
      let properties = [...Array(50).keys()]

      properties.forEach((property, index) => {
        const referenceIndex = (50 - index).toString()

        const referenceIndexString = `100000${referenceIndex.padStart(2, '0')}`

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
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
        },
        { body: properties }
      )
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=2',
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
        cy.get('.govuk-tabs__tab').contains('Repairs history')
        cy.get('.lbh-heading-h2').contains('Repairs history')

        // Repairs history table headers
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
          cy.contains('11:02 am')
          cy.contains('DOOR ENTRY ENGINEER - DE')
          cy.contains('In Progress')
          cy.contains('The latest repair')
        })
        // Check the last row
        cy.get('[data-ref=10000001]').within(() => {
          cy.contains('10000001')
          cy.contains('1 Jan 2021')
          cy.contains('11:02 am')
          cy.contains('DOOR ENTRY ENGINEER - DE')
          cy.contains('Work complete')
          cy.contains('The earliest repair for page one')
        })
      })
    })

    it('Displays more repairs after clicking Load more button', () => {
      // our first mocked response contains 50 results, matching this
      cy.get('.repairs-history-table > tbody > tr').should('have.length', 50)

      cy.contains('Load more').click({ force: true })

      // our second mocked response adds one more property to the list
      cy.get('.repairs-history-table > tbody > tr').should('have.length', 51)

      cy.get('[data-ref=10000000]').within(() => {
        cy.contains('10000000')
        cy.contains('1 Jan 2020')
        cy.contains('11:02 am')
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
      // Stub request with property response
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      )
      cy.intercept(
        {
          method: 'GET',
          path:
            '/api/workOrders?propertyReference=00012345&PageSize=50&PageNumber=1',
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
      cy.get('.govuk-tabs__tab').contains('Repairs history').click()
      cy.contains('button', 'Load more').should('not.exist')
    })
  })

  context(
    'Displays property with a tenure type that does not permit raising a repair',
    () => {
      beforeEach(() => {
        // Stub request with property response
        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { fixture: 'properties/property_repair_not_raisable.json' }
        ).as('property')

        cy.visit('/properties/00012345')
        cy.wait('@property')
      })

      it('shows property address in the heading', () => {
        cy.get('.lbh-heading-h1').contains('Dwelling: 16 Pitcairn House')
      })

      it('shows cannot raise a repair text', () => {
        cy.get('.govuk-warning-text.lbh-warning-text').within(() => {
          cy.contains(
            'Cannot raise a repair on this property due to tenure type'
          )
        })
      })

      it('shows Tenure (not raisable repair) section', () => {
        cy.get('.hackney-property-alerts li.bg-orange').within(() => {
          cy.contains('Tenure: Leasehold (RTB)')
        })
      })

      it('does not show the Repairs history tab', () => {
        // No repairs history
        cy.contains('Repairs history').should('not.exist')

        // Run lighthouse audit for accessibility report
        cy.audit()
      })
    }
  )

  context('Displays property with no tenure type', () => {
    beforeEach(() => {
      // Stub request with property response
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property_no_tenure.json' }
      ).as('property')

      cy.visit('/properties/00012345')
      cy.wait('@property')
    })

    it('shows property address in the heading', () => {
      cy.get('.lbh-heading-h1').contains('Dwelling: 16 Pitcairn House')
    })

    it('does not show property alerts', () => {
      cy.get('.hackney-property-alerts').should('not.exist')
    })

    it('does not show Tenure', () => {
      cy.get('.hackney-property-alerts').should('not.exist')
      cy.contains('Tenure').should('not.exist')
    })

    it('does not show the Repairs history tab', () => {
      // No repairs history
      cy.contains('Repairs history').should('not.exist')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })

  context('Displays property with TMO', () => {
    beforeEach(() => {
      // Stub request with property response
      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property_with_tmo.json' }
      ).as('property')

      cy.visit('/properties/00012345')
      cy.wait('@property')
    })

    it('shows property address in the heading', () => {
      cy.get('.lbh-heading-h1').contains('12 Test Street')
    })

    it('does show TMO details', () => {
      cy.get('.hackney-property-alerts').contains('TMO: Testing TMO')
    })

    it('does not show the Repairs history tab', () => {
      // No repairs history
      cy.contains('Repairs history').should('not.exist')

      // Run lighthouse audit for accessibility report
      cy.audit()
    })
  })
})
