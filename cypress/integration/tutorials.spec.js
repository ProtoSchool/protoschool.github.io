/* global describe, it, cy */

import { tutorials, getLessonType, getTutorialType } from '../../src/utils/tutorials'

// ensure every lesson in every tutorial included in tutorials.json is renderable, including resources pages
describe(`RENDER ALL LESSONS FROM TUTORIAL LANDING PAGE`, function () {
  Object.keys(tutorials).forEach(function (tutorialId) {
    describe(`render ${tutorialId}`, function () {
      renderAllLessonsFromTutorialLandingPage(tutorialId)
    })
  })
})

// for tutorials with standard code challenges, ensure solution code passes lessons
describe(`ADVANCE THROUGH LESSONS`, function () {
  Object.keys(tutorials).forEach(tutorialId => {
    describe(`ADVANCE THROUGH ${tutorialId}`, function () {
      advanceThroughLessons(tutorialId)
    })
  })
})

function cheatToAdvance (lessonNr, tutorialName, lessonCount) {
  if (parseInt(lessonNr) === lessonCount) {
    cy.visit(`/#/${tutorialName}/resources`)
  } else {
    let nextLessonNr = (parseInt(lessonNr) + 1).toString().padStart(2, 0)
    cy.visit(`/#/${tutorialName}/${nextLessonNr}`)
  }
}

function advanceThroughLessons (tutorialId) {
  const tutorialName = tutorials[tutorialId].url
  const lessonCount = tutorials[tutorialId].lessons.length // count excludes resources page
  const tutorialType = getTutorialType(tutorialId)
  // const hasResources = tutorials[tutorialId].hasOwnProperty('resources')
  it(`should find the ${tutorialName} tutorial (${tutorialType})`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.get(`[href="#/${tutorialName}/01"]`).click()
  })

  // ALL TUTORIAL TYPES - loop through all lessons
  for (let i = 1; i <= lessonCount; i++) {
    let lessonNr = i.toString().padStart(2, 0)
    let lessonType = getLessonType(tutorialId, lessonNr)
    it(`should find lesson ${lessonNr}`, function () {
      cy.url().should('include', `#/${tutorialName}/${lessonNr}`)
    })

    // CODE CHALLENGES ONLY
    if (lessonType === ('code' || 'file-upload')) {
      // ALL CODE CHALLENGES: check reset code and view solution
      it(`should use reset code and replace solution`, function () {
        cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
        cy.get('[data-cy=reset-code]').should('not.exist')
        cy.get('[data-cy=clear-default-code]').click({ force: true })
        cy.get('[data-cy=reset-code]').click()
        cy.get('[data-cy=reset-code]').should('not.exist')
        cy.get('[data-cy=view-solution]').click()
        cy.get('[data-cy=solution-editor-ready]').should('be.visible') // wait for editor to be updated
        cy.get('[data-cy=replace-with-solution]').click({ force: true })
        cy.get('[data-cy=reset-code]').should('be.visible')
        // FILE UPLOAD ONLY: upload fake file
        // TODO: Add conditional here for file-upload lessons only to add a fake file so that submit button will be enabled]

        // ALL CODE CHALLENGES (EVENTUALLY): submit solution code (and fake file if relevant)
        // TODO: Remove conditional when this will work for both file-upload and code
        if (lessonType === 'code') {
          cy.get('[data-cy=submit-answer]').click()
        }
      })
    }

    it(`should advance to next lesson`, function () {
    // ALL LESSON TYPES advance to next lesson (leads to resources on last iteration)
    // TODO: Remove conditional when we've taught Cypress to pass file-upload and multiple-choice lessons
      if (lessonType === ('code' || 'text')) {
        cy.get('[data-cy=next-lesson]').click()
      } else if (lessonType === ('multiple-choice' || 'file-upload')) {
        cy.log(`cannot fully test tutorial ${tutorialId}, lesson ${lessonNr} because it is of type ${lessonType}`)
        cheatToAdvance(lessonNr, tutorialName, lessonCount)
      }
    })
  }

  // ALL TUTORIAL TYPES - find resources page after looping through lessons
  it(`should find resources and navigate to tutorials`, function () {
    cy.contains('h1', 'Resources') // loads resources page
    cy.get('[data-cy=resources-content]') // loads meaningful content
    cy.get('[data-cy=more-tutorials]').click()
    cy.url().should('include', `#/tutorials/`)
  })
}

function renderAllLessonsFromTutorialLandingPage (tutorialId) {
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
