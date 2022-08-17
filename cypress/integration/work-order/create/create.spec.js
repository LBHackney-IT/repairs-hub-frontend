/// <reference types="cypress" />

import 'cypress-audit/commands'
import { MULTITRADE_SOR_INCREMENTAL_SEARCH_ENABLED_KEY } from '../../../../src/utils/constants'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
} from '../../../../src/utils/helpers/priorities'

const now = new Date('2022-02-11T12:00:00')

describe('Raise repair form', () => {
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    ).as('propertyRequest')

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
        path: '/api/properties/tenancyAgreementRef1/person-alerts',
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
        path: '/api/workOrders/budget-codes?contractorReference=PCL',
      },
      { fixture: 'scheduleOfRates/budgetCodes.json' }
    ).as('budgetCodesRequest')

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=PCL&isRaisable=true',
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

    cy.intercept(
      { method: 'GET', path: '/api/toggles' },
      {
        body: [
          {
            featureToggles: {
              [MULTITRADE_SOR_INCREMENTAL_SEARCH_ENABLED_KEY]: true,
            },
          },
        ],
      }
    ).as('featureToggle')

    cy.clock(now, ['Date'])
  })

  it('Validates missing form inputs', () => {
    cy.loginWithAgentAndBudgetCodeOfficerRole()

    cy.visit('/properties/00012345/raise-repair/new')

    cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

    cy.get('[type="submit"]')
      .contains('Create work order')
      .click({ force: true })

    cy.get('#trade-form-group .govuk-error-message').within(() => {
      cy.contains('Please select a trade')
    })

    cy.get('#contractor-form-group .govuk-error-message').within(() => {
      cy.contains('Please select a contractor')
    })

    cy.get(
      'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
    ).within(() => {
      cy.contains('Please select an SOR code')
    })

    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).within(() => {
      cy.contains('Please enter a quantity')
    })

    cy.get('#priorityCode-form-group .govuk-error-message').within(() => {
      cy.contains('Please select a priority')
    })

    cy.get('#descriptionOfWork-form-group .govuk-error-message').within(() => {
      cy.contains('Please enter a repair description')
    })

    cy.get('#repair-request-form').within(() => {
      cy.get('#trade').type('Plumbing - PL')

      cy.wait('@contractorsRequest')

      cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

      cy.wait('@budgetCodesRequest')
    })

    cy.get('[type="submit"]')
      .contains('Create work order')
      .click({ force: true })

    cy.get('#budgetCode-form-group .govuk-error-message').within(() => {
      cy.contains('Please select a budget code')
    })
  })

  it('Shows address, tenure, alerts and property contact information', () => {
    cy.loginWithAgentRole()

    cy.visit('/properties/00012345/raise-repair/new')
    cy.wait([
      '@propertyRequest',
      '@sorPrioritiesRequest',
      '@tradesRequest',
      '@personAlerts',
      '@locationAlerts',
    ])

    cy.get('.govuk-caption-l').contains('New repair')
    cy.get('.lbh-heading-h1').contains('Dwelling: 16 Pitcairn House')

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

    cy.get('.govuk-table')
      .contains('Contacts')
      .parent()
      .within(() => {
        cy.get('tbody>tr').eq(0).contains('Mark Gardner')
        cy.get('tbody>tr').eq(0).contains('00000111111')
        cy.get('tbody>tr').eq(0).contains('00000222222')

        cy.get('tbody>tr').eq(1).contains('Luam Berhane')
        cy.get('tbody>tr').eq(1).contains('00000666666')
      })
  })

  context('as a user with agent and budget code officer roles', () => {
    beforeEach(() => {
      cy.loginWithAgentAndBudgetCodeOfficerRole()

      cy.intercept(
        { method: 'GET', path: '/api/properties/00012345' },
        { fixture: 'properties/property.json' }
      ).as('propertyRequest')

      cy.intercept(
        { method: 'GET', path: '/api/schedule-of-rates/priorities' },
        { fixture: 'scheduleOfRates/priorities.json' }
      ).as('sorPrioritiesRequest')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/schedule-of-rates/trades?propRef=00012345',
        },
        { fixture: 'scheduleOfRates/trades.json' }
      ).as('tradesRequest')

      cy.intercept(
        { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
        { body: { propertyIsInLegalDisrepair: false } }
      ).as('propertyIsNotInLegalDisrepair')

      cy.clock(now)
    })

    it('Submits work order task details to raise a work order', () => {
      cy.visit('/properties/00012345/raise-repair/new')
      cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

      cy.get('.lbh-heading-h2').contains('Work order task details')

      cy.get('#repair-request-form').within(() => {
        // Expect contractors and sor code selection to be disabled until trade selected
        cy.get('#contractor').should('be.disabled')
        cy.get('input[id="rateScheduleItems[0][code]"]').should('be.disabled')
        cy.get('input[id="rateScheduleItems[0][quantity]"]').should(
          'be.disabled'
        )
        // Select a trade (<datalist> required typed input for testing)
        cy.get('#trade').type('Plumbing - PL')

        cy.wait('@contractorsRequest')

        // Contractor select is no longer disabled but sor code selection still is
        cy.get('#contractor').should('not.be.disabled')

        cy.get('input[id="rateScheduleItems[0][code]"]').should('be.disabled')
        cy.get('input[id="rateScheduleItems[0][quantity]"]').should(
          'be.disabled'
        )

        // Select a contractor
        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

        cy.wait('@budgetCodesRequest')

        cy.get('[data-testid=budgetCode]').type(
          'H2555 - 200031 - Lifts Breakdown'
        )

        cy.wait(['@sorCodesRequest'])

        // SOR select is no longer disabled
        cy.get('input[id="rateScheduleItems[0][code]"]').should(
          'not.be.disabled'
        )
        cy.get('input[id="rateScheduleItems[0][quantity]"]').should(
          'not.be.disabled'
        )

        // Priority disabled until SOR is selected
        cy.get('#priorityCode').should('be.disabled')

        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('INP5R001 - Pre insp of wrks by Constructr - £1{enter}')

        cy.get('#priorityCode').should('not.be.disabled')

        // Selecting no trade clears contractor and SOR code select options
        cy.get('#trade').clear()
        cy.get('#contractor').should('be.disabled')
        cy.get('input[id="rateScheduleItems[0][code]"]').should('be.disabled')
        cy.get('input[id="rateScheduleItems[0][quantity]"]').should(
          'be.disabled'
        )

        // Select trade not included in list
        cy.get('#trade').type('Fake trade')

        cy.get('[type="submit"]').contains('Create work order').click()

        cy.get('#trade-form-group .govuk-error-message').within(() => {
          cy.contains('Trade is not valid')
        })

        // Select valid trade
        cy.get('#trade').clear().type('Plumbing - PL')

        cy.wait('@contractorsRequest')

        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

        cy.get('[data-testid=budgetCode]').type(
          'H2555 - 200108 - Gutter Clearance'
        )

        cy.get('input[id="rateScheduleItems[0][code]"]').type('INP')

        cy.get(
          'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('SOR code is not valid')
        })

        // Select SOR code with no priority attached
        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('INP5R001 - Pre insp of wrks by Constructr')

        // Does not autopopulate priority description
        cy.get('#priorityCode').should('have.value', '')

        // Select SOR code with priority attached
        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R003 - Immediate call outs - £0{enter}')

        // Autopopulates priority description
        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '1 [I] IMMEDIATE')

        // Removes Task Priority validation errors
        cy.get('#priorityCode-form-group .govuk-error-message').should(
          'not.exist'
        )

        // Select another SOR code
        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R004 - Emergency call out - £1{enter}')

        // Autopopulates priority description
        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '2 [E] EMERGENCY')

        // Assigns description and contractor ref to hidden field
        cy.get('input[id="rateScheduleItems[0][description]"]').should(
          'have.value',
          'Emergency call out'
        )
        // Removes SOR Code validation errors
        cy.get(
          'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
        ).should('not.exist')

        // Select blank SOR Code
        cy.get('input[id="rateScheduleItems[0][code]"]').clear()
        cy.get(
          'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('Please select an SOR code')
        })

        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R005 - Normal call outs - £1{enter}')

        // Enter a blank quantity
        cy.get('input[id="rateScheduleItems[0][quantity]"]').type('x')
        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('Please enter a quantity')
        })

        // Enter a non-number quantity
        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('x')
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('Quantity must be a number')
        })

        // Enter a quantity with 1 decimal point
        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('1.5')
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).should('not.exist')
        // Enter a quantity with 2 decimal points
        cy.get('input[id="rateScheduleItems[0][quantity]"]')
          .clear()
          .type('1.55')
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).should('not.exist')
        // Enter a quantity less than 1 with 2 decimal points
        cy.get('input[id="rateScheduleItems[0][quantity]"]')
          .clear()
          .type('0.55')
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).should('not.exist')
        // Enter a quantity with more than 2 decimal points
        cy.get('input[id="rateScheduleItems[0][quantity]"]')
          .clear()
          .type('1.555')
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains(
            'Quantity including a decimal point is permitted a maximum of 2 decimal places'
          )
        })

        // Enter a quantity less than the minimum
        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('0')
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('Quantity must be greater than 0')
        })
        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('-1')
        cy.get(
          'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('Quantity must be greater than 0')
        })

        // Enter a valid quantity
        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('1')

        // Adding multiple SOR codes
        // Remove link does not exist when just one SOR code selector component
        cy.get('.remove-rate-schedule-item').should('not.exist')
        cy.contains('+ Add another SOR code').click()
        // Remove link now exists for additional SOR code selector component
        cy.get('.remove-rate-schedule-item').contains('Remove')

        // Select SOR Code from dropdown

        cy.get('input[id="rateScheduleItems[1][code]"]')
          .clear()
          .type('DES5R013 - Inspect additional sec entrance - £1{enter}')

        // Priority description should remain same because inspection is a lower priority than normal
        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '5 [N] NORMAL')

        // Add another SOR code with higher priority
        cy.contains('+ Add another SOR code').click()
        cy.get('input[id="rateScheduleItems[2][code]"]')
          .clear()
          .type('DES5R003 - Immediate call outs - £0{enter}')

        // Autopopulates priority description with the highest priority
        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '1 [I] IMMEDIATE')

        // Add another SOR code with an emergency priority
        cy.contains('+ Add another SOR code').click()

        cy.get('input[id="rateScheduleItems[3][code]"]')
          .clear()
          .type('DES5R004 - Emergency call out - £1{enter}')

        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '1 [I] IMMEDIATE')
        // Remove SOR code at index 2
        cy.get('button[id="remove-rate-schedule-item-2"]').click()
        // Autopopulates priority description with the remaining highest priority
        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '2 [E] EMERGENCY')
        cy.get('button[id="remove-rate-schedule-item-3"]').click()
        // Autopopulates priority description with the remaining highest priority
        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '5 [N] NORMAL')

        // Select SOR code with emergency priority at index 1

        cy.get('input[id="rateScheduleItems[1][code]"]')
          .clear()
          .type('DES5R004 - Emergency call out - £1{enter}')

        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '2 [E] EMERGENCY')

        // Try to submit form without quantity for this SOR code at index 1
        cy.get('[type="submit"]')
          .contains('Create work order')
          .click({ force: true })

        cy.get(
          'div[id="rateScheduleItems[1][quantity]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('Please enter a quantity')
        })
        // Remove SOR code at index 1
        cy.get('input[id="rateScheduleItems[1][code]"]').clear()
        cy.get(
          'div[id="rateScheduleItems[1][code]-form-group"] .govuk-error-message'
        ).within(() => {
          cy.contains('Please select an SOR code')
        })
        // Enter SOR code and quantity

        cy.get('input[id="rateScheduleItems[1][code]"]')
          .clear()
          .type('DES5R005 - Normal call outs - £1{enter}')

        cy.get(
          'div[id="rateScheduleItems[1][code]-form-group"] .govuk-error-message'
        ).should('not.exist')

        cy.get('input[id="rateScheduleItems[1][quantity]"]').clear().type('3')
        cy.get(
          'div[id="rateScheduleItems[1][quantity]-form-group"] .govuk-error-message'
        ).should('not.exist')
        // Add another SOR code
        cy.contains('+ Add another SOR code').click()

        cy.get('input[id="rateScheduleItems[1][code]"]')
          .clear()
          .type('DES5R006 - Urgent call outs - £1{enter}')

        cy.get('input[id="rateScheduleItems[2][quantity]"]').clear().type('2')
        // Delete the SOR code at the targeted index
        cy.get('button[id="remove-rate-schedule-item-1"]').click()
        cy.get('input[id="rateScheduleItems[1][code]"]').should('not.exist')
        cy.get('input[id="rateScheduleItems[1][quantity]"]').should('not.exist')
        cy.get('input[id="rateScheduleItems[1][description]"]').should(
          'not.exist'
        )
        // Remaining SOR codes
        cy.get('button[id="remove-rate-schedule-item-1"]').should('not.exist')

        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R004 - Emergency call out - £1{enter}')

        cy.get('input[id="rateScheduleItems[0][code]"]').should(
          'have.value',
          'DES5R004 - Emergency call out - £1'
        )
        cy.get('input[id="rateScheduleItems[0][quantity]"]').should(
          'have.value',
          '1'
        )
        cy.get('button[id="remove-rate-schedule-item-0"]').should('not.exist')

        cy.get('input[id="rateScheduleItems[2][code]"]')
          .clear()
          .type('DES5R006 - Urgent call outs - £1')

        cy.get('input[id="rateScheduleItems[2][quantity]"]').should(
          'have.value',
          '2'
        )
        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '2 [E] EMERGENCY')
        cy.get('button[id="remove-rate-schedule-item-2"]').contains('Remove')

        // No warning if within raise limit
        cy.get('[data-testid=over-spend-limit]').should('not.exist')

        // Go over the Repair description character limit
        cy.get('#descriptionOfWork')
          .get('.govuk-textarea')
          .type('x'.repeat(231))
        cy.get('#descriptionOfWork-form-group .govuk-error-message').within(
          () => {
            cy.contains('You have exceeded the maximum amount of characters')
          }
        )
        // Delete all Repair Description text
        cy.get('#descriptionOfWork').get('.govuk-textarea').clear()
        cy.get('#descriptionOfWork-form-group .govuk-error-message').within(
          () => {
            cy.contains('Please enter a repair description')
          }
        )
        // Fill in Repair Description within character limit
        cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')
        cy.get('.govuk-hint').within(() => {
          cy.contains('You have 221 characters remaining.')
        })
        // Removes Repair Description validation errors
        cy.get('#descriptionOfWork-form-group .govuk-error-message').should(
          'not.exist'
        )

        //Submit form without contact and coller name details
        cy.get('[data-testid=contact-number-warning]').within(() => {
          cy.contains('Need to add an additional contact number?')
          cy.contains(
            'Any additional contact numbers can be added into the Repair description field'
          )
        })
        cy.get('[type="submit"]')

        cy.get('#callerName-form-group .govuk-error-message').within(() => {
          cy.contains('Please add caller name')
        })
        cy.get('#contactNumber-form-group .govuk-error-message').within(() => {
          cy.contains('Please add telephone number')
        })

        //Submit form with letters instead of number in telephone number field
        cy.get('[data-testid=contactNumber]').type('NA')

        cy.get('[type="submit"]')

        cy.get('#contactNumber-form-group .govuk-error-message').within(() => {
          cy.contains(
            'Telephone number should be a number and with no empty spaces'
          )
        })

        //Submit form with space in telephone number field
        cy.get('[data-testid=contactNumber]').clear()
        cy.get('[data-testid=contactNumber]').type('12 45 ')
        cy.get('[type="submit"]')

        cy.get('#contactNumber-form-group .govuk-error-message').within(() => {
          cy.contains(
            'Telephone number should be a number and with no empty spaces'
          )
        })

        //Submit form with telephone number longer than 11 digits
        cy.get('[data-testid=contactNumber]').clear()
        cy.get('[data-testid=contactNumber]').type('12345671234567')
        cy.get('[type="submit"]')

        cy.get('#contactNumber-form-group .govuk-error-message').within(() => {
          cy.contains('Please enter a valid UK telephone number (11 digits)')
        })

        // Fill in contact details
        cy.get('[data-testid=callerName]').type('Test Caller')
        cy.get('[data-testid=contactNumber]').clear()
        cy.get('[data-testid=contactNumber]').type('12345678910')
      })

      cy.get('[type="submit"]')
        .contains('Create work order')
        .click({ force: true })

      cy.wait('@apiCheck', { requestTimeout: 7000 }).then(({ request }) => {
        const referenceIdUuid = request.body.reference[0].id

        cy.wrap(request.body).should('deep.equal', {
          reference: [{ id: referenceIdUuid }],
          descriptionOfWork: 'A problem',
          priority: {
            priorityCode: EMERGENCY_PRIORITY_CODE,
            priorityDescription: '2 [E] EMERGENCY',
            numberOfDays: 1,
          },
          workClass: { workClassCode: 0 },
          workElement: [
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
                  customCode: 'PL',
                  customName: 'Plumbing - PL',
                },
              ],
            },
            {
              rateScheduleItem: [
                {
                  customCode: 'DES5R006',
                  customName: 'Urgent call outs',
                  quantity: { amount: [2] },
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
            name: 'Purdy Contracts (P) Ltd',
            organization: {
              reference: [
                {
                  id: 'PCL',
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
                  value: '12345678910',
                },
              ],
            },
          },
          budgetCode: { id: '4' },
          multiTradeWorkOrder: false,
        })
      })

      // Confirmation screen
      cy.get('.govuk-panel').within(() => {
        cy.get('.govuk-panel__title').contains('Work order created')
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10102030')
        })
      })
      // No warning if within raise limit
      cy.get('[data-testid=over-spend-limit]').should('not.exist')

      // Actions to see relevant pages
      cy.get('.lbh-list li').within(() => {
        cy.contains('View work order').should(
          'have.attr',
          'href',
          '/work-orders/10102030'
        )
        cy.contains('Back to 16 Pitcairn House').should(
          'have.attr',
          'href',
          '/properties/00012345'
        )
        cy.contains('Start a new search').should('have.attr', 'href', '/')
      })

      // Run lighthouse audit for accessibility report
      cy.audit()
    })

    describe("when the order is for the 'multi trade' trade and the contractor is Purdy", () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/contractors?propertyReference=00012345&tradeCode=MU',
          },
          { fixture: 'contractors/multiTradeContractors.json' }
        ).as('multiTradeContractorsRequest')
      })

      context('and the incremental multitrade SOR search toggle is on', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', path: '/api/toggles' },
            {
              body: [
                {
                  featureToggles: {
                    [MULTITRADE_SOR_INCREMENTAL_SEARCH_ENABLED_KEY]: true,
                  },
                },
              ],
            }
          ).as('toggleRequest')
        })

        it('Searches SOR codes after entering three characters with a debounced API request', () => {
          cy.visit('/properties/00012345/raise-repair/new')

          cy.wait([
            '@propertyRequest',
            '@sorPrioritiesRequest',
            '@tradesRequest',
          ])

          cy.get('#repair-request-form').within(() => {
            cy.get('#trade').type('Multi Trade - MU')

            cy.wait('@multiTradeContractorsRequest')

            cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

            cy.wait('@budgetCodesRequest')

            cy.get('[data-testid=budgetCode]').type(
              'H2555 - 200031 - Lifts Breakdown'
            )

            cy.wait('@toggleRequest')

            cy.get('input[id="rateScheduleItems[0][code]"]').clear().type('D')

            cy.get('input[id="rateScheduleItems[0][code]"]').type('E')
            cy.requestsCountByUrl('/api/schedule-of-rates/codes*').should(
              'eq',
              0
            )

            cy.intercept(
              {
                method: 'GET',
                path:
                  '/api/schedule-of-rates/codes?tradeCode=MU&propertyReference=00012345&contractorReference=PCL&isRaisable=true?filter=DES?showAllTrades=true',
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
            cy.get('input[id="rateScheduleItems[0][code]"]')
              .type('S')
              .clear()
              .type('DES')

            cy.wait('@sorCodesRequestDES')

            // The three-character input triggering an API request should have been debounced from 2 requests to just 1
            cy.requestsCountByUrl('/api/schedule-of-rates/codes*').should(
              'eq',
              1
            )

            cy.get('[data-testid="rateScheduleItems[0][code]"]')
              .parent()
              .find('datalist option')
              .should('have.length', 2)
              .first()
              .should(
                'have.attr',
                'value',
                'DES5R003 - Immediate call outs - £0'
              )
              .next()
              .should(
                'have.attr',
                'value',
                'DES5R004 - Emergency call out - £1'
              )

            // type the remainder of the code
            cy.get('input[id="rateScheduleItems[0][code]"]').type(
              '5R003 - Immediate call outs - £0'
            )

            // Entering more than three characters does not trigger more API requests
            cy.requestsCountByUrl('/api/schedule-of-rates/codes*').should(
              'eq',
              1
            )

            cy.get('#priorityCode')
              .find('option:selected')
              .should('have.text', '1 [I] IMMEDIATE')

            cy.contains('+ Add another SOR code').click()

            cy.get('input[id="rateScheduleItems[1][code]"]').type('DES')

            cy.wait('@sorCodesRequestDES')

            cy.get('input[id="rateScheduleItems[1][code]"]').type(
              '5R004 - Emergency call out - £1'
            )

            cy.get('input[id="rateScheduleItems[0][quantity]"]')
              .clear()
              .type('1')

            cy.get('input[id="rateScheduleItems[1][quantity]"]')
              .clear()
              .type('1')

            cy.get('#descriptionOfWork')
              .get('.govuk-textarea')
              .type('A problem')

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
                name: 'Purdy Contracts (P) Ltd',
                organization: {
                  reference: [
                    {
                      id: 'PCL',
                    },
                  ],
                },
              },
              budgetCode: { id: '1' },
              multiTradeWorkOrder: true,
            })
          })
        })
      })

      context('and the incremental multitrade SOR search toggle is off', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', path: '/api/toggles' },
            {
              body: [
                {
                  featureToggles: {
                    [MULTITRADE_SOR_INCREMENTAL_SEARCH_ENABLED_KEY]: false,
                  },
                },
              ],
            }
          )

          cy.intercept(
            {
              method: 'GET',
              path:
                '/api/schedule-of-rates/codes?tradeCode=MU&propertyReference=00012345&contractorReference=PCL&isRaisable=true',
            },
            { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
          ).as('sorCodesRequestMultiTrade')
        })

        it('searches SOR codes after loading them all into a list', () => {
          cy.visit('/properties/00012345')

          cy.wait(['@propertyRequest', '@workOrdersRequest'])

          cy.get('.lbh-heading-h2')
            .contains('Raise a work order on this dwelling')
            .click()

          cy.wait([
            '@propertyRequest',
            '@sorPrioritiesRequest',
            '@tradesRequest',
          ])

          cy.get('#repair-request-form').within(() => {
            cy.get('#trade').type('Multi Trade - MU')

            cy.wait('@multiTradeContractorsRequest')

            cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

            cy.wait('@budgetCodesRequest')

            cy.get('[data-testid=budgetCode]').type(
              'H2555 - 200031 - Lifts Breakdown'
            )

            cy.wait('@sorCodesRequestMultiTrade')

            cy.get('[data-testid="rateScheduleItems[0][code]"]')
              .parent()
              .find('datalist option')
              .should('have.length', 7)
              .first()
              .should(
                'have.attr',
                'value',
                '20060020 - BATHROOM PLUMBING REPAIRS - £50.17'
              )
              .next()
              .should(
                'have.attr',
                'value',
                '20060030 - KITCHEN PLUMBING REPAIRS - £5.8'
              )
              .next()
              .should(
                'have.attr',
                'value',
                'DES5R003 - Immediate call outs - £0'
              )
              .next()
              .should(
                'have.attr',
                'value',
                'DES5R004 - Emergency call out - £1'
              )
              .next()
              .should('have.attr', 'value', 'DES5R005 - Normal call outs - £1')
              .next()
              .should('have.attr', 'value', 'DES5R006 - Urgent call outs - £1')
              .next()
              .should(
                'have.attr',
                'value',
                'INP5R001 - Pre insp of wrks by Constructr - £1'
              )
          })
        })
      })

      context('when the toggle API request errors', () => {
        beforeEach(() => {
          cy.intercept(
            { method: 'GET', path: '/api/toggles' },
            {
              statusCode: 500,
            }
          ).as('featureToggle')

          cy.intercept(
            {
              method: 'GET',
              path:
                '/api/schedule-of-rates/codes?tradeCode=MU&propertyReference=00012345&contractorReference=PCL&isRaisable=true',
            },
            { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
          ).as('sorCodesRequestMultiTrade')
        })

        it('does not prevent loading of the form', () => {
          cy.visit('/properties/00012345')

          cy.wait(['@propertyRequest', '@workOrdersRequest'])

          cy.get('.lbh-heading-h2')
            .contains('Raise a work order on this dwelling')
            .click()

          cy.wait([
            '@propertyRequest',
            '@sorPrioritiesRequest',
            '@tradesRequest',
          ])

          cy.get('#repair-request-form').within(() => {
            cy.get('#trade').type('Multi Trade - MU')

            cy.wait('@multiTradeContractorsRequest')

            cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

            cy.wait('@budgetCodesRequest')

            cy.get('[data-testid=budgetCode]').type(
              'H2555 - 200031 - Lifts Breakdown'
            )

            cy.wait('@sorCodesRequestMultiTrade')

            cy.get('[data-testid="rateScheduleItems[0][code]"]')
              .parent()
              .find('datalist option')
              .should('have.length', 7)
          })
        })
      })
    })

    it('Submits an immediate priority work order', () => {
      cy.visit('/properties/00012345')

      cy.wait(['@propertyRequest', '@workOrdersRequest'])

      cy.get('.lbh-heading-h2')
        .contains('Raise a work order on this dwelling')
        .click()

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait('@contractorsRequest')

        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

        cy.wait('@budgetCodesRequest')

        cy.get('[data-testid=budgetCode]').type(
          'H2555 - 200031 - Lifts Breakdown'
        )

        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R003 - Immediate call outs - £0')

        // Autopopulates priority description
        cy.get('#priorityCode')
          .find('option:selected')
          .should('have.text', '1 [I] IMMEDIATE')

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('1')

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

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

      cy.get('#trade').type('Plumbing - PL')
      cy.wait('@contractorsRequest')

      cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

      cy.wait('@budgetCodesRequest')

      cy.get('[data-testid=budgetCode]').type(
        'H2555 - 200031 - Lifts Breakdown'
      )

      // Select an SOR with no cost

      cy.get('input[id="rateScheduleItems[0][code]"]')
        .clear()
        .type('DES5R003 - Immediate call outs - £0')

      cy.get('input[id="rateScheduleItems[0][quantity]"]').type('500')

      // Within user's raise limit so no warning text is displayed
      cy.get('[data-testid=over-spend-limit]').should('not.exist')

      // Select an SOR with cost: £50.17
      cy.contains('+ Add another SOR code').click()

      cy.get('input[id="rateScheduleItems[1][code]"]')
        .clear()
        .type('20060020 - BATHROOM PLUMBING REPAIRS - £50.17')

      // Select a quantity to make total 50.17 x 5 = 250.85
      cy.get('input[id="rateScheduleItems[1][quantity]"]').type('5')

      // Warning text as user's raise limit (£250) has been exceeded
      cy.get('[data-testid=over-spend-limit]').within(() => {
        cy.contains(
          'The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation'
        )
      })

      // Change quantity to make total 50.17 x 4 = 200.68
      cy.get('input[id="rateScheduleItems[1][quantity]"]').clear().type('4')

      // Add another SOR with cost: £5.80
      cy.contains('+ Add another SOR code').click()

      cy.get('input[id="rateScheduleItems[2][code]"]')
        .clear()
        .type('20060030 - KITCHEN PLUMBING REPAIRS - £5.8')

      // Add quantity of 1 to make total 200.68 + (5.80 x 9) = 252.88
      cy.get('input[id="rateScheduleItems[2][quantity]"]').type('9')

      // Warning text as user's raise limit (£250) has been exceeded
      cy.get('[data-testid=over-spend-limit]').within(() => {
        cy.contains(
          'The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation'
        )
      })

      // Remove SOR at index 1 to make total cost 5.80 x 9 = 52.2
      cy.get('button[id="remove-rate-schedule-item-1"]').click()

      // Within user's raise limit so no warning text is displayed
      cy.get('[data-testid=over-spend-limit]').should('not.exist')

      // Edit quantity to 43 to make total 5.80 x 43 = 249.4
      cy.get('input[id="rateScheduleItems[2][quantity]"]').clear().type('43')

      // Within user's raise limit so no warning text is displayed
      cy.get('[data-testid=over-spend-limit]').should('not.exist')

      // Edit quantity to 44 to make total 5.80 x 44 = 255.2
      cy.get('input[id="rateScheduleItems[2][quantity]"]').clear().type('44')

      // Warning text as user's raise limit (£250) has been exceeded
      cy.get('[data-testid=over-spend-limit]').within(() => {
        cy.contains(
          'The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation'
        )
      })

      // Fill in Repair Description
      cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')

      //Fill in contact details
      cy.get('#callerName').type('Test Caller', { force: true })
      cy.get('#contactNumber').type('1', { force: true })

      // Submit form for high cost (over raise limit) authorisation
      cy.get('[type="submit"]').contains('Create work order').click()

      cy.wait('@apiCheck')

      // Confirmation screen
      cy.get('.govuk-panel').within(() => {
        cy.get('.govuk-panel__title').contains(
          'Work order created but requires authorisation'
        )
        cy.get('.govuk-panel__body').within(() => {
          cy.contains('Reference number')
          cy.contains('10102030')
        })
      })

      // Warning text as this work order is over the raise limit
      cy.get('.govuk-warning-text.lbh-warning-text').within(() => {
        cy.get('.govuk-warning-text__text').contains(
          'Please request authorisation from a manager'
        )
      })

      // Actions to see relevant pages
      cy.get('.lbh-list li').within(() => {
        cy.contains('View work order').should(
          'have.attr',
          'href',
          '/work-orders/10102030'
        )
        cy.contains('Back to 16 Pitcairn House').should(
          'have.attr',
          'href',
          '/properties/00012345'
        )
        cy.contains('Start a new search').should('have.attr', 'href', '/')
      })
    })
    describe('when contractor is not Purdy', () => {
      beforeEach(() => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/workOrders/budget-codes',
          },
          { fixture: 'scheduleOfRates/budgetCodes.json' }
        ).as('budgetCodesRequestForNonPurdy')

        cy.intercept(
          {
            method: 'GET',
            path:
              '/api/schedule-of-rates/codes?tradeCode=PL&propertyReference=00012345&contractorReference=H09&isRaisable=true',
          },
          { fixture: 'scheduleOfRates/codesWithIsRaisableTrue.json' }
        ).as('sorCodesRequest')
      })

      it('Gets full list of budget codes', () => {
        cy.visit('/properties/00012345/raise-repair/new')
        cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

        cy.get('.lbh-heading-h2').contains('Work order task details')
        cy.get('#repair-request-form').within(() => {
          cy.get('#trade').type('Plumbing - PL')
          cy.wait('@contractorsRequest')

          cy.get('#contractor').type('HH Painting - H09')
          cy.wait('@budgetCodesRequestForNonPurdy')

          cy.get('[data-testid=budgetCode]').type(
            'H2555 - 200157 - Garage Repairs'
          )
          cy.wait('@sorCodesRequest')

          cy.get('input[id="rateScheduleItems[0][code]"]')
            .clear()
            .type('DES5R005 - Normal call outs - £1')

          cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('1')
          cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')

          cy.get('[data-testid=callerName]').type('Test Caller')
          cy.get('[data-testid=contactNumber]').type('1')
        })
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
          })
        })
      })
    })
  })

  context('as a user with an agent role only', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('does not allow budget code selection', () => {
      cy.visit('/properties/00012345/raise-repair/new')

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

      cy.get('#repair-request-form').within(() => {
        cy.get('#trade').type('Plumbing - PL')

        cy.wait('@contractorsRequest')

        cy.get('#contractor').type('Purdy Contracts (P) Ltd - PCL')

        cy.get('[data-testid=budgetCode]').should('not.exist')

        cy.get('input[id="rateScheduleItems[0][code]"]')
          .clear()
          .type('DES5R003 - Immediate call outs - £0')

        cy.get('input[id="rateScheduleItems[0][quantity]"]').clear().type('1')

        cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')

        cy.get('[data-testid=callerName]').type('Test Caller')
        cy.get('[data-testid=contactNumber]').type('12345678910')

        cy.get('[type="submit"]').contains('Create work order').click()
      })

      cy.wait('@apiCheck').then(({ request }) => {
        cy.wrap(request.body).should('not.have.property', 'budgetCode')
      })
    })
  })

  context('When property is in legal disrepair', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
        { fixture: 'properties/propertyInLegalDisrepair.json' }
      ).as('propertyInLegalDisrepair')
    })

    it('Shows warning text', () => {
      cy.loginWithAgentRole()

      cy.visit('/properties/00012345')

      cy.wait(['@propertyRequest', '@workOrdersRequest'])

      cy.get('.lbh-heading-h2')
        .contains('Raise a work order on this dwelling')
        .click()

      cy.wait([
        '@propertyRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
        '@propertyInLegalDisrepair',
      ])

      cy.get('.warning-info-box').within(() => {
        cy.contains('This property is currently under legal disrepair')
        cy.contains(
          'Before raising a work order you must call the Legal Disrepair Team'
        )
      })
    })
  })

  context(
    'When property is not in legal desrepair and request response has body false',
    () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
          { body: { propertyIsInLegalDisrepair: false } }
        ).as('propertyInLegalDisrepair')
      })

      it('Does not show warning text', () => {
        cy.loginWithAgentRole()

        cy.visit('/properties/00012345')

        cy.wait(['@propertyRequest', '@workOrdersRequest'])

        cy.get('.lbh-heading-h2')
          .contains('Raise a work order on this dwelling')
          .click()

        cy.wait([
          '@propertyRequest',
          '@sorPrioritiesRequest',
          '@tradesRequest',
          '@propertyInLegalDisrepair',
        ])

        cy.get('[data-testid=over-spend-limit]').should('not.exist')
      })
    }
  )

  context('When legal disrepair request returns an error', () => {
    beforeEach(() => {
      cy.intercept(
        { method: 'GET', path: '/api/properties/legalDisrepair/00012345' },
        {
          statusCode: 404,
          body: {
            message: 'Cannot fetch legal disrepairs',
          },
        }
      ).as('propertyInLegalDisrepairError')
    })

    it('Shows a custom error message for legal disrepair', () => {
      cy.loginWithAgentRole()

      cy.visit('/properties/00012345')

      cy.wait(['@propertyRequest', '@workOrdersRequest'])

      cy.get('.lbh-heading-h2')
        .contains('Raise a work order on this dwelling')
        .click()

      cy.wait([
        '@propertyRequest',
        '@sorPrioritiesRequest',
        '@tradesRequest',
        '@propertyInLegalDisrepairError',
      ])

      cy.get('[data-testid=over-spend-limit]').should('not.exist')
      cy.contains(
        'Error loading legal disrepair status: 404 with message: Cannot fetch legal disrepairs'
      )
    })
  })
})

// This is a "special" integration test to end-to-end test
// our permission system. We don't need to replicate this
// for all our features because we have broad low-level test coverage.
describe('When a contractor tries to raise a work order using the UI', () => {
  beforeEach(() => {
    cy.loginWithContractorRole()
  })

  it('rejects the request and shows the access-denied page instead', () => {
    cy.visit('/properties/00012345/raise-repair/new')

    cy.contains('New repair').should('not.exist')
    cy.url().should('not.contain', 'properties/00012345/raise-repair/new')

    cy.contains('Access denied')
    cy.url().should('contain', 'access-denied')
  })
})
