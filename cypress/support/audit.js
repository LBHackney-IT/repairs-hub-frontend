Cypress.Commands.add('audit', () => {
  if (Cypress.env('runAudit')) {
    cy.log('running lighthouse!')
    cy.lighthouse()
  } else {
    cy.log('lighthouse disabled')
  }
})
