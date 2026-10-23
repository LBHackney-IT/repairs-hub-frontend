/// <reference types="cypress" />

import {
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
} from '../../../../src/utils/helpers/priorities'

const now = new Date('2022-02-11T12:00:00')

describe('Raise repair form', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/simple-feature-toggle',
      },
      {
        body: {},
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

  describe("when the order is for the 'multi trade' trade and the contractor is Purdy, Axis, or HHL", () => {
    beforeEach(() => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/contractors?propertyReference=00012345&tradeCode=MU',
        },
        { fixture: 'contractors/multiTradeContractors.json' }
      ).as('multiTradeContractorsRequest')

      cy.fixture('contractor/contractor.json').then((contractor) => {
        contractor.multiTradeEnabled = true

        cy.intercept(
          {
            method: 'GET',
            path: `/api/contractors/*`,
          },
          { body: contractor }
        ).as('contractorRequest')
      })

      cy.loginWithAgentAndBudgetCodeOfficerRole()
    })
    ;[
      { code: 'PUR', name: 'PURDY CONTRACTS (C2A)' },
      { code: 'AEP', name: 'Axis Europe (X) PLC' },
      { code: 'HHL', name: 'Herts Heritage Ltd' },
    ].forEach((ctr) => {
      it('Searches SOR codes after entering three characters with a debounced API request', () => {
        cy.visit('/properties/00012345/raise-repair/new')

        cy.wait([
          '@propertyRequest',
          '@contactDetailsRequest',
          '@sorPrioritiesRequest',
          '@tradesRequest',
        ])

        cy.get('#repair-request-form').within(() => {
          cy.get('#trade').type('Multi Trade - MU')

          cy.wait('@multiTradeContractorsRequest')

          cy.get('#contractor').type(`${ctr.name} - ${ctr.code}`)

          cy.wait('@budgetCodesRequest')

          cy.get('[data-testid=budgetCode]').type(
            'H2555 - 200031 - Lifts Breakdown'
          )

          cy.get('input[id="rateScheduleItems[0][code]"]').clear()
          cy.get('input[id="rateScheduleItems[0][code]"]').type('D')

          cy.get('input[id="rateScheduleItems[0][code]"]').type('E')
          cy.requestsCountByUrl('/api/schedule-of-rates/codes*').should('eq', 0)

          cy.intercept(
            {
              method: 'GET',
              path: `/api/schedule-of-rates/codes?tradeCode=MU&propertyReference=00012345&contractorReference=${ctr.code}&isRaisable=true?filter=DES?showAllTrades=true`,
            },
            {
              body: [
                {
                  code: 'DES5R003',
                  shortDescription: 'Immediate call outs',
                  priority: {
                    priorityCode: 1,
                    description: '1 [I] IMMEDIATE',
                  },
                  cost: 0,
                },
                {
                  code: 'DES5R004',
                  shortDescription: 'Emergency call out',
                  priority: {
                    priorityCode: 2,
                    description: '2 [E] EMERGENCY',
                  },
                  cost: 1,
                },
              ],
            }
          ).as('sorCodesRequestDES')

          // Enter three characters, then clear and immediately re-enter them
          cy.get('input[id="rateScheduleItems[0][code]"]').type('S')
          cy.get('input[id="rateScheduleItems[0][code]"]').clear()
          cy.get('input[id="rateScheduleItems[0][code]"]').type('DES')

          cy.wait('@sorCodesRequestDES')

          // The three-character input triggering an API request should have been debounced from 2 requests to just 1
          cy.get('@sorCodesRequestDES.all').should('have.length', 1)

          cy.get('[data-testid="rateScheduleItems[0][code]"]')
            .parent()
            .find('datalist option')
            .should('have.length', 2)
            .first()
            .should('have.attr', 'value', 'DES5R003 - Immediate call outs - £0')
            .next()
            .should('have.attr', 'value', 'DES5R004 - Emergency call out - £1')

          // type the remainder of the code
          cy.get('input[id="rateScheduleItems[0][code]"]').type(
            '5R003 - Immediate call outs - £0'
          )

          // Entering more than three characters does not trigger more API requests
          cy.get('@sorCodesRequestDES.all').should('have.length', 1)

          cy.get('#priorityCode')
            .find('option:selected')
            .should('have.text', '1 [I] IMMEDIATE')

          cy.get('[data-testid="reasonForRepair"]').select('None of the above')

          cy.contains('+ Add another SOR code').click()

          cy.get('input[id="rateScheduleItems[1][code]"]').type('DES')

          cy.wait('@sorCodesRequestDES')

          cy.get('input[id="rateScheduleItems[1][code]"]').type(
            '5R004 - Emergency call out - £1'
          )

          cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
          cy.get('input[id="rateScheduleItems[0][quantity]"]').type('1')

          cy.get('input[id="rateScheduleItems[1][quantity]"]').clear()
          cy.get('input[id="rateScheduleItems[1][quantity]"]').type('1')

          cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')

          cy.get('[data-testid=callerName]').type('Test Caller')
          cy.get('[data-testid=contactNumber]').type('12345678910')

          cy.get('[type="submit"]').contains('Create work order').click()
        })

        cy.wait('@apiCheck', { requestTimeout: 9000 }).then(({ request }) => {
          const referenceIdUuid = request.body.reference[0].id

          cy.wrap(request.body).should('deep.include', {
            reference: [{ id: referenceIdUuid }],
            descriptionOfWork: 'A problem',
            priority: {
              priorityCode: IMMEDIATE_PRIORITY_CODE,
              priorityDescription: '1 [I] IMMEDIATE',
              numberOfDays: 0,
            },
            workElement: [
              {
                rateScheduleItem: [
                  {
                    customCode: 'DES5R003',
                    customName: 'Immediate call outs',
                    quantity: { amount: [1] },
                  },
                ],
                trade: [
                  {
                    code: 'SP',
                    customCode: 'MU',
                    customName: 'Multi Trade - MU',
                  },
                ],
              },
              {
                rateScheduleItem: [
                  {
                    customCode: 'DES5R004',
                    customName: 'Emergency call out',
                    quantity: { amount: [1] },
                  },
                ],
                trade: [
                  {
                    code: 'SP',
                    customCode: 'MU',
                    customName: 'Multi Trade - MU',
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
            assignedToPrimary: {
              name: ctr.name,
              organization: {
                reference: [
                  {
                    id: ctr.code,
                  },
                ],
              },
            },
            budgetCode: { id: '1' },
            multiTradeWorkOrder: true,
            awaabsLawReasonForRepair: [],
          })
        })
      })
    })
  })

  it('Submits an immediate priority work order', () => {
    cy.loginWithAgentAndBudgetCodeOfficerRole()

    cy.visit('/properties/00012345')

    cy.wait(['@propertyRequest', '@workOrdersRequest'])

    cy.contains('a', 'Raise a work order on this dwelling').click()

    cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

    cy.get('#repair-request-form').within(() => {
      cy.get('#trade').type('Plumbing - PL')

      cy.wait('@contractorsRequest')

      cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

      cy.wait('@budgetCodesRequest')

      cy.get('[data-testid=budgetCode]').type(
        'H2555 - 200031 - Lifts Breakdown'
      )

      cy.get('input[id="rateScheduleItems[0][code]"]').clear()
      cy.get('input[id="rateScheduleItems[0][code]"]').type(
        'DES5R003 - Immediate call outs - £0'
      )

      // Autopopulates priority description
      cy.get('#priorityCode')
        .find('option:selected')
        .should('have.text', '1 [I] IMMEDIATE')

      cy.get('[data-testid="reasonForRepair"]').select('None of the above')

      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
      cy.get('input[id="rateScheduleItems[0][quantity]"]').type('1')

      cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')

      cy.get('[data-testid=callerName]').type('Test Caller')
      cy.get('[data-testid=contactNumber]').type('12345678910')

      cy.get('[type="submit"]').contains('Create work order').click()
    })

    cy.wait('@apiCheck').then(({ request }) => {
      cy.wrap(request.body).should('deep.include', {
        priority: {
          priorityCode: IMMEDIATE_PRIORITY_CODE,
          priorityDescription: '1 [I] IMMEDIATE',
          numberOfDays: 0,
        },
      })
    })
  })

  it('Submits an order above the user raise limit for authorisation', () => {
    cy.loginWithAgentAndBudgetCodeOfficerRole()

    cy.intercept(
      { method: 'POST', path: '/api/workOrders/schedule' },
      {
        body: {
          id: 10102030,
          statusCode: 1010,
          statusCodeDescription: '???',
          externallyManagedAppointment: false,
        },
      }
    ).as('apiCheck')

    cy.visit('/properties/00012345/raise-repair/new')

    cy.wait([
      '@propertyRequest',
      '@contactDetailsRequest',
      '@sorPrioritiesRequest',
      '@tradesRequest',
    ])

    cy.get('#trade').type('Plumbing - PL')
    cy.wait('@contractorsRequest')

    cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

    cy.wait('@budgetCodesRequest')

    cy.get('[data-testid=budgetCode]').type('H2555 - 200031 - Lifts Breakdown')

    // Select an SOR with no cost

    cy.get('input[id="rateScheduleItems[0][code]"]').clear()
    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'DES5R003 - Immediate call outs - £0'
    )

    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('500')

    // Within user's raise limit so no warning text is displayed
    cy.get('[data-testid=over-spend-limit]').should('not.exist')

    // Select an SOR with cost: £50.17
    cy.contains('+ Add another SOR code').click()

    cy.get('input[id="rateScheduleItems[1][code]"]').clear()
    cy.get('input[id="rateScheduleItems[1][code]"]').type(
      '20060020 - BATHROOM PLUMBING REPAIRS - £50.17'
    )

    // Select a quantity to make total 50.17 x 5 = 250.85
    cy.get('input[id="rateScheduleItems[1][quantity]"]').type('5')

    // Warning text as user's raise limit (£250) has been exceeded
    cy.get('[data-testid=over-spend-limit]').contains(
      'The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation'
    )

    // Change quantity to make total 50.17 x 4 = 200.68
    cy.get('input[id="rateScheduleItems[1][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[1][quantity]"]').type('4')

    // Add another SOR with cost: £5.80
    cy.contains('+ Add another SOR code').click()

    cy.get('input[id="rateScheduleItems[2][code]"]').clear()
    cy.get('input[id="rateScheduleItems[2][code]"]').type(
      '20060030 - KITCHEN PLUMBING REPAIRS - £5.8'
    )

    // Add quantity of 1 to make total 200.68 + (5.80 x 9) = 252.88
    cy.get('input[id="rateScheduleItems[2][quantity]"]').type('9')

    // Warning text as user's raise limit (£250) has been exceeded
    cy.get('[data-testid=over-spend-limit]').contains(
      'The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation'
    )

    // Remove SOR at index 1 to make total cost 5.80 x 9 = 52.2
    cy.get('button[id="remove-rate-schedule-item-1"]').click()

    // Within user's raise limit so no warning text is displayed
    cy.get('[data-testid=over-spend-limit]').should('not.exist')

    // Edit quantity to 43 to make total 5.80 x 43 = 249.4
    cy.get('input[id="rateScheduleItems[2][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[2][quantity]"]').type('43')

    // Within user's raise limit so no warning text is displayed
    cy.get('[data-testid=over-spend-limit]').should('not.exist')

    // Edit quantity to 44 to make total 5.80 x 44 = 255.2
    cy.get('input[id="rateScheduleItems[2][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[2][quantity]"]').type('44')

    // Warning text as user's raise limit (£250) has been exceeded
    cy.get('[data-testid=over-spend-limit]').contains(
      'The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation'
    )

    cy.get('[data-testid="reasonForRepair"]').select('None of the above')

    // Fill in Repair Description
    cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')

    //Fill in contact details
    cy.get('#callerName').type('Test Caller', { force: true })
    cy.get('#contactNumber').type('1', { force: true })

    // Submit form for high cost (over raise limit) authorisation
    cy.get('[type="submit"]').contains('Create work order').click()

    cy.wait('@apiCheck')

    // Confirmation screen
    cy.get('.govuk-panel__title').contains(
      'Work order created but requires authorisation'
    )

    cy.get('.govuk-panel__body').contains('Reference number')
    cy.get('.govuk-panel__body').contains('10102030')

    // Warning text as this work order is over the raise limit
    cy.get('.govuk-warning-text.lbh-warning-text')
      .get('.govuk-warning-text__text')
      .contains('Please request authorisation from a manager')

    // Actions to see relevant pages
    cy.get('.lbh-list li')
      .contains('View work order')
      .should('have.attr', 'href', '/work-orders/10102030')

    cy.get('.lbh-list li')
      .contains('Back to 16 Pitcairn House')
      .should('have.attr', 'href', '/properties/00012345')

    cy.get('.lbh-list li')
      .contains('Start a new search')
      .should('have.attr', 'href', '/')
  })

  describe('when contractor is not Purdy', () => {
    beforeEach(() => {
      cy.loginWithAgentAndBudgetCodeOfficerRole()
    })

    it('Gets full list of budget codes', () => {
      cy.visit('/properties/00012345/raise-repair/new')
      cy.wait([
        '@propertyRequest',
        '@contactDetailsRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
      ])

      cy.get('.lbh-heading-h2').contains('Work order task details')

      cy.get('#trade').type('Plumbing - PL')
      cy.wait('@contractorsRequest')

      cy.get('#contractor').type('HH Painting - H09')
      cy.wait('@budgetCodesRequest')

      cy.get('[data-testid=budgetCode]').type('H2555 - 200157 - Garage Repairs')
      cy.wait('@sorCodesRequest')

      cy.get('input[id="rateScheduleItems[0][code]"]').clear()
      cy.get('input[id="rateScheduleItems[0][code]"]').type(
        'DES5R005 - Normal call outs - £1'
      )

      cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
      cy.get('input[id="rateScheduleItems[0][quantity]"]').type('1')

      cy.get('[data-testid="reasonForRepair"]').select('None of the above')

      cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')

      cy.get('[data-testid=callerName]').type('Test Caller')
      cy.get('[data-testid=contactNumber]').type('1')

      cy.get('[type="submit"]')
        .contains('Create work order')
        .click({ force: true })

      cy.wait('@apiCheck').then(({ request }) => {
        const referenceIdUuid = request.body.reference[0].id

        cy.wrap(request.body).should('deep.equal', {
          reference: [{ id: referenceIdUuid }],
          descriptionOfWork: 'A problem',
          priority: {
            priorityCode: NORMAL_PRIORITY_CODE,
            priorityDescription: '5 [N] NORMAL',
            numberOfDays: 21,
          },
          workClass: { workClassCode: 0 },
          workElement: [
            {
              rateScheduleItem: [
                {
                  customCode: 'DES5R005',
                  customName: 'Normal call outs',
                  quantity: { amount: [1] },
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
          instructedBy: { name: 'Hackney Housing' },
          assignedToPrimary: {
            name: 'HH Painting',
            organization: {
              reference: [
                {
                  id: 'H09',
                },
              ],
            },
          },
          customer: {
            name: 'Test Caller',
            person: {
              name: {
                full: 'Test Caller',
              },
              communication: [
                {
                  channel: {
                    medium: '20',
                    code: '60',
                  },
                  value: '1',
                },
              ],
            },
          },
          budgetCode: { id: '12' },
          multiTradeWorkOrder: false,
          awaabsLawReasonForRepair: [],
        })
      })
    })
  })
})
