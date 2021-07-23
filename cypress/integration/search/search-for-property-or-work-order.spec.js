/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search by work order reference, postcode or address', () => {
  context('When logged in user is an agent', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    describe('Search for property', () => {
      context('Search for property by postcode', () => {
        beforeEach(() => {
          // Stub request for search on properties by postcode
          cy.intercept(
            { method: 'GET', path: '/api/properties/?q=e9%206pt' },
            { fixture: 'properties/properties.json' }
          )

          cy.visit('/')

          // Search by postcode
          cy.get('.govuk-input').clear().type('e9 6pt')
          cy.get('[type="submit"]').contains('Search').click()
          cy.url().should('contains', '/search?q=e9%25206pt')
        })

        it('checks the heading', () => {
          cy.get('.govuk-table').within(() => {
            cy.contains('caption', 'We found 2 matching results for: e9 6pt')
          })
        })

        it('checks the table', () => {
          cy.get('.govuk-table').within(() => {
            cy.contains('th', 'Address')
            cy.contains('th', 'Postcode')
            cy.contains('th', 'Property type')
            cy.contains('th', 'Property reference')
          })

          cy.get('.govuk-table__cell a').should(
            'have.attr',
            'href',
            '/properties/00012345'
          )

          // Run lighthouse audit for accessibility report
          cy.audit()
        })
      })

      context('Search for property by address', () => {
        beforeEach(() => {
          // Stub request for search on properties by address
          cy.intercept(
            { method: 'GET', path: '/api/properties/?q=pitcairn' },
            { fixture: 'properties/properties.json' }
          )

          cy.visit('/')

          // Search by address
          cy.get('.govuk-input').type('pitcairn')
          cy.get('[type="submit"]').contains('Search').click()
        })

        it('checks the heading', () => {
          cy.get('.govuk-table').within(() => {
            cy.contains('caption', 'We found 2 matching results for: pitcairn')
          })

          // Run lighthouse audit for accessibility report
          cy.audit()
        })
      })
    })

    describe('Search by work order reference', () => {
      context('Displays the page for a work order', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000012' },
            { fixture: 'workOrders/workOrder.json' }
          )
          cy.intercept(
            { method: 'GET', path: '/api/properties/00012345' },
            { fixture: 'properties/property.json' }
          )
          cy.intercept(
            {
              method: 'GET',
              path:
                '/api/workOrders/?propertyReference=00012345&PageSize=50&PageNumber=1',
            },
            { body: [] }
          )
          cy.intercept(
            { method: 'GET', path: 'workOrders/10000012/tasks' },
            { body: [] }
          )

          cy.visit('/')

          // Search by work order reference
          cy.get('.govuk-input').clear().type('10000012')
          cy.get('[type="submit"]').contains('Search').click()
          cy.url().should('contains', 'work-orders/10000012')

          cy.visit('/work-orders/10000012')
        })

        it('Work order header with reference number', () => {
          cy.get('.lbh-heading-h1').within(() => {
            cy.contains('Work order: 10000012')
          })
        })

        it('Repair description', () => {
          cy.get('.lbh-body-m').within(() => {
            cy.contains('This is an urgent repair description')
          })
        })

        it('Property details', () => {
          cy.get('.property-details-main-section').within(() => {
            cy.contains('Dwelling')
            cy.contains('16 Pitcairn House').should(
              'have.attr',
              'href',
              '/properties/00012345'
            )
            cy.contains('St Thomass Square').should(
              'have.attr',
              'href',
              '/properties/00012345'
            )
            cy.contains('E9 6PT')
          })

          cy.checkForTenureDetails(
            'Tenure: Secure',
            ['Address Alert: Property Under Disrepair (DIS)'],
            [
              'Contact Alert: No Lone Visits (CV)',
              'Contact Alert: Verbal Abuse or Threat of (VA)',
            ]
          )

          // Run lighthouse audit for accessibility report
          cy.audit()
        })

        it('Work order details', () => {
          cy.get('.work-order-info').within(() => {
            cy.contains('Status: In Progress')
            cy.contains('Priority: U - Urgent (5 Working days)')
            cy.contains('Raised by Dummy Agent')
            cy.contains('18 Jan 2021, 15:28')
            cy.contains('Target: 23 Jan 2021, 18:30')
            cy.contains('Caller: Jill Smith')
            cy.contains('07700 900999')
          })

          // Run lighthouse audit for accessibility report
          cy.audit()
        })
      })

      context('Displays an error for wrong work order reference', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/00000000' },
            (req) => {
              req.reply({
                statusCode: 404,
                body: {
                  message: 'Unable to locate work order 0',
                },
              })
            }
          ).as('repairs_with_error')

          cy.visit('/')

          // Search by postcode
          cy.get('.govuk-input').clear().type('00000000')
          cy.get('[type="submit"]').contains('Search').click()
          cy.url().should('contains', 'work-orders/00000000')

          cy.visit('/work-orders/00000000')

          cy.wait('@repairs_with_error')
        })

        it('Error message', () => {
          cy.get('.govuk-error-message').within(() => {
            cy.contains('Could not find a work order with reference 00000000')
          })

          // Run lighthouse audit for accessibility report
          cy.audit()
        })
      })
    })
  })

  context('When logged in user is a contractor', () => {
    beforeEach(() => {
      cy.loginWithContractorRole()
    })

    describe('Search by work order reference', () => {
      beforeEach(() => {
        // Viewing the home page
        cy.intercept(
          { method: 'GET', path: '/api/filter/WorkOrder' },
          {
            fixture: 'filter/workOrder.json',
          }
        )
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/?PageSize=10&PageNumber=1' },
          { fixture: 'workOrders/workOrders.json' }
        )

        // Viewing the work order page
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012' },
          { fixture: 'workOrders/workOrder.json' }
        )
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
        )

        cy.visit('/')
      })

      it('navigates to the work order page', () => {
        // Search by work order ref
        cy.contains('Search').click()
        cy.get('.govuk-input').clear().type('10000012')
        cy.get('[type="submit"]').contains('Search').click()
        cy.url().should('contains', 'work-orders/10000012')

        cy.get('.lbh-heading-h1').within(() => {
          cy.contains('Work order: 10000012')
        })
        cy.get('.lbh-body-m').within(() => {
          cy.contains('This is an urgent repair description')
        })
      })
    })

    describe('Search by postcode or address', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/e96bt' },
          (req) => {
            req.reply({
              statusCode: 404,
              body: {
                message: 'Unable to locate work order e96bt',
              },
            })
          }
        ).as('repairs_with_error')
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/randomaddress' },
          (req) => {
            req.reply({
              statusCode: 404,
              body: {
                message: 'Unable to locate work order randomaddress',
              },
            })
          }
        ).as('repairs_with_error')

        cy.visit('/search')
      })

      it('returns 404 not found when searching for anything other than a work order', () => {
        // Search by postcode
        cy.get('.govuk-input').clear().type('e96bt')
        cy.get('[type="submit"]').contains('Search').click()
        cy.url().should('contains', 'work-orders/e96bt')

        cy.wait('@repairs_with_error')

        cy.get('.govuk-error-message').within(() => {
          cy.contains('Could not find a work order with reference e96bt')
        })

        // Search by address
        cy.contains('Search').click()
        cy.get('.govuk-input').clear().type('randomaddress')
        cy.get('[type="submit"]').contains('Search').click()
        cy.url().should('contains', 'work-orders/randomaddress')

        cy.wait('@repairs_with_error')

        cy.get('.govuk-error-message').within(() => {
          cy.contains(
            'Could not find a work order with reference randomaddress'
          )
        })
      })
    })
  })
})
