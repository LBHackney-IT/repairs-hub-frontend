/// <reference types="cypress" />

describe('Home page - one job at a time', () => {
  context('When a one job at a time operative is logged in', () => {
    beforeEach(() => {
      cy.loginWithOneJobAtATimeOperativeRole()
    })

    it('Displays content in the header', () => {
      cy.visit('/')

      cy.get('.lbh-header__service-name').contains('Repairs Hub')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.contains('Manage work orders').should('not.exist')

      cy.contains('Search').should('not.exist')

      cy.get('#signout')
        .contains('Sign out')
        .should('have.attr', 'href', '/logout')
    })

    context('When they have work orders attached to them', () => {
      beforeEach(() => {
        cy.clock(new Date('June 11 2021 13:49:15Z'))

        cy.intercept(
          {
            method: 'GET',
            path: '/api/operatives/hu0001/appointments',
          },
          {
            fixture: 'operatives/workOrders.json',
          }
        ).as('operativesWorkOrders')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders/10000621',
          },
          {
            fixture: 'operatives/workOrder.json',
          }
        ).as('operativesWorkOrder')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/properties/00012345',
          },
          {
            fixture: 'properties/property.json',
          }
        ).as('property')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders/10000621/tasks',
          },
          {
            fixture: 'workOrders/task.json',
          }
        ).as('task')
      })

      it('Displays only one active and two completed work order appointments', () => {
        cy.visit('/')
        cy.wait('@operativesWorkOrders')

        cy.get('.lbh-heading-h3').contains('Friday 11 June')

        cy.get('.appointment-details').should('have.length', 3)

        cy.get('.lbh-list').within(() => {
          cy.get('li')
            .eq(0)
            .within(() => {
              cy.contains('12:00 – 18:00')
              cy.contains('emergency')
              cy.contains('18 Pitcairn House St Thomass Square')
              cy.contains('L53 GS')
              cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
            })

          cy.get('li')
            .eq(1)
            .within(() => {
              cy.contains('16:00 – 18:00')
              cy.contains('19 Pitcairn House St Thomass Square')
              cy.contains('L53 GS')
              cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
            })

          cy.get('li').eq(0).click()
        })

        cy.contains('10000625')
      })
    })

    context(
      'When they have a work order started and other work orders attached to them',
      () => {
        beforeEach(() => {
          cy.clock(new Date('June 11 2021 13:49:15Z'))

          cy.intercept(
            {
              method: 'GET',
              path: '/api/operatives/hu0001/appointments',
            },
            {
              fixture: 'operatives/workOrders-ojaat.json',
            }
          ).as('operativesWorkOrders')

          cy.intercept(
            {
              method: 'GET',
              path: '/api/workOrders/10000621',
            },
            {
              fixture: 'operatives/workOrder.json',
            }
          ).as('operativesWorkOrder')

          cy.intercept(
            {
              method: 'GET',
              path: '/api/properties/00012345',
            },
            {
              fixture: 'properties/property.json',
            }
          ).as('property')

          cy.intercept(
            {
              method: 'GET',
              path: '/api/workOrders/10000621/tasks',
            },
            {
              fixture: 'workOrders/task.json',
            }
          ).as('task')
        })

        it('Displays only one started appointment', () => {
          cy.visit('/')
          cy.wait('@operativesWorkOrders')

          cy.get('.lbh-heading-h3').contains('Friday 11 June')

          cy.get('.appointment-details').should('have.length', 3)

          cy.get('.lbh-list').within(() => {
            cy.get('li')
              .eq(0)
              .within(() => {
                cy.contains('08:00 – 13:00')
                cy.contains('normal')
                cy.contains('17 Pitcairn House')
                cy.contains('L53 GS')
                cy.contains(
                  'Lorem ipsum dolor sit amet, consectetur efficitur.'
                )
              })

            cy.get('li').eq(0).click()
          })

          cy.contains('10000621')
        })
      }
    )

    context("When they don't have work orders attached to them", () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/operatives/hu0001/appointments',
          },
          {
            body: [],
          }
        ).as('operativesWorkOrders')
      })

      it('Displays a warning info box', () => {
        cy.visit('/')
        cy.wait('@operativesWorkOrders')

        cy.get('.warning-info-box').within(() => {
          cy.get('.lbh-body-s').contains('No work orders displayed')
          cy.get('.lbh-body-xs').contains('Please contact your supervisor')
        })
      })
    })
  })
})
