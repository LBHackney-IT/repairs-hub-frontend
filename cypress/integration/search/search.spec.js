/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search', () => {
  const totalPageSize = Cypress.env('NEXT_PUBLIC_PROPERTIES_PAGE_SIZE')
  const totalResults = totalPageSize + 1
  const firstPageLastItemReference = totalPageSize.toString().padStart(8, '0')
  const lastPageLastItemReference = totalResults.toString().padStart(8, '0')

  context(
    'When the role of the user allows searching both properties and work orders',
    () => {
      beforeEach(() => {
        cy.loginWithAgentRole()
      })

      context('and the user searches by property data', () => {
        beforeEach(() => {
          // total is one higher than what can be shown on one page
          const propertiesPage1 = {
            total: totalResults,
            properties: [...Array(totalPageSize).keys()].map((itemIndex) => {
              return {
                propertyReference: (itemIndex + 1).toString().padStart(8, '0'),
                address: `${itemIndex + 1} Test House Test Square`,
                postCode: 'E8 1EA',
                propertyType: 'Dwelling',
              }
            }),
          }

          cy.intercept(
            {
              method: 'GET',
              path: `/api/properties/search?searchText=e8+1ea&pageSize=${totalPageSize}*`,
            },
            {
              body: propertiesPage1,
            }
          ).as('propertyPostcodeSearchPage1')

          cy.intercept(
            {
              method: 'GET',
              path: `/api/properties/search?searchText=e8+1ea&pageSize=${totalPageSize}&pageNumber=2`,
            },
            {
              body: {
                total: totalResults,
                properties: [
                  {
                    propertyReference: lastPageLastItemReference,
                    address: `${totalResults} Test House Test Square`,
                    postCode: 'E8 1EA',
                    propertyType: 'Dwelling',
                  },
                ],
              },
            }
          ).as('propertyPostcodeSearchPage2')

          cy.intercept(
            {
              method: 'GET',
              path: `/api/properties/search?searchText=red&pageSize=${totalPageSize}&pageNumber=1`,
            },
            {
              total: 1,
              properties: [
                {
                  propertyReference: '10000000',
                  address: '1 Test red House Test Square',
                  postCode: 'E8 1EA',
                  propertyType: 'Dwelling',
                },
              ],
            }
          ).as('propertyAddressSearch')
        })

        it('shows a table of properties with pagination links', () => {
          cy.visit('/')

          cy.get('nav.lbh-pagination').should('not.exist')

          cy.get('.govuk-input').type('e8 1ea')

          cy.get('[type="submit"]').contains('Search').click()

          cy.url().should('contains', '/search?searchText=e8+1ea')

          cy.wait('@propertyPostcodeSearchPage1')

          cy.get('nav.lbh-pagination').contains(
            `Showing 1–${totalPageSize} of ${totalResults} results`
          )

          cy.get('.govuk-table__head').within(() => {
            cy.contains('th', 'Address')
            cy.contains('th', 'Postcode')
            cy.contains('th', 'Property type')
            cy.contains('th', 'Property reference')
          })

          cy.get('.govuk-table__body').within(() => {
            cy.get('tr').should('have.length', totalPageSize)
          })

          cy.get('.govuk-table__body tr:first-child').within(() => {
            cy.contains('1 Test House Test Square')
            cy.contains('E8 1EA')
            cy.contains('Dwelling')
            cy.contains('00000001')

            cy.get('.govuk-table__cell a').should(
              'have.attr',
              'href',
              '/properties/00000001'
            )
          })

          cy.get('.govuk-table__body tr:last-child').within(() => {
            cy.contains(`${totalPageSize} Test House Test Square`)
            cy.contains('E8 1EA')
            cy.contains('Dwelling')
            cy.contains(firstPageLastItemReference)

            cy.get('.govuk-table__cell a').should(
              'have.attr',
              'href',
              `/properties/${firstPageLastItemReference}`
            )
          })

          cy.get('nav.lbh-pagination').within(() => {
            cy.get('[aria-label="Page 1, current page"]').contains('1')
            cy.contains('a', '2')

            cy.contains('a', 'Next').click()
          })

          cy.wait('@propertyPostcodeSearchPage2')

          cy.get('nav.lbh-pagination').contains(
            `Showing ${totalResults}–${totalResults} of ${totalResults} results`
          )

          cy.get('.govuk-table__body').within(() => {
            cy.get('tr').should('have.length', 1)
          })

          cy.get('.govuk-table__body tr:first-child').within(() => {
            cy.contains(`${totalResults} Test House Test Square`)
            cy.contains('E8 1EA')
            cy.contains('Dwelling')
            cy.contains(lastPageLastItemReference)

            cy.get('.govuk-table__cell a').should(
              'have.attr',
              'href',
              `/properties/${lastPageLastItemReference}`
            )
          })

          cy.get('nav.lbh-pagination').within(() => {
            cy.get('[aria-label="Page 2, current page"]').contains('2')

            cy.contains('a', '1').click()
          })

          cy.wait('@propertyPostcodeSearchPage1')

          cy.get('.govuk-input').clear().type('red')

          cy.get('[type="submit"]').contains('Search').click()

          cy.wait('@propertyAddressSearch')

          cy.get('nav.lbh-pagination').contains('Showing 1–1 of 1 results')

          cy.get('.govuk-table__body').within(() => {
            cy.get('tr').should('have.length', 1)
          })

          cy.get('.govuk-table__body tr:first-child').within(() => {
            cy.contains('1 Test red House Test Square')
          })

          cy.audit()
        })
      })

      context('and a valid work order reference is entered', () => {
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
            { method: 'GET', path: '/api/workOrders/10000012/tasks' },
            { body: [] }
          )
        })

        it('takes you to the work order page', () => {
          cy.visit('/')

          cy.get('.govuk-input').clear().type('10000012')
          cy.get('[type="submit"]').contains('Search').click()
          cy.url().should('contains', 'work-orders/10000012')
        })
      })

      context('and an invalid work order reference is entered', () => {
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

          cy.get('.govuk-input').clear().type('00000000')
          cy.get('[type="submit"]').contains('Search').click()
          cy.url().should('contains', 'work-orders/00000000')

          cy.visit('/work-orders/00000000')

          cy.wait('@repairs_with_error')
        })

        it('Displays an error message', () => {
          cy.get('.govuk-error-message').within(() => {
            cy.contains('Could not find a work order with reference 00000000')
          })
        })
      })
    }
  )
})
