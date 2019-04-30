/* global describe, it, cy */

describe('📝 Basics', function () {
  viewSolutionsAndSubmitAll({tutorialName: 'basics', lessonCount: 3})
})

describe('📝 Blog', function () {
  viewSolutionsAndSubmitAll({tutorialName: 'blog', lessonCount: 7})
})

function viewSolutionsAndSubmitAll ({tutorialName, lessonCount}) {
  it(`should find the ${tutorialName} tutorial`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.get(`[href="#/${tutorialName}/01"]`).click()
  })
  for (let i = 1; i <= lessonCount; i++) {
    it(`should view the solution and pass test ${i}`, function () {
      cy.url().should('include', `#/${tutorialName}/0${i}`)
      // cy.wait(500) // TODO: check if monaco editor is ready
      cy.get('[data-cy=editor-ready]').should('be.visible')
      cy.get('[data-cy=view-solution]').click()
      cy.get('[data-cy=reset-code]').should('be.visible') // wait for editor to be updated
      cy.get('[data-cy=submit-answer]').click()
      if (i < lessonCount) {
        cy.get('[data-cy=next-lesson]').click()
      } else {
        cy.get('[data-cy=more-tutorials]').click()
        cy.url().should('include', `#/tutorials/`)
      }
    })
  }
}
