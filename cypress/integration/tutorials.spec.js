/* global describe, it, cy */
describe('📝 Basics', function () {
  it('should show the solution and pass the test', function () {
    cy.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
      return false
    })
    cy.visit('/#/basics/')
    cy.get('[href="#/basics/01"]').click()
    const lessons = 3
    for (let i = 1; i <= lessons; i++) {
      cy.url().should('include', `#/basics/0${i}`)
      // cy.wait(500) // TODO: check if monaco editor is ready
      cy.get('[data-cy=editor-ready]').should('be.visible')
      cy.get('[data-cy=view-solution]').click()
      cy.get('[data-cy=reset-code]').should('be.visible') // wait for editor to be updated
      cy.get('[data-cy=submit-answer]').click()
      if (i < lessons) {
        cy.get('[data-cy=next-lesson]').click()
      } else {
        cy.get('[data-cy=more-tutorials]').click()
        cy.url().should('include', `#/tutorials/`)
      }
    }
  })
})

describe('📝 Blog', function () {
  it('should show the solution and pass the test', function () {
    cy.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
      return false
    })
    cy.visit('/#/blog/')
    cy.get('[href="#/blog/01"]').click()
    const lessons = 7
    for (let i = 1; i <= lessons; i++) {
      cy.url().should('include', `#/blog/0${i}`)
      // cy.wait(500) // TODO: check if monaco editor is ready
      cy.get('[data-cy=editor-ready]').should('be.visible')
      cy.get('[data-cy=view-solution]').click()
      cy.get('[data-cy=reset-code]').should('be.visible') // wait for editor to be updated
      cy.get('[data-cy=submit-answer]').click()
      if (i < lessons) {
        cy.get('[data-cy=next-lesson]').click()
      } else {
        cy.get('[data-cy=more-tutorials]').click()
        cy.url().should('include', `#/tutorials/`)
      }
    }
  })
})
