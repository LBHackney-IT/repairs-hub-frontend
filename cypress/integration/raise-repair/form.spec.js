/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Raise repair form', () => {
  beforeEach(() => {
    cy.loginWithAgentRole()

    cy.server()
    // Stub request for raise a repair form page
    cy.fixture('schedule-of-rates/codes.json').as('sorCodes')
    cy.fixture('schedule-of-rates/priorities.json').as('priorities')
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/schedule-of-rates/codes', '@property')
    cy.route('GET', 'api/schedule-of-rates/codes', '@sorCodes')
    cy.route('GET', 'api/schedule-of-rates/priorities', '@priorities')
    cy.route({
      method: 'POST',
      url: '/api/repairs/schedule',
      response: '10102030',
    }).as('apiCheck')
  })

  it('Fill out repair task details form to raise a repair', () => {
    // Click link to raise a repair
    cy.visit(`${Cypress.env('HOST')}/properties/00012345`)

    cy.get('.govuk-heading-m')
      .contains('Raise a repair on this dwelling')
      .click()
    cy.url().should('contains', 'properties/00012345/raise-repair/new')

    // Property address details with tenure and alerts information
    cy.get('.govuk-caption-l').contains('New repair')
    cy.get('.govuk-heading-l').contains('Dwelling: 16 Pitcairn House')

    cy.checkForTenureAlertDetails(
      'Tenure: Secure',
      ['Address Alert: Property Under Disrepair (DIS)'],
      [
        'Contact Alert: No Lone Visits (CV)',
        'Contact Alert: Verbal Abuse or Threat of (VA)',
      ]
    )

    cy.get('.govuk-heading-m').contains('Repair task details')

    // Form section
    // Try to submit form without entering required fields
    cy.get('[type="submit"]').contains('Create works order').click()
    cy.get(
      'div[id="sorCodesCollection[0][code]-form-group"] .govuk-error-message'
    ).within(() => {
      cy.contains('Please select an SOR code')
    })
    cy.get(
      'div[id="sorCodesCollection[0][quantity]-form-group"] .govuk-error-message'
    ).within(() => {
      cy.contains('Please enter a quantity')
    })
    cy.get('#priorityDescription-form-group .govuk-error-message').within(
      () => {
        cy.contains('Please select a priority')
      }
    )
    cy.get('#descriptionOfWork-form-group .govuk-error-message').within(() => {
      cy.contains('Please enter a repair description')
    })

    // Fill out form
    cy.get('#repair-request-form').within(() => {
      // Select SOR Code from dropdown
      cy.get('select[id="sorCodesCollection[0][code]"]').select(
        'DES5R004 - Emergency call out'
      )
      // Assigns description and contractor ref to hidden field
      cy.get('input[id="sorCodesCollection[0][description]"]').should(
        'have.value',
        'Emergency call out'
      )
      cy.get('input[id="sorCodesCollection[0][contractorRef]"]').should(
        'have.value',
        'H01'
      )
      // Removes SOR Code validation errors
      cy.get(
        'div[id="sorCodesCollection[0][code]-form-group"] .govuk-error-message'
      ).should('not.exist')

      // Select blank SOR Code
      cy.get('select[id="sorCodesCollection[0][code]"]').select('')
      cy.get(
        'div[id="sorCodesCollection[0][code]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Please select an SOR code')
      })
      cy.get('select[id="sorCodesCollection[0][code]"]').select(
        'DES5R004 - Emergency call out'
      )

      // Enter a blank quantity
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear()
      cy.get(
        'div[id="sorCodesCollection[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Please enter a quantity')
      })

      // Enter a non-number quantity
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('x')
      cy.get(
        'div[id="sorCodesCollection[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Quantity must be a whole number')
      })

      // Enter a non-integer quantity
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('1.5')
      cy.get(
        'div[id="sorCodesCollection[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Quantity must be a whole number')
      })

      // Enter a quantity less than the minimum
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('0')
      cy.get(
        'div[id="sorCodesCollection[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Quantity must be 1 or more')
      })

      // Enter a quantity more than the maximum
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('51')
      cy.get(
        'div[id="sorCodesCollection[0][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Quantity must be 50 or less')
      })

      // Enter a valid quantity
      cy.get('input[id="sorCodesCollection[0][quantity]"]').clear().type('1')

      // Adding multiple SOR codes
      // Remove link does not exist when just one SOR code selector component
      cy.get('.remove-sor-code').should('not.exist')
      cy.contains('+ Add another SOR code').click()
      // Remove link now exists for additional SOR code selector component
      cy.get('.remove-sor-code').contains('-')
      // Select SOR Code from dropdown
      cy.get('select[id="sorCodesCollection[1][code]"]').select(
        'DES5R005 - Normal call outs'
      )
      // Try to submit form without quantity for this SOR code at index 1
      cy.get('[type="submit"]').contains('Create works order').click()
      cy.get(
        'div[id="sorCodesCollection[1][quantity]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Please enter a quantity')
      })
      // Remove SOR code at index 1
      cy.get('select[id="sorCodesCollection[1][code]"]').select('')
      cy.get(
        'div[id="sorCodesCollection[1][code]-form-group"] .govuk-error-message'
      ).within(() => {
        cy.contains('Please select an SOR code')
      })
      // Enter SOR code and quantity
      cy.get('select[id="sorCodesCollection[1][code]"]').select(
        'DES5R005 - Normal call outs'
      )
      cy.get(
        'div[id="sorCodesCollection[1][code]-form-group"] .govuk-error-message'
      ).should('not.exist')
      cy.get('input[id="sorCodesCollection[1][quantity]"]').clear().type('3')
      cy.get(
        'div[id="sorCodesCollection[1][quantity]-form-group"] .govuk-error-message'
      ).should('not.exist')
      // Add another SOR code
      cy.contains('+ Add another SOR code').click()
      cy.get('select[id="sorCodesCollection[2][code]"]').select(
        'DES5R006 - Urgent call outs'
      )
      cy.get('input[id="sorCodesCollection[2][quantity]"]').clear().type('2')
      // Delete the SOR code at the targeted index
      cy.get('button[id="remove-sor-code-1"]').click()
      cy.get('select[id="sorCodesCollection[1][code]"]').should('not.exist')
      cy.get('input[id="sorCodesCollection[1][quantity]"]').should('not.exist')
      cy.get('input[id="sorCodesCollection[1][description]"]').should(
        'not.exist'
      )
      cy.get('input[id="sorCodesCollection[1][contractorRef]"]').should(
        'not.exist'
      )
      // Remaining SOR codes
      cy.get('button[id="remove-sor-code-1"]').should('not.exist')
      cy.get('select[id="sorCodesCollection[0][code]"]').contains(
        'DES5R004 - Emergency call out'
      )
      cy.get('input[id="sorCodesCollection[0][quantity]"]').should(
        'have.value',
        '1'
      )
      cy.get('button[id="remove-sor-code-0"]').should('not.exist')
      cy.get('select[id="sorCodesCollection[2][code]"]').contains(
        'DES5R006 - Urgent call outs'
      )
      cy.get('input[id="sorCodesCollection[2][quantity]"]').should(
        'have.value',
        '2'
      )
      cy.get('button[id="remove-sor-code-2"]').contains('-')

      // Select Task Priority
      cy.get('#priorityDescription').select('E - Emergency (24 hours)')
      // Removes Task Priority validation errors
      cy.get('#priorityDescription-form-group .govuk-error-message').should(
        'not.exist'
      )
      // Select blank Task Priority
      cy.get('#priorityDescription').select('')
      cy.get('#priorityDescription-form-group .govuk-error-message').within(
        () => {
          cy.contains('Please select a priority')
        }
      )
      cy.get('#priorityDescription').select('E - Emergency (24 hours)')

      // Go over the Repair description character limit
      cy.get('#descriptionOfWork').get('.govuk-textarea').type('x'.repeat(251))
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
        cy.contains('You have 241 characters remaining.')
      })
      // Removes Repair Description validation errors
      cy.get('#descriptionOfWork-form-group .govuk-error-message').should(
        'not.exist'
      )

      // Fill in contact details
      cy.get('#callerName').type('Bob Leek')
      cy.get('#contactNumber').type('a')
      // Enter invalid contact number
      cy.get('#contactNumber-form-group .govuk-error-message').within(() => {
        cy.contains('Contact number is not valid')
      })
      // Enter a valid contact number
      cy.get('#contactNumber').clear().type('07788659111')
    })

    // Submit form
    cy.get('[type="submit"]').contains('Create works order').click()
    // Check body of post request
    cy.get('@apiCheck')
      .its('request.body')
      .then((body) => {
        const referenceIdUuid = body.reference[0].id
        const requiredCompletionDateTime =
          body.priority.requiredCompletionDateTime
        cy.get('@apiCheck')
          .its('request.body')
          .should('deep.equal', {
            reference: [{ id: referenceIdUuid }],
            descriptionOfWork: 'A problem',
            priority: {
              priorityCode: 1,
              priorityDescription: 'E - Emergency (24 hours)',
              requiredCompletionDateTime: requiredCompletionDateTime,
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
              },
              {
                rateScheduleItem: [
                  {
                    customCode: 'DES5R006',
                    customName: 'Urgent call outs',
                    quantity: { amount: [2] },
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
              name: 'Contractor H01',
              organization: {
                reference: [
                  {
                    id: 'H01',
                  },
                ],
              },
            },
            customer: {
              name: 'Bob Leek',
              person: {
                name: {
                  full: 'Bob Leek',
                },
                communication: [
                  {
                    channel: {
                      medium: '20',
                      code: '60',
                    },
                    value: '07788659111',
                  },
                ],
              },
            },
          })
      })

    // Confirmation screen
    cy.get('.govuk-panel--confirmation').within(() => {
      cy.get('h1.govuk-heading-xl').contains('Repair work order created')

      cy.get('.govuk-panel__body').within(() => {
        cy.contains('Work order number')
        cy.contains('10102030')
      })
    })

    // Actions to see relevant pages
    cy.get('.govuk-list li').within(() => {
      cy.contains('Back to 16 Pitcairn House St Thomass Square').should(
        'have.attr',
        'href',
        '/properties/00012345'
      )
      cy.contains('Start a new search').should('have.attr', 'href', '/')
      cy.contains('View work order').should(
        'have.attr',
        'href',
        '/work-orders/10102030'
      )
    })

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
