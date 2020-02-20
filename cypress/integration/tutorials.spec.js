/* global describe, it, cy */

import tutorials, { getLessonType, getTutorialType } from '../../src/utils/tutorials'
import courses from '../../src/static/courses.json'

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
describe(`DISPLAYS CORRECT TUTORIALS`, function () {
  it(`tutorials page shows all tutorials in correct order`, function () {
    cy.visit(`/#/tutorials/`)
    cy.get('[data-cy=tutorial-title]').should('have.length', courses.all.length) // displaying # of tutorials in all array in courses.json
    cy.get('[data-cy=tutorial-title]').should('have.length', Object.keys(tutorials).length) // displaying # of tutorials in tutorials.json
    for (let i = 0; i < courses.all.length; i++) {
      cy.get('[data-cy=tutorial-title]').eq(i).should('contain', tutorials[courses.all[i]].title)
    }
  })
  it(`toggle hides coding tutorials`, function () {
    const codelessTutorials = courses.all.filter(tutorialId => (getTutorialType(tutorialId) !== 'code') && (getTutorialType(tutorialId) !== 'file-upload'))
    cy.log('codelessTutorials', codelessTutorials)
    cy.get('[data-cy=toggle-coding-tutorials]').click()
    cy.get('[data-cy=tutorial-title]').should('have.length', codelessTutorials.length) // displaying # of tutorials in tutorials.json
    for (let i = 0; i < codelessTutorials.length; i++) {
      cy.get('[data-cy=tutorial-title]').eq(i).should('contain', tutorials[codelessTutorials[i]].title)
    }
  })
  it(`homepage shows featured tutorials in correct order`, function () {
    cy.visit(`/#/`)
    cy.get('[data-cy=tutorial-card-title]').should('have.length', courses.featured.length)
    for (let i = 0; i < courses.featured.length; i++) {
      cy.get('[data-cy=tutorial-card-title]').eq(i).should('contain', tutorials[courses.featured[i]].title)
    }
  })
})

// ensure every lesson in every tutorial included in tutorials.json is renderable, including resources pages
describe(`RESETS CODE SUCCESSFULLY`, function () {
  testResetCode(testLessons.code.tutorialId, testLessons.code.lessonNr)
  testResetCode(testLessons.fileUpload.tutorialId, testLessons.fileUpload.lessonNr)
})

// for tutorials with standard code challenges, ensure solution code passes lessons
describe(`ADVANCES THROUGH ALL LESSONS IN ALL TUTORIALS`, function () {
  Object.keys(tutorials).forEach(tutorialId => {
    describe(`advances through tutorial ${tutorialId} (${tutorials[tutorialId].url})`, function () {
      advanceThroughLessons(tutorialId)
    })
  })
})

function testResetCode (tutorialId, lessonNr) {
  const tutorialName = tutorials[tutorialId].url
  const tutorialType = getTutorialType(tutorialId)
  it(`toggles resetCode in ${tutorialType} challenge (tutorial ${tutorialId} lesson ${lessonNr})`, function () {
    cy.visit(`/#/${tutorialName}/${lessonNr}`)
    cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
    cy.get('[data-cy=reset-code]').should('not.exist')
    cy.get('[data-cy=clear-default-code]').click({ force: true })
    cy.get('[data-cy=reset-code]').click()
    cy.get('[data-cy=reset-code]').should('not.exist')
  })
}

function advanceThroughLessons (tutorialId) {
  const tutorialName = tutorials[tutorialId].url
  const tutorialTitle = tutorials[tutorialId].title
  const lessonCount = tutorials[tutorialId].lessons.length // count excludes resources page
  const standardLessons = tutorials[tutorialId].lessons

  it(`finds ${tutorialTitle} landing page with links to ${lessonCount} lessons plus resources`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.contains('h2', tutorialTitle)
    cy.get(`[data-cy=lesson-link-standard]`).should('have.length', lessonCount)
    cy.get(`[data-cy=lesson-link-resources]`).should('have.length', 1)
  })

  // const hasResources = tutorials[tutorialId].hasOwnProperty('resources')
  it(`uses lesson links and nav links btw landing page and 1st lesson`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.get(`[href="#/${tutorialName}/01"]`).click()
    cy.url().should('include', `#/${tutorialName}/01`)
    cy.get(`[data-cy=tutorial-landing-link]`).click() // test nav link back to tutorial landing page
    cy.contains('h2', tutorialTitle)
    cy.get(`[href="#/${tutorialName}/01"]`).click()
    cy.contains('h1', standardLessons[0].title)
  })

  // ALL TUTORIAL TYPES - loop through all lessons

  standardLessons.forEach(function (lesson, index) {
    let lessonNr = lesson.formattedId
    let lessonType = lesson.type
    let nextLessonNr
    if (parseInt(lessonNr) === lessonCount) {
      nextLessonNr = 'resources'
    } else {
      nextLessonNr = standardLessons[index + 1].formattedId
    }

    // CODE CHALLENGES ONLY
    if (lessonType === 'code' || lessonType === 'file-upload') {
      // ALL CODE CHALLENGES: test view solution and paste correct answer
      it(`views and pastes solution in ${lessonNr}`, function () {
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
        advance.msg = `PASSES code challenge ${lessonNr} and advances to ${nextLessonNr}`
        advance.method = 'click'
        advance.buttonData = 'next-lesson-code'
        break
      case 'text':
        advance.msg = `VIEWS text lesson ${lessonNr} and advances to ${nextLessonNr}`
        advance.method = 'click'
        advance.buttonData = 'next-lesson-text'
        break
      case 'multiple-choice':
        advance.msg = `CHEATS multiple choice lesson ${lessonNr} to advance to ${nextLessonNr}`
        advance.method = 'cheat'
        // TODO: Replace with data below when mult choice testing is enabled
        // advance.msg = `should PASS multiple choice lesson and advance to lesson ${nextLessonNr}`
        // advance.method = 'click'
        // advance.buttonData = 'next-lesson-mult-choice'
        break
      case 'file-upload':
        advance.msg = `CHEATS file upload lesson ${lessonNr} to advance to ${nextLessonNr}`
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
      if (nextLessonNr !== 'resources') {
        cy.contains('h1', standardLessons[index + 1].title)
      }
    })
  }) // end loop through standard lessons, landing on resources page

  // ALL TUTORIAL TYPES - find resources page after looping through lessons
  it(`VIEWS resources and advances to tutorials`, function () {
    cy.contains('h1', 'Resources') // loads resources page
    cy.get('[data-cy=resources-content]') // loads meaningful content
    cy.get('[data-cy=more-tutorials]').click()
    cy.url().should('include', `#/tutorials/`)
  })
}
