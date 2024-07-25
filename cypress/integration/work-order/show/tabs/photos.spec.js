/// <reference types="cypress" />

import 'cypress-audit/commands'

const WORK_ORDER_REFERENCE = 10000012

describe('Photos', () => {
  beforeEach(() => {
    cy.intercept(
      { method: 'GET', path: '/api/properties/00012345' },
      { fixture: 'properties/property.json' }
    )

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/${WORK_ORDER_REFERENCE}` },
      { fixture: 'workOrders/workOrder.json' }
    )

    cy.intercept(
      { method: 'GET', path: `/api/workOrders/${WORK_ORDER_REFERENCE}/tasks` },
      { body: [] }
    )

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
      cy.contains('25 Jul 2024, 07:30')
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
      cy.contains('21 Aug 2024, 14:21')

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

  it('shows validation errors when uploading files', () => {
    cy.visit(`/work-orders/${WORK_ORDER_REFERENCE}`)

    cy.get('a[id="tab_photos-tab"]').click()

    // 1. invalid file type

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.txt',
      mimeType: 'text/plain',
      lastModified: Date.now(),
    })

    cy.get('button').contains('Upload').click()
    // should contain error message
    cy.contains(`Unsupported file type "text/plain". Allowed types: PNG & JPG`)
    cy.get('a[id="tab_photos-tab"]').then((x) =>
      x.hasClass('govuk-form-group--error')
    )

    // 2. too many files
    cy.get('input[type="file"]').selectFile(
      Array(11).fill({
        contents: Cypress.Buffer.from('file contents'),
        fileName: 'file.png',
        mimeType: 'image/png',
        lastModified: Date.now(),
      })
    )

    cy.get('button').contains('Upload').click()

    // should contain error message
    cy.contains(`You cannot attach more than 10 photos`)
    cy.get('a[id="tab_photos-tab"]').then((x) =>
      x.hasClass('govuk-form-group--error')
    )

    // 3. removing additional file clears error message
    cy.get('button').contains('Remove').last().click()

    cy.get('button').contains('Upload').click()

    cy.contains(`You cannot attach more than 10 photos`).should('not.exist')
    cy.get('a[id="tab_photos-tab"]').should(
      'not.have.class',
      'govuk-form-group--error'
    )
  })

  it('shows error when network request fails', () => {
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/images/upload*' },
      { statusCode: 500 }
    ).as('getLinksRequest')

    cy.visit(`/work-orders/${WORK_ORDER_REFERENCE}`)

    cy.get('a[id="tab_photos-tab"]').click()

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.png',
      mimeType: 'image/png',
      lastModified: Date.now(),
    })

    cy.get('button').contains('Upload').click()

    cy.waitFor('@getLinksRequest')

    // should contain error message
    cy.contains('Failed to upload files')
    cy.contains('Request failed with status code 500')
  })

  it('shows shows success message when files uploaded', () => {
    cy.intercept(
      { method: 'GET', path: '/api/workOrders/images/upload*' },
      {
        statusCode: 200,
        body: {
          links: [
            {
              key: '10008056/575a54a6-6ca0-4ceb-a1a6-c831a8368bb9',
              presignedUrl: 'https://test.com/placeholder-upload-url',
            },
          ],
        },
      }
    ).as('getLinksRequest')

    cy.intercept(
      { method: 'PUT', path: 'https://test.com/placeholder-upload-url' },
      {
        statusCode: 200,
      }
    ).as('uploadToS3Request')

    cy.intercept(
      { method: 'POST', path: '/api/workOrders/images/completeUpload' },
      {
        statusCode: 200,
        body: {
          filesUploaded: ['10008056/575a54a6-6ca0-4ceb-a1a6-c831a8368bb9'],
        },
      }
    ).as('completeUploadRequest')

    cy.visit(`/work-orders/${WORK_ORDER_REFERENCE}`)

    cy.get('a[id="tab_photos-tab"]').click()

    // select and upload file
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: 'file.png',
      mimeType: 'image/png',
      lastModified: Date.now(),
    })
    cy.get('textarea[data-testid="description"]').type('some description')

    cy.get('button').contains('Upload').click()

    cy.waitFor('@getLinksRequest')
    cy.waitFor('@uploadToS3Request')
    cy.waitFor('@completeUploadRequest')

    cy.contains('Upload successful')
    cy.contains('1 photo has been added to the workOrder')
  })
})
