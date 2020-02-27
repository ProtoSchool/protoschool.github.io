/* global describe, it, cy */

import tutorials, { getTutorialType } from '../../src/utils/tutorials'
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

// ensures reset code button works for file upload and standard code challenges
describe(`RESETS CODE SUCCESSFULLY`, function () {
  testResetCode(testLessons.code.tutorialId, testLessons.code.lessonNr)
  testResetCode(testLessons.fileUpload.tutorialId, testLessons.fileUpload.lessonNr)
})

// ensures view solution toggle works for file upload and standard code challenges
describe(`DISPLAYS SOLUTION SUCCESSFULLY`, function () {
  testViewSolution(testLessons.code.tutorialId, testLessons.code.lessonNr)
  testViewSolution(testLessons.fileUpload.tutorialId, testLessons.fileUpload.lessonNr)
})

// for tutorials with standard code challenges, ensure solution code passes lessons
describe(`ADVANCES THROUGH ALL LESSONS IN ALL TUTORIALS`, function () {
  // Object.keys(tutorials).forEach(tutorialId => {
  //   describe(`tutorial ${tutorialId} (${tutorials[tutorialId].url})`, function () {
  //     advanceThroughLessons(tutorialId)
  //   })
  //
  // })
  describe(`tutorial 0004`, function () {
    advanceThroughLessons('0004')
  })
})

function testResetCode (tutorialId, lessonNr) {
  const tutorialName = tutorials[tutorialId].url
  const tutorialType = getTutorialType(tutorialId)
  it(`toggles resetCode in ${tutorialType} challenge (tutorial ${tutorialId} lesson ${lessonNr})`, function () {
    cy.visit(`/#/${tutorialName}/${lessonNr}`)
    cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
    cy.get('[data-cy=reset-code]').should('not.exist')
    // progress-not-yet-started should be visible
    cy.get('[data-cy=clear-default-code]').click({ force: true })
    // progress-in-progress should be visible
    cy.get('[data-cy=reset-code]').click()
    cy.get('[data-cy=reset-code]').should('not.exist')
    // progress-not-yet-started should be visible
  })
}

function testViewSolution (tutorialId, lessonNr) {
  const tutorialName = tutorials[tutorialId].url
  const tutorialType = getTutorialType(tutorialId)
  it(`toggles view solution in ${tutorialType} challenge (tutorial ${tutorialId} lesson ${lessonNr})`, function () {
    cy.visit(`/#/${tutorialName}/${lessonNr}`)
    cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
    cy.get('[data-cy=hide-solution]').should('not.exist')
    cy.get('[data-cy=view-solution]').should('be.visible')
    cy.get('[data-cy=solution]').should('not.be.visible')
    cy.get('[data-cy=view-solution]').click()
    cy.get('[data-cy=solution]').should('be.visible')
    cy.get('[data-cy=hide-solution]').should('be.visible')
    cy.get('[data-cy=hide-solution]').click()
    cy.get('[data-cy=hide-solution]').should('not.exist')
    cy.get('[data-cy=view-solution]').should('be.visible')
    cy.get('[data-cy=solution]').should('not.be.visible')
  })
}

function advanceThroughLessons (tutorialId) {
  const tutorialName = tutorials[tutorialId].url
  const tutorialTitle = tutorials[tutorialId].title
  const lessonCount = tutorials[tutorialId].lessons.length // count excludes resources page
  const lessons = tutorials[tutorialId].lessons
  const resourcesLesson = {
    title: 'Resources',
    type: 'resources',
    formattedId: 'resources'
  }
  // let previousFileUpload = false
  // let filesUploaded = 0
  let firstFileUploadIndex = lessons.findIndex(lesson => lesson.type === 'file-upload')
  lessons.push(resourcesLesson) // index of resourcesLesson = lessonCount

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
    cy.contains('h1', lessons[0].title)
  })

  // ALL TUTORIAL TYPES - loop through all lessons incl resources
  lessons.forEach(function (lesson, index) {
    let lessonNr = lesson.formattedId
    let lessonType = lesson.type
    let firstFileUpload = (index === firstFileUploadIndex)

    describe(`${lessonNr} (${lessonType})`, function () {
      // TEST RESOURCES
      if (lessonType === 'resources') {
        it(`displays resources and advances to tutorials page`, function () {
          cy.contains('h1', 'Resources') // loads resources page
          cy.get('[data-cy=resources-content]') // loads meaningful content
          cy.get('[data-cy=more-tutorials]').click()
          cy.url().should('include', `#/tutorials/`)
        })
        return
      }

      let nextLessonNr = lessons[index + 1].formattedId

      // TEXT LESSONS ONLY
      if (lessonType === 'text') {
        it(`shows enabled next button`, function () {
          cy.get(`[data-cy=next-lesson-text]`).should('be.visible').and('not.be.disabled')
        })
        advanceToNextLesson()
      }

      // TODO: MULTIPLE CHOICE LESSONS ONLY

      if (lessonType === 'multiple-choice') {
        advanceToNextLesson()
      }

      // CODE CHALLENGES ONLY (code and file upload)

      function pasteSolutionCode () {
        cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
        cy.get(`[data-cy=next-lesson-code]`).should('not.be.visible')
        cy.get('[data-cy=replace-with-solution]').click({ force: true })
        // progress-in-progress should be visible
      }

      function passCodeChallenge (prePassed) {
        // progress-in-progress should be visible
        if (!prePassed) {
          cy.get('[data-cy=submit-answer]').click()
        } else {
          cy.get('[data-cy=submit-needs-new-files]').click()
        }
        cy.get('[data-cy=output-success]').should('be.visible')
        // progress-passed should be visible
        cy.get(`[data-cy=next-lesson-code]`).should('be.visible').and('not.be.disabled')
      }

      if (lessonType === 'code') {
        it(`checks whether it's the first file upload lesson`, function () {
          cy.log(`firstFileUpload`, firstFileUpload)
        })
        it(`passes code challenge and enables next button`, function () {
          pasteSolutionCode()
          passCodeChallenge()
        })
        advanceToNextLesson()
      }

      function uploadSingleFile () {
        it(`uploads a single file`, function () {
          // cy.log(`filesUploaded`, filesUploaded)
          // cy.log(`previousFileUpload`, previousFileUpload)
          const fileName = 'favicon.png'
          cy.fixture(fileName).then(fileContent => {
            cy.get('[data-cy=file-upload]').upload({ fileContent, fileName, mimeType: 'image/png' })
          })
          // filesUploaded = 1
          // previousFileUpload = true
        })
      }
      function uploadMultipleFiles () {
        it(`uploads 2 files`, function () {
          // cy.log(`filesUploaded`, filesUploaded)
          // cy.log(`previousFileUpload`, previousFileUpload)
          cy.fixture('example.json', 'base64').then(exampleJson => {
            cy.fixture('favicon.png', 'base64').then(faviconPng => {
              const files = [
                { fileName: 'example.json', fileContent: exampleJson, mimeType: 'application/json' },
                { fileName: 'favicon.png', fileContent: faviconPng, mimeType: 'image/png' }
              ]
              cy.get('[data-cy=file-upload]').upload(files, { uploadType: 'input' })
            })
          })
          // filesUploaded = 2
          // previousFileUpload = true
        })
      }
      function confirmNoFilesUploaded (codePassed) {
        // codePassed = boolean whether to expect lessonPassed status
        it(`confirms no files are uploaded`, function () {
          cy.get(`[data-cy=reset-files]`).should('not.exist')
          cy.get(`[data-cy=submit-answer]`).should('not.exist')
          if (codePassed) {
            // lessonPassed status but need to re-upload files
            cy.get(`[data-cy=submit-needs-new-files]`).should('be.visible').and('be.disabled')
            cy.get(`[data-cy=submit-needs-new-files]`).trigger('mouseover', { force: true })
            cy.get(`[data-cy=need-new-files-msg]`).should('be.visible')
          } else {
            // lesson hasn't been passed before and needs file upload
            cy.get(`[data-cy=submit-disabled]`).should('be.visible').and('be.disabled')
            cy.get(`[data-cy=submit-disabled]`).trigger('mouseover', { force: true })
            cy.get(`[data-cy=need-files-msg]`).should('be.visible')
          }
          cy.get(`[data-cy=uploaded-file]`).should('not.exist')
        })
      }
      function confirmFilesUploaded (qty, codePassed) {
        it(`confirms ${qty} files are uploaded`, function () {
          // cy.log(`filesUploaded`, filesUploaded)
          // cy.log(`previousFileUpload`, previousFileUpload)
          cy.get(`[data-cy=submit-disabled]`).should('not.exist')
          if (codePassed) {
            cy.get(`[data-cy=submit-needs-new-files]`).should('be.visible').and('not.be.disabled').focus()
          } else {
            cy.get(`[data-cy=submit-answer]`).should('be.visible').and('not.be.disabled').focus()
          }
          cy.get(`[data-cy=need-files-msg]`).should('not.be.visible')
          cy.get(`[data-cy=need-new-files-msg]`).should('not.be.visible')
          cy.get(`[data-cy=reset-files]`).should('be.visible')
          cy.get(`[data-cy=uploaded-file]`).should('have.length', qty)
        })
      }
      function clearFiles () {
        it(`resets files`, function () {
          // cy.log(`filesUploaded`, filesUploaded)
          // cy.log(`previousFileUpload`, previousFileUpload)
          cy.get(`[data-cy=reset-files]`).click()
          // filesUploaded = 0
          // cy.log(`filesUploaded`, filesUploaded)
          // cy.log(`previousFileUpload`, previousFileUpload)
        })
      }

      if (lessonType === 'file-upload') {
        if (!firstFileUpload) {
          describe(`removes leftover files from previous lesson`, function () {
            // confirm files carried over from previous file upload lesson
            confirmFilesUploaded(2, false) // expect 2 files left from previous lesson and code not passed
            clearFiles() // because we need to test the single file way
          })
        }
        // pass lesson with single file but don't hit next button
        describe(`passes with solution code and SINGLE file upload`, function () {
          confirmNoFilesUploaded(false) // expect code not passed and no file uploaded
          uploadSingleFile()
          confirmFilesUploaded(1, false) // expect code not passed and 1 file uploaded
          it(`pastes solution code and passes code challenge`, function () {
            pasteSolutionCode()
            passCodeChallenge(false) // not previously passed
          })
        })
        // pass again with new files, leaving solution code as is
        describe(`passes again with leftover solution code and new MULTIPLE file upload`, function () {
          clearFiles()
          confirmNoFilesUploaded(true) // expect code passed and no files uploaded
          uploadMultipleFiles()
          confirmFilesUploaded(2, true) // expect code passed and 2 files uploaded
          it(`passes with pre-filled solution code and multiple file upload`, function () {
            passCodeChallenge(true) // previously passed
          })
          advanceToNextLesson()
        })
      }

      function advanceToNextLesson () {
        // ADVANCE TO NEXT LESSON AS ABLE OR BY CHEATING, DEPENDING ON LESSON TYPE
        let advance = {}

        switch (lessonType) {
          case 'code':
            advance.msg = `advances to ${nextLessonNr}`
            advance.method = 'click'
            advance.buttonData = 'next-lesson-code'
            break
          case 'text':
            advance.msg = `advances to ${nextLessonNr}`
            advance.method = 'click'
            advance.buttonData = 'next-lesson-text'
            break
          case 'multiple-choice':
            advance.msg = `CHEATS to advance to ${nextLessonNr}`
            advance.method = 'cheat'
            // TODO: Replace with data below when mult choice testing is enabled
            // advance.msg = `should PASS multiple choice lesson and advance to lesson ${nextLessonNr}`
            // advance.method = 'click'
            // advance.buttonData = 'next-lesson-mult-choice'
            break
          case 'file-upload':
            advance.msg = `advances to lesson ${nextLessonNr}`
            advance.method = 'click'
            advance.buttonData = 'next-lesson-code'
            break
        }

        it(`${advance.msg}`, function () {
          if (advance.method === 'cheat') {
            cy.log(`cannot fully test tutorial ${tutorialId}, lesson ${lessonNr} because it is of type ${lessonType}`)
            cy.visit(`/#/${tutorialName}/${nextLessonNr}`)
          } else if (advance.method === 'click') {
            cy.get(`[data-cy=${advance.buttonData}]`).should('be.visible').and('not.be.disabled')
            cy.get(`[data-cy=${advance.buttonData}]`).click()
          }
          cy.url().should('include', `#/${tutorialName}/${nextLessonNr}`)
          cy.contains('h1', lessons[index + 1].title)
        })
      }
    }) // end this lesson
  }) // end loop through standard lessons, landing on resources page
}
