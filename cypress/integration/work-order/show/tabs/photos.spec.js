/// <reference types="cypress" />

import 'cypress-audit/commands'

const WORK_ORDER_REFERENCE = 10000012

describe('Photos', () => {
  beforeEach(() => {
    // // Stub requests
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )
    // cy.intercept(
    //   {
    //     method: 'GET',
    //     path:
    //       '/api/workOrders/?propertyReference=00012345&PageSize=50&PageNumber=1',
    //   },
    //   { fixture: 'workOrders/workOrders.json' }
    // )
    cy.intercept(
      { method: 'GET', path: `/api/workOrders/${WORK_ORDER_REFERENCE}` },
      { fixture: 'workOrders/workOrder.json' }
    )
    // cy.intercept(
    //   { method: 'GET', path: '/api/workOrders/10000012/notes' },
    //   { fixture: 'workOrders/notes.json' }
    // )
    cy.intercept(
      { method: 'GET', path: `/api/workOrders/${WORK_ORDER_REFERENCE}/tasks` },
      { body: [] }
    )
    // cy.intercept(
    //   { method: 'POST', path: '/api/jobStatusUpdate' },
    //   { body: '' }
    // ).as('apiCheck')

    cy.intercept('/mockfilepath/photo_1.jpg', { fixture: 'photos/photo_1.jpg' })
    cy.intercept('/mockfilepath/photo_2.jpg', { fixture: 'photos/photo_2.jpg' })
    cy.intercept('/mockfilepath/photo_3.jpg', { fixture: 'photos/photo_3.jpg' })

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/images/${WORK_ORDER_REFERENCE}` },
      {
        fixture: 'photos/photos.json',
      }
    ).as('photos')

    cy.intercept(
      { method: 'PATCH', path: '/api/workOrders/images/fileGroup' },
      { statusCode: 204 }
    ).as('updateDescriptionRequest')

    cy.loginWithAgentRole()
  })

  it('shows a list of photos', () => {
    cy.visit(`/work-orders/${WORK_ORDER_REFERENCE}`)

    cy.get('a[id="tab_photos-tab"]').click()

    cy.get('li[data-testid="fileGroup-152"]').within(() => {
      cy.contains('Uploaded directly to work order')
      cy.contains('Uploaded by Test Test (test.test@hackney.gov.uk)')
      cy.contains('25 July 2024, 07:30')
      cy.contains('Some description')

      cy.get('button').contains('Edit description')

      cy.get('img[src="/mockfilepath/photo_1.jpg"]').should('exist')
      cy.get('img[src="/mockfilepath/photo_2.jpg"]').should('exist')
      cy.get('img[src="/mockfilepath/photo_3.jpg"]').should('exist')
    })

    cy.get('li[data-testid="fileGroup-153"]').within(() => {
      cy.contains('Closing work order')
      cy.contains(
        'Uploaded by Dennis Reynolds (dennis.reynolds@hackney.gov.uk)'
      )
      cy.contains('21 August 2024, 14:21')

      cy.get('button').contains('Add description')

      cy.get('img[src="/mockfilepath/photo_2.jpg"]').should('exist')
      cy.get('img[src="/mockfilepath/photo_3.jpg"]').should('exist')
    })
  })

  it('can add or edit a description', () => {
    cy.visit(`/work-orders/${WORK_ORDER_REFERENCE}`)

    cy.get('a[id="tab_photos-tab"]').click()

    // edit description
    cy.contains('Edit description').click()
    cy.get("textarea[data-testid='description']").type('New description')
    cy.contains('Save description').click()

    // triggers update request
    cy.waitFor('@updateDescriptionRequest')
    // triggers reload
    cy.waitFor('@photos')

    // add description
    cy.contains('Add description').click()
    cy.get("textarea[data-testid='description']").type('Some other description')
    cy.contains('Add description').click()

    // triggers update request
    cy.waitFor('@updateDescriptionRequest')
    // triggers reload
    cy.waitFor('@photos')
  })

  it.only('shows validation errors when uploading files', () => {
    cy.visit(`/work-orders/${WORK_ORDER_REFERENCE}`)

    cy.get('a[id="tab_photos-tab"]').click()

    cy.get('input[type="file"]').selectFile('photos/photo_1.jpg')
  })

  // it('Fill out notes form and update the work order status', () => {
  //   cy.visit('/work-orders/10000012')
  //   // Tasks and SORs tab should be active
  //   cy.get('.govuk-tabs__list-item--selected a').contains('Tasks and SORs')
  //   // Now select Notes tab
  //   cy.get('a[id="tab_notes-tab"]').click()
  //   cy.get('#notes-tab').within(() => {
  //     cy.get('.lbh-heading-h2').contains('Notes')
  //     // Form hidden by default
  //     cy.get('#note-form-group').should('not.exist')
  //     // Click to reveal form
  //     cy.contains('Add a new note').click()

  //     // Try submit form with no note
  //     cy.get('[type="submit"]').contains('Publish note').click()
  //     cy.get('#note-form-group .govuk-error-message').within(() => {
  //       cy.contains('Please enter a note')
  //     })

  //     // Enter a valid note
  //     cy.get('#note')
  //       .get('.govuk-textarea')
  //       .clear()
  //       .type('A note about the repair')
  //     // Submit form
  //     cy.get('[type="submit"]').contains('Publish note').click()
  //   })

  //   // Check body of post request
  //   cy.get('@apiCheck')
  //     .its('request.body')
  //     .should('deep.equal', {
  //       relatedWorkOrderReference: {
  //         id: '10000012',
  //       },
  //       comments: 'A note about the repair',
  //       typeCode: '0',
  //       otherType: 'addNote',
  //     })

  //   // Run lighthouse audit for accessibility report
  //   cy.audit()
  // })

  // it('Displays notes as a timeline', () => {
  //   cy.visit('/work-orders/10000012')

  //   cy.get('a[id="tab_notes-tab"]').click()

  //   cy.get('#notes-tab').within(() => {
  //     cy.get('.lbh-heading-h2').contains('Notes')

  //     cy.get('[data-note-id="0"]').within(() => {
  //       cy.get('.note-info').within(() => {
  //         cy.contains('8 Feb 2021, 15:06')
  //         cy.contains('by Random User (random.user@hackney.gov.uk)')
  //       })
  //     })
  //     cy.get('[data-note-id="1"]').within(() => {
  //       cy.get('.note-info').within(() => {
  //         cy.contains('8 Feb 2021, 15:05')
  //         cy.contains('by Random User (random.user@hackney.gov.uk)')
  //       })
  //     })
  //   })
  // })

  // it('Displays no notes message when there are no notes', () => {
  //   cy.intercept(
  //     { method: 'GET', path: '/api/workOrders/10000012/notes' },
  //     { body: [] }
  //   )

  //   cy.visit('/work-orders/10000012')
  //   cy.get('a[id="tab_notes-tab"]').click()

  //   cy.get('#notes-tab').within(() => {
  //     cy.get('.lbh-heading-h2').contains('Notes')
  //     cy.get('.lbh-body-s').contains('There are no notes for this work order.')
  //   })
  // })

  // it('Navigate directly to notes tab', () => {
  //   cy.visit('/work-orders/10000012#notes-tab')
  //   // Notes tab should be active
  //   cy.get('.govuk-tabs__list-item--selected a').contains('Notes')

  //   cy.get('#notes-tab').within(() => {
  //     cy.get('.lbh-heading-h2').contains('Notes')
  //   })
  // })
})
