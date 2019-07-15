/* global describe, it, cy */

describe('📝 Basics', function () {
  viewSolutionsAndSubmitAll({ tutorialName: 'basics', lessonCount: 3 })
})

describe('📝 Blog', function () {
  viewSolutionsAndSubmitAll({ tutorialName: 'blog', lessonCount: 7 })
})

function viewSolutionsAndSubmitAll ({ tutorialName, lessonCount, hasResources = true }) {
  it(`should find the ${tutorialName} tutorial`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.get(`[href="#/${tutorialName}/01"]`).click()
  })
  for (let i = 1; i <= lessonCount; i++) {
    it(`should view the solution and pass test ${i}`, function () {
      cy.url().should('include', `#/${tutorialName}/0${i}`)
      cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
      cy.get('[data-cy=view-solution]').click()
      cy.get('[data-cy=solution-editor-ready]').should('be.visible') // wait for editor to be updated
      cy.get('[data-cy=replace-with-solution]').click({ force: true })
      cy.get('[data-cy=submit-answer]').click()
      if (i < lessonCount || hasResources) {
        cy.get('[data-cy=next-lesson]').click()
      } else {
        cy.get('[data-cy=more-tutorials]').click()
        cy.url().should('include', `#/tutorials/`)
      }
    })
  }
}
