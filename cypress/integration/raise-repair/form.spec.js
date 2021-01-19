/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Raise repair form', () => {
  beforeEach(() => {
    cy.login()

    cy.server()
    // Stub request for raise a repair form page
    cy.fixture('schedule-of-rates/codes.json').as('sorCodes')
    cy.fixture('properties/property.json').as('property')
    cy.route('GET', 'api/properties/00012345', '@property')
    cy.route('GET', 'api/schedule-of-rates/codes', '@property')
    cy.route('GET', 'api/schedule-of-rates/codes', '@sorCodes')
    cy.route({
      method: 'POST',
      url: '/api/repairs',
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
    cy.get('.hackney-property-alerts li.bg-turquoise').within(() => {
      cy.contains('Tenure: Secure')
    })
    cy.get('.hackney-property-alerts').within(() => {
      cy.contains('Address Alert: Property Under Disrepair (DIS)')
      cy.contains('Contact Alert: No Lone Visits (CV)')
      cy.contains('Contact Alert: Verbal Abuse or Threat of (VA)')
    })
    cy.get('.govuk-heading-m').contains('Repair task details')

    // Form section
    // Try to submit form without entering required fields
    cy.get('[type="submit"]').contains('Create works order').click()
    cy.get('#sorCode-form-group .govuk-error-message').within(() => {
      cy.contains('Please select an SOR code')
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
      cy.get('#sorCode').select('DES5R004')
      // Autofills SOR Code summary and populates Task Priority dropdown
      cy.get('.sor-code-summary').contains(
        'SOR code summary: Emergency call out'
      )
      cy.get('#priorityDescription').should(
        'have.value',
        'E - Emergency (24 hours)'
      )
      // Removes SOR Code & Task priority validation errors
      cy.get('#sorCode-form-group .govuk-error-message').should('not.exist')
      cy.get('#priorityDescription-form-group .govuk-error-message').should(
        'not.exist'
      )

      // Select blank SOR Code
      cy.get('#sorCode').select('')
      cy.get('#sorCode-form-group .govuk-error-message').within(() => {
        cy.contains('Please select an SOR code')
      })
      cy.get('#priorityDescription').should(
        'have.value',
        'E - Emergency (24 hours)'
      )
      // Select blank Task Priority
      cy.get('#priorityDescription').select('')
      cy.get('#priorityDescription-form-group .govuk-error-message').within(
        () => {
          cy.contains('Please select a priority')
        }
      )

      cy.get('#sorCode').select('DES5R004')

      // Enter a blank quantity
      cy.get('#quantity').clear()
      cy.get('#quantity-form-group .govuk-error-message').within(() => {
        cy.contains('Please enter a quantity')
      })

      // Enter a non-number quantity
      cy.get('#quantity').clear().type('x')
      cy.get('#quantity-form-group .govuk-error-message').within(() => {
        cy.contains('Quantity must be a whole number')
      })

      // Enter a non-integer quantity
      cy.get('#quantity').clear().type('1.5')
      cy.get('#quantity-form-group .govuk-error-message').within(() => {
        cy.contains('Quantity must be a whole number')
      })

      // Enter a quantity less than the minimum
      cy.get('#quantity').clear().type('0')
      cy.get('#quantity-form-group .govuk-error-message').within(() => {
        cy.contains('Quantity must be 1 or more')
      })

      // Enter a quantity more than the maximum
      cy.get('#quantity').clear().type('51')
      cy.get('#quantity-form-group .govuk-error-message').within(() => {
        cy.contains('Quantity must be 50 or less')
      })

      // Enter a valid quantity
      cy.get('#quantity').clear().type('1')

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
    })

    // Submit form
    cy.get('[type="submit"]').contains('Create works order').click()
    // Submit form
    cy.get('.govuk-panel--confirmation').within(() => {
      cy.get('h1.govuk-heading-xl').contains('Repair work order created')

      cy.get('.govuk-panel__body').within(() => {
        cy.contains('Work order number')
        cy.contains('10102030')
      })
    })

    cy.get('.govuk-list li').within(() => {
      cy.contains('Back to 16 Pitcairn House St Thomass Square').should(
        'have.attr',
        'href',
        '/properties/00012345'
      )
      cy.contains('Start a new search')
    })

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
