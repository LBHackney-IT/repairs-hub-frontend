/// <reference types="cypress" />
import 'cypress-audit/commands'
describe('Show all work orders', () => {
  context(
    'Displays work order details, reference, date raised, last update, priority, property and description',
    () => {
      //Stub request with work orders response
      beforeEach(() => {
        cy.loginWithContractorRole()
        cy.server()
        cy.fixture('work_orders/jobs.json').as('workorderslist')
        cy.route('GET', 'api/repairs', '@workorderslist')
        cy.visit(`${Cypress.env('HOST')}/`)
      })

      it('displays headers of the table', () => {
        cy.get('.govuk-table').within(() => {
          cy.contains('th', 'Reference')
          cy.contains('th', 'Date raised')
          cy.contains('th', 'Last update')
          cy.contains('th', 'Priority')
          cy.contains('th', 'Property')
          cy.contains('th', 'Description')
        })
        // Run lighthouse audit for accessibility report
        cy.audit()
      })

      it('displays reference number, date raised, last updated, priority, property address, description', () => {
        cy.get('.govuk-table__cell').within(() => {
          cy.contains('00012346')
          cy.contains('13 Jan 2021')
          cy.contains('14 Jan 2021')
          cy.contains('N - Normal')
          cy.contains('1 Pitcairn House St Thomass Square')
          cy.contains(
            'ALPHA- Pitcairn house op stucl behind carpark gates from power network pls remedy AND Communal: Door entry; Residents locked out/in'
          )
        })
        // Run lighthouse audit for accessibility report
        cy.audit()
      })
    }
  )
})
