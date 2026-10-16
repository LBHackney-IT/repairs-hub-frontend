/// <reference types="cypress" />

import { EMERGENCY_PRIORITY_CODE } from '../../../../src/utils/helpers/priorities'

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

  it('Doesnt throw error when tenure is null', () => {
    cy.loginWithAgentAndBudgetCodeOfficerRole()

    cy.fixture('properties/property.json')
      .then((property) => {
        property.tenure = null

        cy.intercept(
          { method: 'GET', path: '/api/properties/00012345' },
          { body: property }
        )
      })
      .as('propertyRequest')

    cy.visit('/properties/00012345/raise-repair/new')

    cy.wait(['@propertyRequest', '@sorPrioritiesRequest', '@tradesRequest'])

    cy.contains('New repair')
    cy.contains('Dwelling: 16 Pitcairn House')
  })

  it('Validates missing form inputs', () => {
    cy.loginWithAgentAndBudgetCodeOfficerRole()

    cy.visit('/properties/00012345/raise-repair/new')

    cy.wait([
      '@propertyRequest',
      '@contactDetailsRequest',
      '@sorPrioritiesRequest',
      '@tradesRequest',
    ])

    cy.get('[type="submit"]')
      .contains('Create work order')
      .click({ force: true })

    cy.get('#trade-form-group .govuk-error-message').contains(
      'Please select a trade'
    )

    cy.get('#contractor-form-group .govuk-error-message').contains(
      'Please select a contractor'
    )

    cy.get(
      'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
    ).contains('Please select an SOR code')

    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).contains('Please enter a quantity')

    cy.get('#priorityCode-form-group .govuk-error-message').contains(
      'Please select a priority'
    )

    cy.get('#descriptionOfWork-form-group .govuk-error-message').contains(
      'Please enter a repair description'
    )

    cy.get('#trade').type('Plumbing - PL')

    cy.wait('@contractorsRequest')

    cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

    cy.wait('@budgetCodesRequest')

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)

    cy.get('[type="submit"]')
      .contains('Create work order')
      .click({ force: true })

    cy.get('#budgetCode-form-group .govuk-error-message').contains(
      'Please select a budget code'
    )
  })

  it('Shows address, tenure, alerts and property contact information', () => {
    cy.loginWithAgentRole()

    cy.visit('/properties/00012345/raise-repair/new')
    cy.wait([
      '@propertyRequest',
      '@sorPrioritiesRequest',
      '@tradesRequest',
      '@alerts',
    ])

    cy.get('.govuk-caption-l').contains('New repair')
    cy.get('.lbh-heading-h1').contains('Dwelling: 16 Pitcairn House')

    cy.checkForTenureDetails('Tenure: Secure', [
      'Alert 1 (type1)',
      'Specific Requirements (SPR)',
      'Reason 1, very important',
    ])

    cy.wait(['@contactDetailsRequest'])

    // Tenants
    cy.get('.tenantContactsTable').contains('Mark Gardner')
    cy.get('.tenantContactsTable').contains('Main Number')
    cy.get('.tenantContactsTable').contains('Carer')

    cy.get('.tenantContactsTable-contact')
      .should('exist')
      .should(($element) => {
        const text = $element.text()
        expect(text).to.contain('Main Number')
        expect(text).to.contain('00000111111')
      })

    cy.get('.tenantContactsTable-contact')
      .should('exist')
      .should(($element) => {
        const text = $element.text()
        expect(text).to.contain('Carer')
        expect(text).to.contain('00000222222')
      })

    // Household members
    cy.get('.govuk-table').contains('Luam Berhane')
    cy.get('.govuk-table').contains('00000666666')
  })

  it('Submits work order task details to raise a work order', () => {
    cy.loginWithAgentAndBudgetCodeOfficerRole()

    cy.visit('/properties/00012345/raise-repair/new')
    cy.wait([
      '@propertyRequest',
      '@contactDetailsRequest',
      '@sorPrioritiesRequest',
      '@tradesRequest',
    ])

    cy.get('.lbh-heading-h2').contains('Work order task details')

    // Expect contractors and sor code selection to be disabled until trade selected
    cy.get('#contractor').should('be.disabled')
    cy.get('input[id="rateScheduleItems[0][code]"]').should('be.disabled')
    cy.get('input[id="rateScheduleItems[0][quantity]"]').should('be.disabled')
    // Select a trade (<datalist> required typed input for testing)
    cy.get('#trade').type('Plumbing - PL')

    cy.wait('@contractorsRequest')

    // Contractor select is no longer disabled but sor code selection still is
    cy.get('#contractor').should('not.be.disabled')

    cy.get('input[id="rateScheduleItems[0][code]"]').should('be.disabled')
    cy.get('input[id="rateScheduleItems[0][quantity]"]').should('be.disabled')

    // Select a contractor
    cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

    cy.wait('@budgetCodesRequest')

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.get('[data-testid=budgetCode]').type('H2555 - 200031 - Lifts Breakdown')

    cy.wait(['@sorCodesRequest'])

    // SOR select is no longer disabled
    cy.get('input[id="rateScheduleItems[0][code]"]').should('not.be.disabled')
    cy.get('input[id="rateScheduleItems[0][quantity]"]').should(
      'not.be.disabled'
    )

    // Priority disabled until SOR is selected
    cy.get('#priorityCode').should('be.disabled')

    cy.get('input[id="rateScheduleItems[0][code]"]').clear()

    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'INP5R001 - Pre insp of wrks by Constructr - £1{enter}'
    )

    cy.get('#priorityCode').should('not.be.disabled')

    // Selecting no trade clears contractor and SOR code select options
    cy.get('#trade').clear()
    cy.get('#contractor').should('be.disabled')
    cy.get('input[id="rateScheduleItems[0][code]"]').should('be.disabled')
    cy.get('input[id="rateScheduleItems[0][quantity]"]').should('be.disabled')

    // Select trade not included in list
    cy.get('#trade').type('Fake trade')

    cy.get('[type="submit"]').contains('Create work order').click()

    cy.get('#trade-form-group .govuk-error-message').within(() => {
      cy.contains('Trade is not valid')
    })

    // Select valid trade
    cy.get('#trade').clear()
    cy.get('#trade').type('Plumbing - PL')

    cy.wait('@contractorsRequest')

    cy.get('#contractor').type('PURDY CONTRACTS (C2A) - PUR')

    cy.get('[data-testid=budgetCode]').type('H2555 - 200108 - Gutter Clearance')

    cy.get('input[id="rateScheduleItems[0][code]"]').type('INP')

    cy.get(
      'div[id="rateScheduleItems[0][code]-form-group"] .govuk-error-message'
    ).contains('SOR code is not valid')

    // Select SOR code with no priority attached
    cy.get('input[id="rateScheduleItems[0][code]"]').clear()
    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'INP5R001 - Pre insp of wrks by Constructr'
    )

    // Does not autopopulate priority description
    cy.get('#priorityCode').should('have.value', '')

    // Select SOR code with priority attached
    cy.get('input[id="rateScheduleItems[0][code]"]').clear()
    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'DES5R003 - Immediate call outs - £0{enter}'
    )

    // Autopopulates priority description
    cy.get('#priorityCode')
      .find('option:selected')
      .should('have.text', '1 [I] IMMEDIATE')

    // Removes Task Priority validation errors
    cy.get('#priorityCode-form-group .govuk-error-message').should('not.exist')

    // Select another SOR code
    cy.get('input[id="rateScheduleItems[0][code]"]').clear()
    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'DES5R004 - Emergency call out - £1{enter}'
    )

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
    ).contains('Please select an SOR code')

    cy.get('input[id="rateScheduleItems[0][code]"]').clear()
    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'DES5R005 - Normal call outs - £1{enter}'
    )

    // Enter a blank quantity
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('x')
    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).contains('Please enter a quantity')

    // Enter a non-number quantity
    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('x')

    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).contains('Quantity must be a number')

    // Enter a quantity with 1 decimal point
    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('1.5')

    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).should('not.exist')

    // Enter a quantity with 2 decimal points
    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('1.55')

    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).should('not.exist')

    // Enter a quantity less than 1 with 2 decimal points
    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('0.55')

    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).should('not.exist')

    // Enter a quantity with more than 2 decimal points
    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('1.555')

    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).contains(
      'Quantity including a decimal point is permitted a maximum of 2 decimal places'
    )

    // Enter a quantity less than the minimum
    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('0')

    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).contains('Quantity must be greater than 0')

    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('-1')
    cy.get(
      'div[id="rateScheduleItems[0][quantity]-form-group"] .govuk-error-message'
    ).contains('Quantity must be greater than 0')

    // Enter a valid quantity
    cy.get('input[id="rateScheduleItems[0][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[0][quantity]"]').type('1')

    // Adding multiple SOR codes
    // Remove link does not exist when just one SOR code selector component
    cy.get('.remove-rate-schedule-item').should('not.exist')
    cy.contains('+ Add another SOR code').click()
    // Remove link now exists for additional SOR code selector component
    cy.get('.remove-rate-schedule-item').contains('Remove')

    // Select SOR Code from dropdown

    cy.get('input[id="rateScheduleItems[1][code]"]').clear()
    cy.get('input[id="rateScheduleItems[1][code]"]').type(
      'DES5R013 - Inspect additional sec entrance - £1{enter}'
    )

    // Priority description should remain same because inspection is a lower priority than normal
    cy.get('#priorityCode')
      .find('option:selected')
      .should('have.text', '5 [N] NORMAL')

    // Add another SOR code with higher priority
    cy.contains('+ Add another SOR code').click()
    cy.get('input[id="rateScheduleItems[2][code]"]').clear()
    cy.get('input[id="rateScheduleItems[2][code]"]').type(
      'DES5R003 - Immediate call outs - £0{enter}'
    )

    // Autopopulates priority description with the highest priority
    cy.get('#priorityCode')
      .find('option:selected')
      .should('have.text', '1 [I] IMMEDIATE')

    // Add another SOR code with an emergency priority
    cy.contains('+ Add another SOR code').click()

    cy.get('input[id="rateScheduleItems[3][code]"]').clear()
    cy.get('input[id="rateScheduleItems[3][code]"]').type(
      'DES5R004 - Emergency call out - £1{enter}'
    )

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

    cy.get('input[id="rateScheduleItems[1][code]"]').clear()
    cy.get('input[id="rateScheduleItems[1][code]"]').type(
      'DES5R004 - Emergency call out - £1{enter}'
    )

    cy.get('#priorityCode')
      .find('option:selected')
      .should('have.text', '2 [E] EMERGENCY')

    // Try to submit form without quantity for this SOR code at index 1
    cy.get('[type="submit"]')
      .contains('Create work order')
      .click({ force: true })

    cy.get(
      'div[id="rateScheduleItems[1][quantity]-form-group"] .govuk-error-message'
    ).contains('Please enter a quantity')

    // Remove SOR code at index 1
    cy.get('input[id="rateScheduleItems[1][code]"]').clear()
    cy.get(
      'div[id="rateScheduleItems[1][code]-form-group"] .govuk-error-message'
    ).contains('Please select an SOR code')

    // Enter SOR code and quantity

    cy.get('input[id="rateScheduleItems[1][code]"]').clear()
    cy.get('input[id="rateScheduleItems[1][code]"]').type(
      'DES5R005 - Normal call outs - £1{enter}'
    )

    cy.get(
      'div[id="rateScheduleItems[1][code]-form-group"] .govuk-error-message'
    ).should('not.exist')

    cy.get('input[id="rateScheduleItems[1][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[1][quantity]"]').type('3')

    cy.get(
      'div[id="rateScheduleItems[1][quantity]-form-group"] .govuk-error-message'
    ).should('not.exist')

    // Add another SOR code
    cy.contains('+ Add another SOR code').click()

    cy.get('input[id="rateScheduleItems[1][code]"]').clear()
    cy.get('input[id="rateScheduleItems[1][code]"]').type(
      'DES5R006 - Urgent call outs - £1{enter}'
    )

    cy.get('input[id="rateScheduleItems[2][quantity]"]').clear()
    cy.get('input[id="rateScheduleItems[2][quantity]"]').type('2')
    // Delete the SOR code at the targeted index

    cy.get('button[id="remove-rate-schedule-item-1"]').click()
    cy.get('input[id="rateScheduleItems[1][code]"]').should('not.exist')
    cy.get('input[id="rateScheduleItems[1][quantity]"]').should('not.exist')
    cy.get('input[id="rateScheduleItems[1][description]"]').should('not.exist')
    // Remaining SOR codes
    cy.get('button[id="remove-rate-schedule-item-1"]').should('not.exist')

    cy.get('input[id="rateScheduleItems[0][code]"]').clear()
    cy.get('input[id="rateScheduleItems[0][code]"]').type(
      'DES5R004 - Emergency call out - £1{enter}'
    )

    cy.get('input[id="rateScheduleItems[0][code]"]').should(
      'have.value',
      'DES5R004 - Emergency call out - £1'
    )
    cy.get('input[id="rateScheduleItems[0][quantity]"]').should(
      'have.value',
      '1'
    )
    cy.get('button[id="remove-rate-schedule-item-0"]').should('not.exist')

    cy.get('input[id="rateScheduleItems[2][code]"]').clear()
    cy.get('input[id="rateScheduleItems[2][code]"]').type(
      'DES5R006 - Urgent call outs - £1'
    )

    cy.get('input[id="rateScheduleItems[2][quantity]"]').should(
      'have.value',
      '2'
    )
    cy.get('#priorityCode')
      .find('option:selected')
      .should('have.text', '2 [E] EMERGENCY')

    cy.get('[data-testid="reasonForRepair"]').select('None of the above')

    cy.get('button[id="remove-rate-schedule-item-2"]').contains('Remove')

    // No warning if within raise limit
    cy.get('[data-testid=over-spend-limit]').should('not.exist')

    // Go over the Repair description character limit
    cy.get('#descriptionOfWork').get('.govuk-textarea').type('x'.repeat(231))
    cy.get('#descriptionOfWork-form-group .govuk-error-message').contains(
      'You have exceeded the maximum amount of characters'
    )

    // Delete all Repair Description text
    cy.get('#descriptionOfWork').get('.govuk-textarea').clear()
    cy.get('#descriptionOfWork-form-group .govuk-error-message').contains(
      'Please enter a repair description'
    )

    // Fill in Repair Description within character limit
    cy.get('#descriptionOfWork').get('.govuk-textarea').type('A problem')
    cy.get('.govuk-hint').contains('You have 221 characters remaining.')

    // Removes Repair Description validation errors
    cy.get('#descriptionOfWork-form-group .govuk-error-message').should(
      'not.exist'
    )

    cy.get('[type="submit"]')

    cy.get('#callerName-form-group .govuk-error-message').contains(
      'Please add caller name'
    )

    cy.get('#contactNumber-form-group .govuk-error-message').contains(
      'Please add telephone number'
    )

    //Submit form with letters instead of number in telephone number field
    cy.get('[data-testid=contactNumber]').type('NA')

    cy.get('[type="submit"]')

    cy.get('#contactNumber-form-group .govuk-error-message').contains(
      'Telephone number should be a number and with no empty spaces'
    )

    //Submit form with space in telephone number field
    cy.get('[data-testid=contactNumber]').clear()
    cy.get('[data-testid=contactNumber]').type('12 45 ')
    cy.get('[type="submit"]')

    cy.get('#contactNumber-form-group .govuk-error-message').contains(
      'Telephone number should be a number and with no empty spaces'
    )

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
    // })

    cy.get('[type="submit"]').contains('Create work order').click()

    cy.wait('@apiCheck', { timeout: 7000 }).then(({ request }) => {
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
        isAwaabsDampAndMouldRepair: false,
      })
    })

    // Confirmation screen
    cy.get('.govuk-panel__title').contains('Work order created')
    cy.get('.govuk-panel').contains('Reference number')
    cy.get('.govuk-panel').contains('10102030')

    // No warning if within raise limit
    cy.get('[data-testid=over-spend-limit]').should('not.exist')

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

  it('Hides follow-on fields when user doesnt have permissions', () => {
    cy.loginWithAgentRole()

    cy.visit('/properties/00012345/raise-repair/new')
    cy.wait([
      '@propertyRequest',
      '@contactDetailsRequest',
      '@sorPrioritiesRequest',
      '@tradesRequest',
    ])

    cy.get('.lbh-heading-h2').contains('Work order task details')

    cy.contains(
      '.govuk-fieldset__legend',
      'Is this for follow on works?'
    ).should('not.exist')
  })
})
