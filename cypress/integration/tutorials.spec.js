/* global describe, it, cy */

import tutorials from '../../src/static/tutorials.json'

// ensure every lesson in every tutorial included in tutorials.json is renderable, including resources pages
describe(`RENDER ALL LESSONS/TUTORIALS`, function () {
  Object.keys(tutorials).forEach(function (tutorial) {
    describe(`render ${tutorial}`, function () {
      renderAllLessonsInTutorial(tutorial)
    })
  })
})

// for tutorials with standard code challenges, ensure solution code passes lessons
describe(`PASS STANDARD CODE CHALLENGES`, function () {
  describe('📝 0002', function () {
    viewSolutionsAndSubmitAll({ tutorialId: '0002', lessonCount: 3 })
  })

  describe('📝 0003', function () {
    viewSolutionsAndSubmitAll({ tutorialId: '0003', lessonCount: 7 })
  })
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

function renderAllLessonsInTutorial (tutorialId) {
  const tutorialName = tutorials[tutorialId].url
  const standardLessons = tutorials[tutorialId].lessons
  const standardLessonCount = standardLessons.length

  it(`should find ${tutorialName} landing page with correct lesson count`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.get(`[data-cy=lesson-link]`).should('have.length', standardLessonCount)
  })

  it(`should find and render all standard lesson pages in ${tutorialName}`, function () {
    console.log('standardLessons: ', standardLessons)
    standardLessons.forEach((lessonName, index) => {
      console.log(lessonName)
      console.log(index)
      cy.get(`[data-cy=lesson-link]`).contains(lessonName).click()
      cy.contains('h1', lessonName)
      cy.get(`[data-cy=tutorial-landing-link]`).click()
    })
  })

  it(`should find and render resources page for ${tutorialName}`, function () {
    cy.get(`[data-cy=lesson-link-resources]`).click()
    cy.contains('h1', 'Resources')
    cy.get(`[data-cy=tutorial-landing-link]`).click()
  })
}
