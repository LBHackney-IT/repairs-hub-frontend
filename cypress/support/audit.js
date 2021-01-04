Cypress.Commands.add('audit', () => {
  if (Cypress.env('runAudit')) {
    cy.log('running lighthouse!')
    // Get test title to use in cypress/reports file naming
    cy.task('getTestTitle', Cypress.mocha.getRunner().test.title)
    cy.lighthouse()
  } else {
    cy.log('lighthouse disabled')
  }
})
