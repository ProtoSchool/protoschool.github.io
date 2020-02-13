/* global describe, it, cy */

import tutorials from '../../src/static/tutorials.json'

// tutorials with standard coding challenges only (no file upload, multiple choice, or text only lessons)
// NEED TO UPDATE WHEN ADDING NEW CONTENT
const standardCodingTutorials = ['0002', '0003']

// ensure every lesson in every tutorial included in tutorials.json is renderable, including resources pages
describe(`RENDER ALL LESSONS/TUTORIALS`, function () {
  Object.keys(tutorials).forEach(function (tutorialId) {
    describe(`render ${tutorialId}`, function () {
      renderAllLessonsInTutorial(tutorialId)
    })
  })
})

// for tutorials with standard code challenges, ensure solution code passes lessons
describe(`PASS STANDARD CODE CHALLENGES`, function () {
  standardCodingTutorials.forEach(tutorialId => {
    describe(`pass ${tutorialId}`, function () {
      viewSolutionsAndSubmitAll(tutorialId)
    })
  })
})

function viewSolutionsAndSubmitAll (tutorialId) {
  const tutorialName = tutorials[tutorialId].url
  const lessonCount = tutorials[tutorialId].lessons.length // count excludes resources page
  // const hasResources = tutorials[tutorialId].hasOwnProperty('resources')
  it(`should find the ${tutorialName} tutorial`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.get(`[href="#/${tutorialName}/01"]`).click()
  })
  // loop through standard lessons and attempt to pass challenges
  for (let i = 1; i <= lessonCount; i++) {
    let lessonNr = i.toString().padStart(2, 0)
    it(`should view the solution and pass test ${lessonNr}`, function () {
      cy.url().should('include', `#/${tutorialName}/${lessonNr}`)
      cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
      cy.get('[data-cy=view-solution]').click()
      cy.get('[data-cy=solution-editor-ready]').should('be.visible') // wait for editor to be updated
      cy.get('[data-cy=replace-with-solution]').click({ force: true })
      cy.get('[data-cy=submit-answer]').click()
      cy.get('[data-cy=next-lesson]').click() // leads to resources on last iteration
    })
  }
  it(`should find resources and navigate to tutorials`, function () {
    cy.contains('h1', 'Resources') // loads resources page
    cy.get('[data-cy=resources-content]') // loads meaningful content
    cy.get('[data-cy=more-tutorials]').click()
    cy.url().should('include', `#/tutorials/`)
  })
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
    standardLessons.forEach((lesson, index) => {
      cy.get(`[data-cy=lesson-link]`).contains(lesson.title).click()
      cy.contains('h1', lesson.title)
      cy.get(`[data-cy=tutorial-landing-link]`).click()
    })
  })

  it(`should find and render resources page for ${tutorialName}`, function () {
    cy.get(`[data-cy=lesson-link-resources]`).click()
    cy.contains('h1', 'Resources')
    cy.get(`[data-cy=tutorial-landing-link]`).click()
  })
}
