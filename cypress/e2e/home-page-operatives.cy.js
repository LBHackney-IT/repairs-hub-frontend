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

  context.only('When operative visits past work orders page', () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          path: `/api/operatives/017233/workOrdersNew**`,
          // /api/operatives/017233/workOrdersNew?date=2024-11-10
        }
        // {
        //   fixture: 'pastWorkOrders/5thNovemberpastWorkOrders.json',
        // }
      ).as('pastOperativesWorkOrders')
      cy.visit('/oldjobs')
    })
    it('Has a date picker populated with 5 days', () => {
      cy.get('.date-picker-container').within(() => {
        cy.get('option').should('have.length', 5)
      })
    })
    it('Displays past jobs for the chosen date', () => {
      cy.wait('@pastOperativesWorkOrders').then((interception) => {
        // Access the fixture data dynamically
        const fixtureData = interception.response.body
        console.log(fixtureData)
        // cy.get('.operative-work-order-list-item').should(
        //   'have.length',
        //   fixtureData.length
        // )
        //   cy.get('.lbh-list li').each((el, index) => {
        //     const {
        //       appointment: { start, end },
        //       priority,
        //       property,
        //       propertyPostCode,
        //       description,
        //     } = fixtureData[index]
        //     // Format start and end times for display as 'HH:mm – HH:mm'
        //     const formattedTime = `${start} – ${end}`
        //     // Verify that each element contains expected data from the fixture
        //     cy.wrap(el).within(() => {
        //       cy.contains(formattedTime)
        //       cy.contains(priority.toLowerCase())
        //       cy.contains(property)
        //       cy.contains(propertyPostCode)
        //       cy.contains(description)
        // })
        // })
      })
    })
  })

  context('When operative selects different date', () => {
    //Date formatted to send to API
    const targetDateForAPI = '2024-11-04'

    //Date formatted to match UI
    const datePickerDate = 'Nov 04'

    it('Changes the work orders', () => {
      cy.intercept(
        {
          method: 'GET',
          path: `/api/operatives/017233/workOrdersNew?date=${targetDateForAPI}`,
        },
        {
          fixture: 'pastWorkOrders/4thNovemberpastWorkOrders.json',
        }
      ).as('pastOperativesWorkOrders')
      cy.visit('/oldjobs')
      cy.get('.date-picker-container').within(() => {
        cy.get('#date-picker').select(1)
        cy.get('#date-picker').contains(`${datePickerDate}`)
      })
      cy.wait('@pastOperativesWorkOrders').then((interception) => {
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
          //     // Format start and end times for display as 'HH:mm – HH:mm'
          const formattedTime = `${start} – ${end}`
          //     // Verify that each element contains expected data from the fixture
          cy.wrap(el).within(() => {
            cy.contains(formattedTime)
            cy.contains(priority.toLowerCase())
            cy.contains(property.trim())
            cy.contains(propertyPostCode)
            cy.contains(description)
          })
        })
      })
    })
  })

  context(
    "When they don't have any work orders on a particular date in the past",
    () => {
      const targetDateForAPI = '2024-11-05'

      it('Displays a warning info box', () => {
        cy.intercept(
          {
            method: 'GET',
            path: `/api/operatives/017233/workOrdersNew?date=${targetDateForAPI}`,
          },
          {
            body: [],
          }
        ).as('operativesPastWorkOrders')
        cy.visit('/oldjobs')
        cy.wait('@operativesPastWorkOrders')
        cy.get('.warning-info-box').within(() => {
          cy.get('.lbh-body-s').contains('No work orders displayed')
          cy.get('.lbh-body-xs').contains('Please contact your supervisor')
        })
      })
    }
  )
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
