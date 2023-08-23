import tutorials from '../../fixtures/tutorials.json'

Cypress.Commands.add('visitWithMockData', function (url) {
  cy.visit(url, {
    onBeforeLoad (window) {
      window.__DATA__ = { tutorials }
    }
  })
})
