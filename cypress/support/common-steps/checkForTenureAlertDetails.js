Cypress.Commands.add(
  'checkForTenureAlertDetails',
  (tenure, addressAlerts, contactAlerts) => {
    // Tenure
    cy.get('.hackney-property-alerts li.bg-dark-green').within(() => {
      cy.contains(tenure)
    })

    // Alerts
    cy.get('.hackney-property-alerts').within(() => {
      // Location alerts
      addressAlerts.forEach((alert) => {
        cy.contains(alert)
      })

      // Person alerts
      contactAlerts.forEach((alert) => {
        cy.contains(alert)
      })
    })
  }
)
