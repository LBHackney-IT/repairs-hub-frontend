/// <reference types="cypress" />

import 'cypress-audit/commands'
import reportsFixture from '../../fixtures/dampAndMouldReports/reports'

const PROPERTY_REFERENCE = '001234567788'

describe('Damp and mould reports property page', () => {
  beforeEach(() => {
    cy.loginDampAndMouldManagerRole()

    cy.intercept(
      {
        method: 'GET',
        path: `/api/damp-and-mould/reports?pageSize=20&pageNumber=1&propertyReference=${PROPERTY_REFERENCE}`,
      },
      { fixture: 'dampAndMouldReports/reports.json' }
    ).as('dampAndMouldReportsRequest')

    cy.intercept(
      {
        method: 'GET',
        path: `/api/properties/${PROPERTY_REFERENCE}`,
      },
      {
        fixture: 'properties/property.json',
      }
    ).as('propertyRequest')
  })

  it('displays damp and mould reports', () => {
    cy.visit(`/damp-and-mould-reports/${PROPERTY_REFERENCE}`)

    cy.wait(['@propertyRequest', '@dampAndMouldReportsRequest'])

    reportsFixture.results.forEach((report) => {
      cy.contains(report.comments)
    })
  })

  it.only('shows more reports', () => {
    cy.visit(`/damp-and-mould-reports/${PROPERTY_REFERENCE}`)

    cy.wait(['@propertyRequest', '@dampAndMouldReportsRequest'])

    cy.intercept(
      {
        method: 'GET',
        path: `/api/damp-and-mould/reports?pageSize=20&pageNumber=2&propertyReference=${PROPERTY_REFERENCE}`,
      },
      { fixture: 'dampAndMouldReports/reportsPage2.json' }
    ).as('showMoreReportsRequest')

    // Check current page status
    cy.contains('Showing 12 of 24 reports')

    // Navigate to next page
    cy.contains('Show more').click()
    cy.wait(['@showMoreReportsRequest'])

    cy.contains('Showing 24 of 24 reports')
    cy.contains('Show more').should('not.exist')
  })
})
