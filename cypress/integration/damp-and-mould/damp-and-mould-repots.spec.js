/// <reference types="cypress" />

import 'cypress-audit/commands'

import reportsFixture from '../../fixtures/dampAndMouldReports/reports'

describe('Damp and mould reports page', () => {
  beforeEach(() => {
    cy.loginDampAndMouldManagerRole()

    cy.intercept(
      {
        method: 'GET',
        path: '/api/damp-and-mould/reports?pageSize=12&pageNumber=1',
      },
      { fixture: 'dampAndMouldReports/reports.json' }
    ).as('dampAndMouldReportsRequest')
  })

  it('displays damp and mould reports', () => {
    cy.visit('/damp-and-mould-reports')

    cy.wait(['@dampAndMouldReportsRequest'])

    reportsFixture.results.forEach((report) => {
      cy.contains(report.address)
      cy.contains(report.comments)

      cy.get(
        `a[href="/damp-and-mould-reports/${report.propertyReference}"]`
      ).contains('View related reports')
    })
  })

  it('enables users to select page size', () => {
    cy.visit('/damp-and-mould-reports')

    cy.wait(['@dampAndMouldReportsRequest'])

    cy.intercept(
      {
        method: 'GET',
        path: '/api/damp-and-mould/reports?pageSize=20&pageNumber=1',
      },
      { fixture: 'dampAndMouldReports/reports.json' }
    ).as('changePageSizeRequest')

    cy.get(`select[data-testid="dampAndMould_pageSizeSelect"]`).select('20')

    // assert additional request made
    cy.wait(['@changePageSizeRequest'])
  })

  it('navigates between pages', () => {
    cy.visit('/damp-and-mould-reports')

    cy.wait(['@dampAndMouldReportsRequest'])

    cy.intercept(
      {
        method: 'GET',
        path: '/api/damp-and-mould/reports?pageSize=12&pageNumber=2',
      },
      { fixture: 'dampAndMouldReports/reportsPage2.json' }
    ).as('nextPageRequest')

    cy.intercept(
      {
        method: 'GET',
        path: '/api/damp-and-mould/reports?pageSize=12&pageNumber=1',
      },
      { fixture: 'dampAndMouldReports/reports.json' }
    ).as('previousPageRequest')

    // Check current page status
    cy.contains('Showing items 1 - 12 of 24 results')
    cy.contains('Previous page').should('not.exist')

    // Navigate to next page
    cy.contains('Next page').click()
    cy.wait(['@nextPageRequest'])

    // Check current page status
    cy.contains('Showing items 13 - 24 of 24 results')
    cy.contains('Next page').should('not.exist')

    // Navigate to previous page
    cy.contains('Previous page').click()
    cy.wait(['@previousPageRequest'])

    // Check current page status
    cy.contains('Showing items 1 - 12 of 24 results')
    cy.contains('Previous page').should('not.exist')
  })
})
