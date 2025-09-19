/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search', () => {
  const totalPageSize = Cypress.env('NEXT_PUBLIC_PROPERTIES_PAGE_SIZE')
  const totalResults = totalPageSize + 1
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
      })

      context('and a valid work order reference is entered', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', path: '/api/workOrders/10000012' },
            { fixture: 'workOrders/workOrder.json' }
          )

          cy.intercept(
            { method: 'GET', path: '/api/workOrders/appointments/10000012' },
            {
              fixture: 'workOrderAppointments/noAppointment.json',
            }
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
            {
              method: 'GET',
              path: '/api/workOrders/00000000',
            },
            {
              statusCode: 404,
              body: {
                message: 'Unable to locate work order 0',
              },
            }
          ).as('repairs_with_error')

          cy.intercept(
            {
              method: 'GET',
              path: '/api/workOrders/00000000/tasks',
            },
            {
              statusCode: 200,
              body: [],
            }
          ).as('workOrderTasksRequest')

          cy.visit('/')

          cy.get('.govuk-input').clear().type('00000000')
          cy.get('[type="submit"]').contains('Search').click()
          cy.url().should('contains', 'work-orders/00000000')

          cy.visit('/work-orders/00000000')

          cy.wait(['@repairs_with_error', '@workOrderTasksRequest'])
        })

        it('Displays an error message', () => {
          cy.get('.govuk-error-message').contains(
            'Could not find a work order with reference 00000000'
          )
        })
      })
    }
  )

  context('When the role of user allows searching by work order only', () => {
    beforeEach(() => {
      cy.loginWithContractorRole()
    })

    context('and a valid work order reference is entered', () => {
      beforeEach(() => {
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

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012' },
          { fixture: 'workOrders/workOrder.json' }
        )

        cy.intercept(
          { method: 'GET', path: '/api/workOrders/appointments/10000012' },
          {
            fixture: 'workOrderAppointments/noAppointment.json',
          }
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
        cy.intercept(
          { method: 'GET', path: '/api/workOrders/10000012/tasks' },
          { body: [] }
        )
      })

      it('navigates to the work order page', () => {
        cy.visit('/search')

        cy.get('.govuk-input').clear().type('10000012')
        cy.get('[type="submit"]').contains('Search').click()
        cy.url().should('contains', 'work-orders/10000012')

        cy.get('.lbh-heading-h1').contains('Work order: 10000012')

        cy.get('.lbh-body-m').contains('This is an urgent repair description')
      })
    })
  })
})
