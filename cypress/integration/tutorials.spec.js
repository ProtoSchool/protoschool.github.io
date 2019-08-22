/* global describe, it, cy */

import tutorials from '../../src/static/tutorials.json'

describe('📝 0002', function () {
  viewSolutionsAndSubmitAll({ tutorialId: '0002', lessonCount: 3 })
})

describe('📝 0003', function () {
  viewSolutionsAndSubmitAll({ tutorialId: '0003', lessonCount: 7 })
})

function viewSolutionsAndSubmitAll ({ tutorialId, lessonCount, hasResources = true }) {
  const tutorialName = tutorials[tutorialId].url
  it(`should find the ${tutorialName} tutorial`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.get(`[href="#/${tutorialName}/01"]`).click()
  })
  for (let i = 1; i <= lessonCount; i++) {
    let lessonNr = i.toString().padStart(2, 0)
    it(`should view the solution and pass test ${lessonNr}`, function () {
      cy.url().should('include', `#/${tutorialName}/${lessonNr}`)
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
