/// <reference types="cypress" />

import 'cypress-audit/commands'
const operativeId = 'hu0001'
context('When an operative is logged in', () => {
  beforeEach(() => {
    cy.loginWithOperativeRole()

    cy.intercept(
      { method: 'GET', path: '/api/workOrders/images/10000621' },
      { body: [] }
    ).as('photosRequest')
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
      // cy.clock(new Date('June 11 2021 13:49:15Z'))

      cy.intercept(
        {
          method: 'GET',
          path: '/api/operatives/hu0001/workorders',
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

    it('Displays work order appointments, priority and any closed status', () => {
      cy.visit('/')
      cy.wait('@operativesWorkOrders')

      cy.get('.lbh-heading-h2').contains('Friday 11 June')

      cy.get('.appointment-details').should('have.length', 4)

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
            cy.contains('08:00 – 13:00')
            cy.contains('normal')
            cy.contains('17 Pitcairn House St Thomass Square')
            cy.contains('L53 GS')
            cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
          })

        cy.get('li')
          .eq(2)
          .within(() => {
            cy.contains('16:00 – 18:00')
            cy.contains('emergency')
            cy.contains('Completed')
            cy.contains('19 Pitcairn House St Thomass Square')
            cy.contains('L53 GS')
            cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
          })

        cy.get('li')
          .eq(3)
          .within(() => {
            cy.contains('17:00 – 18:00')
            cy.contains('emergency')
            cy.contains('No access')
            cy.contains('20 Pitcairn House St Thomass Square')
            cy.contains('L53 GS')
            cy.contains('Lorem ipsum dolor sit amet, consectetur efficitur.')
          })

        cy.get('li').eq(1).click()
      })

      cy.wait(['@operativesWorkOrder', '@property', '@task'])
      cy.contains('WO 10000621')
      cy.get('div[class*="Multibutton"]').should('not.exist')
    })
  })

  context("When they don't have work orders attached to them", () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/operatives/hu0001/workorders',
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

  context('When operative clicks a tab', () => {
    beforeEach(() => {
      // cy.clock(new Date('November 13 2024 13:49:15Z'))
    })
    it('Goes to correct page', () => {
      cy.intercept(
        {
          method: 'GET',
          path: `/api/operatives/${operativeId}/workorders`,
        },
        {
          fixture: 'workOrders/workOrders11thNov.json',
        }
      ).as('operativesWorkOrders')
      cy.intercept(
        {
          method: 'GET',
          path: '/api/operatives/017233/workOrdersNew*',
        },
        {
          fixture: 'pastWorkOrders/10thNovemberpastWorkOrders.json',
        }
      ).as('operativesWorkOrders')
      cy.visit('/')
      cy.get('.govuk-tabs_list-item-mobile-a-tag').should('have.length', 2)
      cy.get('.govuk-tabs_list-item-mobile-a-tag').eq(1).click()
      cy.url().should('include', 'oldjobs')
      cy.get('.govuk-tabs_list-item-mobile-a-tag').eq(0).click()
      cy.url().should('include', '/')
    })
  })

  context('When operative visits past work orders page', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          path: `/api/operatives/${operativeId}/workOrdersNew*`,
        },
        {
          fixture: 'pastWorkOrders/5thNovemberpastWorkOrders.json',
        }
      ).as('pastOperativesWorkOrders')
      cy.visit('/oldjobs')
    })
    it('Has a date picker populated with 5 days', () => {
      cy.get('.date-picker-container').within(() => {
        cy.get('option').should('have.length', 5)
      })
    })
    it('Displays past jobs with expected fields', () => {
      cy.get('.operative-work-order-list-item').should('exist') // Ensure work orders are loaded
      cy.wait('@pastOperativesWorkOrders').then((interception) => {
        // Access the fixture data dynamically
        const fixtureData = interception.response.body
        cy.get('.operative-work-order-list-item').should(
          'have.length',
          fixtureData.length
        )
        cy.get('.lbh-list li').each((el, index) => {
          const {
            appointment: { start, end },
            priority,
            property,
            propertyPostCode,
            description,
          } = fixtureData[index]
          // Format start and end times for display as 'HH:mm – HH:mm'
          const formattedTime = `${start} – ${end}`
          // Verify that each element contains expected data from the fixture
          cy.wrap(el).within(() => {
            cy.contains(formattedTime)
            cy.contains(priority.toLowerCase())
            cy.contains(property)
            cy.contains(propertyPostCode)
            cy.contains(description)
          })
        })
      })
    })
  })

  context('When operative selects different date', () => {
    beforeEach(() => {
      // cy.clock(new Date('November 13 2024 13:49:15Z'))
    })
    it('Changes the work orders', () => {
      cy.intercept(
        {
          method: 'GET',
          path: `/api/operatives/${operativeId}/workOrdersNew?date=2024-11-12`,
        },
        {
          fixture: 'pastWorkOrders/12thNovemberpastWorkOrders.json',
        }
      ).as('workOrders12th')
      cy.intercept(
        {
          method: 'GET',
          path: `/api/operatives/${operativeId}/workOrdersNew?date=2024-11-11`,
        },
        {
          fixture: 'pastWorkOrders/11thNovemberpastWorkOrders.json',
        }
      ).as('workOrders11th')
      cy.visit('/oldjobs')
      cy.intercept(
        {
          method: 'GET',
          path: `/api/operatives/${operativeId}/workOrdersNew?date=2024-11-08`,
        },
        {
          fixture: 'pastWorkOrders/8thNovemberpastWorkOrders.json',
        }
      ).as('workOrders8th')
      cy.visit('/oldjobs')

      cy.wait('@workOrders12th')
      cy.contains('Work order 12th November.')
      cy.get('@workOrders12th.all').should('have.length', 1)

      cy.get('#date-picker').select('Nov 11')
      cy.contains('Work order 11th November.')
      cy.get('@workOrders11th.all').should('have.length', 1)

      cy.get('#date-picker').select('Nov 08')
      cy.contains('Work order 8th November.')
      cy.get('@workOrders8th.all').should('have.length', 1)
    })
  })

  context(
    "When they don't have any work orders on a particular date in the past",
    () => {
      it('Displays a warning info box', () => {
        cy.intercept(
          {
            method: 'GET',
            path: `/api/operatives/${operativeId}/workOrdersNew?date=2024-11-12`,
          },
          {
            body: [],
          }
        ).as('operativesPastWorkOrders')
        cy.visit('/oldjobs')
        cy.wait('@operativesPastWorkOrders')
        cy.contains('No work orders displayed')
      })
    }
  )

  context('When network request fails', () => {
    it.only('Shows an error', () => {
      cy.intercept(
        {
          method: 'GET',
          path: `/api/operatives/${operativeId}/workOrdersNew?date=2024-11-12`,
        },
        { statusCode: 500 }
      )
      cy.visit('/oldjobs')
      cy.contains('Request failed with status code: 500')
    })
  })
})

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
      // cy.clock(new Date('June 11 2021 13:49:15Z'))

      cy.intercept(
        {
          method: 'GET',
          path: '/api/operatives/hu0001/workorders',
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

      cy.get('.lbh-heading-h2').contains('Friday 11 June')

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

  context("When they don't have work orders attached to them", () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/operatives/hu0001/workorders',
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
