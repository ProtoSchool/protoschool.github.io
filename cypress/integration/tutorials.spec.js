/* global describe, it, cy */

import tutorials, { getLessonType, getTutorialType } from '../../src/utils/tutorials'

// lessons to use as samples when testing functionality only once per lesson type
const testLessons = {
  code: {
    tutorialId: '0002',
    lessonNr: '02'
  },
  fileUpload: {
    tutorialId: '0004',
    lessonNr: '05'
  },
  // TODO: Uncomment when we have testing for multiple choice built and Anatomy of a CID is published
  // multipleChoice: {
  //   tutorialId: '0006',
  //   lessonNr: '03'
  // },
  text: {
    tutorialId: '0001',
    lessonNr: '01'
  }
}

// ensure every lesson in every tutorial included in tutorials.json is renderable, including resources pages
describe(`TEST RESET CODE FUNCTIONALITY`, function () {
  testResetCode(testLessons.code.tutorialId, testLessons.code.lessonNr)
  testResetCode(testLessons.fileUpload.tutorialId, testLessons.fileUpload.lessonNr)
})

// ensure every lesson in every tutorial included in tutorials.json is renderable, including resources pages
describe(`RENDER ALL LESSONS FROM TUTORIAL LANDING PAGE`, function () {
  Object.keys(tutorials).forEach(function (tutorialId) {
    describe(`render tutorial ${tutorialId} (${tutorials[tutorialId].url})`, function () {
      renderAllLessonsFromTutorialLandingPage(tutorialId)
    })
  })
})

// for tutorials with standard code challenges, ensure solution code passes lessons
describe(`ADVANCE THROUGH ALL LESSONS`, function () {
  Object.keys(tutorials).forEach(tutorialId => {
    describe(`advance through tutorial ${tutorialId} (${tutorials[tutorialId].url})`, function () {
      advanceThroughLessons(tutorialId)
    })
  })
})

function testResetCode (tutorialId, lessonNr) {
  const tutorialName = tutorials[tutorialId].url
  const tutorialType = getTutorialType(tutorialId)
  it(`should toggle resetCode in ${tutorialType} challenge (tutorial ${tutorialId} lesson ${lessonNr})`, function () {
    cy.visit(`/#/${tutorialName}/${lessonNr}`)
    cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
    cy.get('[data-cy=reset-code]').should('not.exist')
    cy.get('[data-cy=clear-default-code]').click({ force: true })
    cy.get('[data-cy=reset-code]').click()
    cy.get('[data-cy=reset-code]').should('not.exist')
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

function advanceThroughLessons (tutorialId) {
  const tutorialName = tutorials[tutorialId].url
  const lessonCount = tutorials[tutorialId].lessons.length // count excludes resources page
  const tutorialType = getTutorialType(tutorialId)

  // const hasResources = tutorials[tutorialId].hasOwnProperty('resources')
  it(`should find ${tutorialName} tutorial (${tutorialType}) landing page and load lesson 1 of ${lessonCount}`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.get(`[href="#/${tutorialName}/01"]`).click()
    cy.url().should('include', `#/${tutorialName}/01`)
  })

  // ALL TUTORIAL TYPES - loop through all lessons
  for (let i = 1; i <= lessonCount; i++) {
    let lessonNr = i.toString().padStart(2, 0)
    let lessonType = getLessonType(tutorialId, lessonNr)
    let nextLessonNr
    if (parseInt(lessonNr) === lessonCount) {
      nextLessonNr = 'resources'
    } else {
      nextLessonNr = (parseInt(lessonNr) + 1).toString().padStart(2, 0)
    }

    // CODE CHALLENGES ONLY
    if (lessonType === 'code' || lessonType === 'file-upload') {
      // ALL CODE CHALLENGES: check reset code and view solution
      it(`should use reset code and replace solution in ${lessonNr}`, function () {
        cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
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

    // ADVANCE TO NEXT LESSON AS ABLE OR BY CHEATING, DEPENDING ON LESSON TYPE
    let advance = {}

    switch (lessonType) {
      case 'code':
        advance.msg = `should PASS code challenge ${lessonNr} and advance to ${nextLessonNr}`
        advance.method = 'click'
        advance.buttonData = 'next-lesson-code'
        break
      case 'text':
        advance.msg = `should VIEW text lesson ${lessonNr} and advance to ${nextLessonNr}`
        advance.method = 'click'
        advance.buttonData = 'next-lesson-text'
        break
      case 'multiple-choice':
        advance.msg = `should CHEAT multiple choice lesson ${lessonNr} to advance to ${nextLessonNr}`
        advance.method = 'cheat'
        // TODO: Replace with data below when mult choice testing is enabled
        // advance.msg = `should PASS multiple choice lesson and advance to lesson ${nextLessonNr}`
        // advance.method = 'click'
        // advance.buttonData = 'next-lesson-mult-choice'
        break
      case 'file-upload':
        advance.msg = `should CHEAT file upload lesson ${lessonNr} to advance to ${nextLessonNr}`
        advance.method = 'cheat'
        // TODO: Replace with lines below when file upload testing is enabled
        // advance.msg = `should PASS file upload code challenge ${lessonNr} and advance to lesson ${nextLessonNr}`
        // advance.method = 'click'
        // advance.buttonData = 'next-lesson-code'
        break
    }

    it(`${advance.msg}`, function () {
      if (advance.method === 'cheat') {
        cy.log(`cannot fully test tutorial ${tutorialId}, lesson ${lessonNr} because it is of type ${lessonType}`)
        cy.visit(`/#/${tutorialName}/${nextLessonNr}`)
      } else if (advance.method === 'click') {
        cy.get(`[data-cy=${advance.buttonData}]`).click()
      }
      cy.url().should('include', `#/${tutorialName}/${nextLessonNr}`)
    })
  } // end loop through standard lessons, landing on resources page

  // ALL TUTORIAL TYPES - find resources page after looping through lessons
  it(`should VIEW resources and advance to tutorials`, function () {
    cy.contains('h1', 'Resources') // loads resources page
    cy.get('[data-cy=resources-content]') // loads meaningful content
    cy.get('[data-cy=more-tutorials]').click()
    cy.url().should('include', `#/tutorials/`)
  })
}
