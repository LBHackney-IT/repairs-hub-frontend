/// <reference types="cypress" />

import { EMERGENCY_PRIORITY_CODE } from '../../../../src/utils/helpers/priorities'

describe('Raise repair with Repairs Finder', () => {
  beforeEach(() => {
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

    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/repairs-finder/matching-sor-codes?sorCode=20060030&contractorReference=H01&propertyReference=00012345',
      },
      {
        body: {
          sorCode: {
            code: '20060030',
            shortDescription: 'KITCHEN PLUMBING REPAIRS',
            longDescription:
              'Kitchen repairs - including any or multiples of the following A- sink or other appliances (i) refix loose sink unit (ii) remedy leak from sink waste or supply B- Blockages (i) unblock wastes (ii) unblock down pipe not exceeding 10m  long (iii) clean gulley C- refix wastes (i) refix any waste pipe including remake joints not exceeding 2m (ii) remake joint to soil pipe. Repairs to be inclusive of all associated works including repair stop cock or valve, freezing pipe work up to 35mm in line isolation valves to all new taps if not existing.  Remove/refix duct panels/back of units, partial drain down and recharge, minor airlocks making good including silicone sealant, minor plaster repairs and tiling\n',
            priority: {
              priorityCode: 4,
              description: '[N] NORMAL',
            },
            cost: 63.78,
            tradeCode: null,
            standardMinuteValue: 0,
            displayPriority: 1,
          },
          tradeCode: 'PL',
          trade: 'Plumbing',
          contractReference: 'F22-H01-MTCG',
          contractorReference: 'H01',
          contractor: 'HH General Building Repai',
          hasPropertyContract: true,
        },
      }
    ).as('matchingCodesRequest')

    // cy.intercept(
    //   {
    //     method: 'GET',
    //     path: '/api/simple-feature-toggle',
    //   },
    //   {
    //     body: {
    //       enableRepairsFinderIntegration: true,
    //     },
    //   }
    // ).as('feature-toggle')

    // cy.clock(now, ['Date'])
  })

  it('Raises a repair', () => {
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

    cy.visit('/properties/00012345/raise-repair/repairs-finder')

    cy.wait(['@propertyRequest', '@sorPrioritiesRequest'])

    cy.contains('New repair')
    cy.contains('Dwelling: 16 Pitcairn House')

    // 1. Try submit - contains error message
    cy.contains('Create work order').click()

    cy.contains('Please enter a code')
    cy.contains('Please add caller name')
    cy.contains('Please add telephone number')

    // 2. Add invalid code
    cy.get('[data-testid="xmlContent"]').type('Some invalid code')
    cy.contains('Invalid code format')

    // 3. Add valid code

    cy.get('[data-testid="xmlContent"]').clear()

    const validCode = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><PRIORITY>2</PRIORITY><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>`
    cy.get('[data-testid="xmlContent"]').type(validCode, { delay: 1 })

    cy.wait('@matchingCodesRequest')

    cy.contains('Trade')
    cy.contains('Plumbing - PL')

    cy.contains('Contractor')
    cy.contains('HH General Building Repai')

    cy.contains('SOR code')
    cy.contains('63.78 - KITCHEN PLUMBING REPAIRS')

    cy.contains('Quantity')
    cy.contains('1')

    cy.contains('Priority')
    cy.contains('2 [E] EMERGENCY')

    cy.contains('Description')
    cy.contains('test')

    cy.contains('Invalid code format').should('not.exist')

    cy.get('[data-testid="callerName"]').type('John Smith')
    cy.get('[data-testid="contactNumber"]').type('1111')

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
    ).as('scheduleRequest')

    cy.contains('Create work order').click()

    cy.wait('@scheduleRequest', { timeout: 7000 }).then(({ request }) => {
      const referenceIdUuid = request.body.reference[0].id

      cy.wrap(request.body).should('deep.equal', {
        reference: [{ id: referenceIdUuid }],
        descriptionOfWork: 'Sink taps are broken - test',
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
                customCode: '20060030',
                customName: 'KITCHEN PLUMBING REPAIRS',
                quantity: { amount: [1] },
              },
            ],
            trade: [
              {
                code: 'SP',
                customCode: 'PL',
                customName: 'Plumbing',
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
          name: 'HH General Building Repai',
          organization: {
            reference: [
              {
                id: 'H01',
              },
            ],
          },
        },
        customer: {
          name: 'John Smith',
          person: {
            name: {
              full: 'John Smith',
            },
            communication: [
              {
                channel: {
                  medium: '20',
                  code: '60',
                },
                value: '1111',
              },
            ],
          },
        },
        multiTradeWorkOrder: false,
      })
    })
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

    cy.visit('/properties/00012345/raise-repair/repairs-finder')

    cy.wait(['@propertyRequest'])

    cy.contains('New repair')
    cy.contains('Dwelling: 16 Pitcairn House')
  })

  it('Validates missing form inputs', () => {
    cy.loginWithAgentAndBudgetCodeOfficerRole()

    cy.visit('/properties/00012345/raise-repair/repairs-finder')

    cy.wait(['@propertyRequest', '@contactDetailsRequest'])

    cy.get('[type="submit"]')
      .contains('Create work order')
      .click({ force: true })

    cy.get('.govuk-error-message').contains('Please enter a code')
    cy.get('.govuk-error-message').contains('Please add caller name')
    cy.get('.govuk-error-message').contains('Please add telephone number')
  })

  it('Shows address, tenure, alerts and property contact information', () => {
    cy.loginWithAgentRole()

    cy.visit('/properties/00012345/raise-repair/repairs-finder')
    cy.wait(['@propertyRequest', '@alerts'])

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

    cy.visit('/properties/00012345/raise-repair/repairs-finder')
    cy.wait(['@propertyRequest', '@contactDetailsRequest'])

    cy.get('.lbh-heading-h2').contains('Work order details')

    cy.contains('New repair')
    cy.contains('Dwelling: 16 Pitcairn House')

    // 1. Try submit - contains error message
    cy.contains('Create work order').click()

    cy.contains('Please enter a code')
    cy.contains('Please add caller name')
    cy.contains('Please add telephone number')

    // 2. Add invalid code
    cy.get('[data-testid="xmlContent"]').type('Some invalid code')
    cy.contains('Invalid code format')

    // 3. Add valid code
    cy.intercept(
      {
        method: 'GET',
        path:
          '/api/repairs-finder/matching-sor-codes?sorCode=20060030&contractorReference=H01&propertyReference=00012345',
      },
      {
        body: {
          sorCode: {
            code: '20060030',
            shortDescription: 'KITCHEN PLUMBING REPAIRS',
            longDescription:
              'Kitchen repairs - including any or multiples of the following A- sink or other appliances (i) refix loose sink unit (ii) remedy leak from sink waste or supply B- Blockages (i) unblock wastes (ii) unblock down pipe not exceeding 10m  long (iii) clean gulley C- refix wastes (i) refix any waste pipe including remake joints not exceeding 2m (ii) remake joint to soil pipe. Repairs to be inclusive of all associated works including repair stop cock or valve, freezing pipe work up to 35mm in line isolation valves to all new taps if not existing.  Remove/refix duct panels/back of units, partial drain down and recharge, minor airlocks making good including silicone sealant, minor plaster repairs and tiling\n',
            priority: {
              priorityCode: 4,
              description: '[N] NORMAL',
            },
            cost: 63.78,
            tradeCode: null,
            standardMinuteValue: 0,
            displayPriority: 1,
          },
          tradeCode: 'PL',
          trade: 'Plumbing',
          contractReference: 'F22-H01-MTCG',
          contractorReference: 'H01',
          contractor: 'HH General Building Repai',
          hasPropertyContract: true,
        },
      }
    ).as('matchingCodesRequest')

    cy.get('[data-testid="xmlContent"]').clear()

    const validCode = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><PRIORITY>2</PRIORITY><QUANTITY>1</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>`
    cy.get('[data-testid="xmlContent"]').type(validCode, { delay: 1 })

    cy.wait('@matchingCodesRequest')

    cy.contains('Trade')
    cy.contains('Plumbing - PL')

    cy.contains('Contractor')
    cy.contains('HH General Building Repai')

    cy.contains('SOR code')
    cy.contains('63.78 - KITCHEN PLUMBING REPAIRS')

    cy.contains('Quantity')
    cy.contains('1')

    cy.contains('Priority')
    cy.contains('2 [E] EMERGENCY')

    cy.contains('Description')
    cy.contains('test')

    cy.contains('Invalid code format').should('not.exist')

    // No warning if within raise limit
    cy.get('[data-testid=over-spend-limit]').should('not.exist')

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
    ).as('scheduleRequest')

    cy.get('[type="submit"]').contains('Create work order').click()

    cy.wait('@scheduleRequest', { timeout: 7000 }).then(({ request }) => {
      const referenceIdUuid = request.body.reference[0].id

      cy.wrap(request.body).should('deep.equal', {
        reference: [{ id: referenceIdUuid }],
        descriptionOfWork: 'Sink taps are broken - test',
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
                customCode: '20060030',
                customName: 'KITCHEN PLUMBING REPAIRS',
                quantity: { amount: [1] },
              },
            ],
            trade: [
              {
                code: 'SP',
                customCode: 'PL',
                customName: 'Plumbing',
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
          name: 'HH General Building Repai',
          organization: {
            reference: [
              {
                id: 'H01',
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
        multiTradeWorkOrder: false,
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

    cy.visit('/properties/00012345/raise-repair/repairs-finder')

    cy.wait(['@propertyRequest', '@contactDetailsRequest'])

    let quantity = 1
    let validCode = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><PRIORITY>2</PRIORITY><QUANTITY>${quantity}</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>`
    cy.get('[data-testid="xmlContent"]').type(validCode, { delay: 1 })

    // Within user's raise limit so no warning text is displayed
    cy.get('.govuk-table__body > :nth-child(4) > :nth-child(2)').contains('1')
    cy.get('[data-testid=over-spend-limit]').should('not.exist')

    // increase quantity
    quantity = 500
    validCode = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>H01</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>20060030</SOR_CODE><PRIORITY>2</PRIORITY><QUANTITY>${quantity}</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>Sink taps are broken - test</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>`
    cy.get('[data-testid="xmlContent"]').clear().type(validCode, { delay: 1 })

    // Warning text as user's raise limit (£250) has been exceeded
    cy.get('.govuk-table__body > :nth-child(4) > :nth-child(2)').contains('500')
    cy.get('[data-testid=over-spend-limit]').contains(
      'The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation'
    )

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

      cy.contains('a', 'Raise work order with Repairs Finder').click()

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest'])

      cy.contains('This property is currently under legal disrepair')
      cy.contains(
        'Before raising a work order you must call the Legal Disrepair Team'
      )
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

        cy.contains('a', 'Raise work order with Repairs Finder').click()

        cy.wait(['@propertyRequest', '@sorPrioritiesRequest'])

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

      cy.contains('a', 'Raise work order with Repairs Finder').click()

      cy.wait(['@propertyRequest', '@sorPrioritiesRequest'])

      cy.get('[data-testid=over-spend-limit]').should('not.exist')
      cy.contains(
        'Error loading legal disrepair status: 404 with message: Cannot fetch legal disrepairs'
      )
    })
  })

  context('When a user removes a contact detail', () => {
    const contactId = '5b718087-33cd-746d-8f91-e7cec2299a73'
    const personId = 'cfe9c99f-7636-e23d-f08a-f36083e57d5d'

    const modalConfirmationMessage = `Are you sure you want to remove mainNumber: 00000111111 from Mark Gardner?`

    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('shows a confirmation message when clicking on the remove button', () => {
      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      // remove first tenant
      cy.contains('Remove').first().click()

      // assert modal open
      cy.contains(modalConfirmationMessage)
    })

    it('hides confirmation modal when cancel clicked', () => {
      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      // remove first tenant
      cy.contains('Remove').first().click()

      // assert modal open
      cy.contains(modalConfirmationMessage)

      // click cancel button
      cy.contains('Cancel').click()

      // confirm hidden
      cy.contains('Remove contact details').should('not.exist')
      cy.contains(modalConfirmationMessage).should('not.exist')
    })

    it('sends displays a network error in the modal', () => {
      cy.intercept(
        {
          method: 'DELETE',
          path: `/api/contact-details?contactId=${contactId}&personId=${personId}`,
        },
        {
          statusCode: 401,
        }
      ).as('deleteContactRequest')

      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      // remove first tenant
      cy.contains('Remove').first().click()

      // assert modal open
      cy.contains(modalConfirmationMessage)

      // click confirmation button
      cy.contains('Remove phone number').click()

      // wait for network request
      cy.wait(['@deleteContactRequest'])

      // assert modal still open
      cy.contains('Remove contact details')
      cy.contains(modalConfirmationMessage)

      // assert error message
      cy.contains('Request failed with status code 401')
    })

    it('sends delete request when modal confirmed', () => {
      cy.intercept(
        {
          method: 'DELETE',
          path: `/api/contact-details?contactId=${contactId}&personId=${personId}`,
        },
        {
          statusCode: 204,
        }
      ).as('deleteContactRequest')

      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      // remove first tenant
      cy.contains('Remove').first().click()

      // assert modal open
      cy.contains(modalConfirmationMessage)

      // click confirmation button
      cy.contains('Remove phone number').click()

      // wait for network request
      cy.wait(['@deleteContactRequest'])

      // assert modal closed
      cy.contains(modalConfirmationMessage).should('not.exist')

      // assert new contact details fetched
      cy.wait(['@contactDetailsRequest'])
    })
  })

  context('When a user sets contact detail as main', () => {
    const contactId = 'd00e640a-5df2-27f2-bb78-e1860040d21f'
    const personId = 'cfe9c99f-7636-e23d-f08a-f36083e57d5d'

    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('shows a confirmation message when clicking on the set as main button', () => {
      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      // update last tenant
      cy.get('button:contains(Set as main contact)').last().click()

      // assert modal open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )
    })

    it('hides confirmation modal when cancel clicked', () => {
      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      // update last tenant
      cy.get('button:contains(Set as main contact)').last().click()

      // assert modal open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )

      // click cancel button
      cy.contains('Cancel').click()

      // confirm hidden
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      ).should('not.exist')
    })

    it('sends displays a network error in the modal', () => {
      cy.intercept(
        {
          method: 'PATCH',
          path: `/api/contact-details?contactId=${contactId}&personId=${personId}`,
        },
        {
          statusCode: 400,
        }
      ).as('patchContactRequest')

      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      // update last tenant
      cy.get('button:contains(Set as main contact)').last().click()

      // assert modal open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )

      // click confirmation button
      cy.get('[data-test=confirm-button]').click()

      // wait for network request
      cy.wait(['@patchContactRequest'])

      // assert modal still open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )

      // assert error message
      cy.contains('Request failed with status code 400')
    })

    it('sends delete request when modal confirmed', () => {
      cy.intercept(
        {
          method: 'PATCH',
          path: `/api/contact-details?contactId=${contactId}&personId=${personId}`,
        },
        {
          statusCode: 204,
        }
      ).as('patchContactRequest')

      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      // update last tenant
      cy.get('button:contains(Set as main contact)').last().click()

      // assert modal open
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      )

      // click confirmation button
      cy.get('[data-test=confirm-button]').click()

      // wait for network request
      cy.wait(['@patchContactRequest'])

      // assert modal closed
      cy.contains(
        `Are you sure you want to change the contact type from carer to MainNumber?`
      ).should('not.exist')

      // assert new contact details fetched
      cy.wait(['@contactDetailsRequest'])
    })
  })

  context('When a user edits a persons contact details', () => {
    beforeEach(() => {
      cy.loginWithAgentRole()
    })

    it('the edit contact details link contains the correct href', () => {
      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.wait(['@propertyRequest', '@contactDetailsRequest'])

      cy.contains('Edit contact details').should(
        'have.attr',
        'href',
        'https://manage-my-home-development.hackney.gov.uk/person/cfe9c99f-7636-e23d-f08a-f36083e57d5d/edit-contact-details'
      )
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
      cy.visit('/properties/00012345/raise-repair/repairs-finder')

      cy.contains('New repair').should('not.exist')
      cy.url().should(
        'not.contain',
        'properties/00012345/raise-repair/repairs-finder'
      )

      cy.contains('Access denied')
      cy.url().should('contain', 'access-denied')
    })
  })
})
