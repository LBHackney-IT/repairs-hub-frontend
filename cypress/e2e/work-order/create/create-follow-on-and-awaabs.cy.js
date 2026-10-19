/// <reference types="cypress" />

const now = new Date('2022-02-11T12:00:00')

describe('Raise repair form', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/simple-feature-toggle',
      },
      {
        body: {
          enableNewAwaabsFields: true,
        },
      }
    ).as('feature-toggle')

    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/contact-details/4552c539-2e00-8533-078d-9cc59d9115da',
      },
      { fixture: 'contactDetails/contactDetails.json' }
    ).as('contactDetailsRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/contractors?propertyReference=00012345&tradeCode=PL',
      },
      { fixture: 'contractors/contractors.json' }
    ).as('contractorsRequest')

    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/priorities' },
      { fixture: 'scheduleOfRates/priorities.json' }
    ).as('sorPrioritiesRequest')

    cy.intercept(
      { method: 'GET', path: '/api/schedule-of-rates/trades?propRef=00012345' },
      { fixture: 'scheduleOfRates/trades.json' }
    ).as('tradesRequest')

    cy.intercept(
      { method: 'GET', path: '/api/contractors/*' },
      { fixture: 'contractor/contractor.json' }
    ).as('contractorRequest')

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

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders?*',
      },
      { body: [] }
    ).as('workOrdersRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/workOrders/budget-codes*',
      },
      { fixture: 'scheduleOfRates/budgetCodes.json' }
    ).as('budgetCodesRequest')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=*&isRaisable=true',
      },
      { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
    ).as('sorCodesRequest')

    cy.intercept(
      { method: 'POST', path: '/api/workOrders/schedule' },
      {
        body: {
          id: 10102030,
          statusCode: 200,
          statusCodeDescription: '???',
          externallyManagedAppointment: false,
        },
      }
    ).as('apiCheck')

    cy.clock(now, ['Date'])
  })

  it('Creates repair with follow-on parent', () => {
    cy.loginWithFollowOnAdminRole()

    cy.visit('/properties/00012345/raise-repair/new')
    cy.wait([
      '@propertyRequest',
      '@contactDetailsRequest',
      '@sorPrioritiesRequest',
      '@tradesRequest',
    ])

    cy.get('.lbh-heading-h2').contains('Work order task details')
    cy.contains('Is this for follow on works?')

    // add parent workOrder
    cy.get(':nth-child(1) > [data-testid="isFollowOn"]').click()

    cy.get('[type="submit"]').click()
    cy.contains('Please select a work order')

    cy.get('[data-testid="parentWorkOrder"]').clear().type('invalid value')
    cy.get('[type="submit"]').click()
    cy.contains('Invalid work order reference')

    cy.get('[data-testid="parentWorkOrder"]').clear().type('10001234')
    cy.get('[type="submit"]').click()

    cy.get('#trade').type('Plumbing - PL')

    cy.wait('@contractorsRequest')
    cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'INP5R001 - Pre insp of wrks by Constructr - £1{enter}'
    )
    cy.get('[data-testid="rateScheduleItems[0][quantity]"]').type(1)

    cy.get('[data-testid="priorityCode"]').select('5 [N] NORMAL')
    cy.get('[data-testid="reasonForRepair"]').select('None of the above')

    cy.get('[data-testid="descriptionOfWork"]').type('description')
    cy.get('[data-testid="callerName"]').type('steve')
    cy.get('[data-testid="contactNumber"]').type('1234')

    cy.intercept(
      {
        method: 'POST',
        path: '/api/workOrders/schedule?parentWorkOrderId=10001234',
      },
      {
        body: {
          id: 10102030,
          statusCode: 200,
          statusCodeDescription: '???',
          externallyManagedAppointment: false,
        },
      }
    ).as('scheduleRepairWithFollowOnRequest')

    cy.get('[type="submit"]').contains('Create work order').click()

    cy.wait('@scheduleRepairWithFollowOnRequest', { timeout: 7000 }).then(
      ({ request }) => {
        const referenceIdUuid = request.body.reference[0].id

        cy.wrap(request.body).should('deep.equal', {
          reference: [
            {
              id: referenceIdUuid,
            },
          ],
          descriptionOfWork: 'description',
          priority: {
            priorityCode: 4,
            priorityDescription: '5 [N] NORMAL',
            numberOfDays: 21,
          },
          workClass: {
            workClassCode: 0,
          },
          workElement: [
            {
              rateScheduleItem: [
                {
                  customCode: 'INP5R001',
                  customName: 'Pre insp of wrks by Constructr',
                  quantity: {
                    amount: [1],
                  },
                },
              ],
              trade: [
                {
                  code: 'SP',
                  customCode: 'PL',
                  customName: 'Plumbing - PL',
                },
              ],
            },
          ],
          site: {
            property: [
              {
                propertyReference: '00012345',
                address: {
                  addressLine: ['16 Pitcairn House  St Thomass Square'],
                  postalCode: 'E9 6PT',
                },
                reference: [
                  {
                    id: '00012345',
                  },
                ],
              },
            ],
          },
          instructedBy: {
            name: 'Hackney Housing',
          },
          assignedToPrimary: {
            name: 'PURDY CONTRACTS (C2A)',
            organization: {
              reference: [
                {
                  id: 'PUR',
                },
              ],
            },
          },
          customer: {
            name: 'steve',
            person: {
              name: {
                full: 'steve',
              },
              communication: [
                {
                  channel: {
                    medium: '20',
                    code: '60',
                  },
                  value: '1234',
                },
              ],
            },
          },
          multiTradeWorkOrder: false,
          isAwaabsDampAndMouldRepair: false,
        })
      }
    )
  })

  it('Creates repair with Awaabs Damp & mould', () => {
    cy.loginWithFollowOnAdminRole()

    cy.visit('/properties/00012345/raise-repair/new')
    cy.wait([
      '@propertyRequest',
      '@contactDetailsRequest',
      '@sorPrioritiesRequest',
      '@tradesRequest',
    ])

    cy.get('.lbh-heading-h2').contains('Work order task details')
    cy.contains('Is this for follow on works?')

    cy.get(':nth-child(3) > [data-testid="isFollowOn"]').click()

    cy.get('#trade').type('Plumbing - PL')

    cy.wait('@contractorsRequest')
    cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'INP5R001 - Pre insp of wrks by Constructr - £1{enter}'
    )
    cy.get('[data-testid="rateScheduleItems[0][quantity]"]').type(1)

    cy.get('[data-testid="priorityCode"]').select('5 [N] NORMAL')
    cy.get('[data-testid="reasonForRepair"]').select('Damp & Mould')
    // Validate at least one option is selected
    cy.get('[data-testid="reasonForRepair"]').select('Damp & Mould')

    cy.get('[data-testid="descriptionOfWork"]').type('description')
    cy.get('[data-testid="callerName"]').type('steve')
    cy.get('[data-testid="contactNumber"]').type('1234')

    cy.intercept(
      {
        method: 'POST',
        path: '/api/workOrders/schedule',
      },
      {
        body: {
          id: 10102030,
          statusCode: 200,
          statusCodeDescription: '???',
          externallyManagedAppointment: false,
        },
      }
    ).as('scheduleRepairWithFollowOnRequest')

    cy.get('[type="submit"]').contains('Create work order').click()

    cy.wait('@scheduleRepairWithFollowOnRequest', { timeout: 7000 }).then(
      ({ request }) => {
        const referenceIdUuid = request.body.reference[0].id

        cy.wrap(request.body).should('deep.equal', {
          reference: [
            {
              id: referenceIdUuid,
            },
          ],
          descriptionOfWork: 'description',
          priority: {
            priorityCode: 4,
            priorityDescription: '5 [N] NORMAL',
            numberOfDays: 21,
          },
          workClass: {
            workClassCode: 0,
          },
          workElement: [
            {
              rateScheduleItem: [
                {
                  customCode: 'INP5R001',
                  customName: 'Pre insp of wrks by Constructr',
                  quantity: {
                    amount: [1],
                  },
                },
              ],
              trade: [
                {
                  code: 'SP',
                  customCode: 'PL',
                  customName: 'Plumbing - PL',
                },
              ],
            },
          ],
          site: {
            property: [
              {
                propertyReference: '00012345',
                address: {
                  addressLine: ['16 Pitcairn House  St Thomass Square'],
                  postalCode: 'E9 6PT',
                },
                reference: [
                  {
                    id: '00012345',
                  },
                ],
              },
            ],
          },
          instructedBy: {
            name: 'Hackney Housing',
          },
          assignedToPrimary: {
            name: 'PURDY CONTRACTS (C2A)',
            organization: {
              reference: [
                {
                  id: 'PUR',
                },
              ],
            },
          },
          customer: {
            name: 'steve',
            person: {
              name: {
                full: 'steve',
              },
              communication: [
                {
                  channel: {
                    medium: '20',
                    code: '60',
                  },
                  value: '1234',
                },
              ],
            },
          },
          multiTradeWorkOrder: false,
          isAwaabsDampAndMouldRepair: true,
        })
      }
    )
  })
})
