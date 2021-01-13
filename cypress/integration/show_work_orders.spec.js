/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Show all work orders', () => {
  it('Displays work order details, reference, date raised, last update, priority, property and description', () => {
    //Stub request with work orders response
    cy.login()
    cy.server()
    cy.fixture('work_orders/jobs.json').as('workorderslist')
    cy.route('GET', 'api/repairs', '@workorderslist')
    cy.visit(`${Cypress.env('HOST')}/repairs/jobs`)

    cy.get('.govuk-table').within(() => {
      cy.contains('th', 'Reference')
      cy.contains('th', 'Date raised')
      cy.contains('th', 'Last update')
      cy.contains('th', 'Priority')
      cy.contains('th', 'Property')
      cy.contains('th', 'Description')
    })

    //can see reference number/ date raised, last updated, priority, property address, description
    cy.get('.govuk-table__cell').within(() => {
      cy.contains('00012345')
      cy.contains('13 January 2021')
      cy.contains('14 January 2021')
      cy.contains('N - Normal')
      cy.contains('1 Pitcairn House St Thomass Square')
      cy.contains(
        'ALPHA- Pitcairn house op stucl behind carpark gates from power network pls remedy AND Communal: Door entry; Residents locked out/in'
      )
    })

    // Run lighthouse audit for accessibility report
    cy.audit()
  })
})
