import _ from 'lodash'

import tutorialsList, { getTutorialType } from '../../src/utils/tutorials'
import { courseList, filterTutorials } from '../../src/utils/filters'
import courses from '../../src/static/courses.json'

const tutorials = _.omitBy(tutorialsList, tutorial => tutorial.hidden)

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
  multipleChoice: {
    tutorialId: '0006',
    lessonNr: '03'
  },
  text: {
    tutorialId: '0001',
    lessonNr: '01'
  }
}

// ensure correct tutorial cards appear on tutorials page and landing page (matching tutorials.json & courses.json)
describe(`DISPLAYS CORRECT TUTORIALS ON HOMEPAGE AND TUTORIALS PAGE`, function () {
  function assertTutorialsAreNotFiltered () {
    cy.get('[data-cy=tutorial-card-title]').should('have.length', courses.all.length) // displaying # of tutorials in all array in courses.json
      .and('have.length', Object.keys(tutorials).length) // displaying # of tutorials in tutorials.json
    for (let i = 0; i < courses.all.length; i++) {
      cy.get('[data-cy=tutorial-card-title]').eq(i).should('contain', tutorials[courses.all[i]].title)
    }
  }

  // pass in only course key
  function assertTutorialsAreFiltered (courseKey, showCodingTutorials) {
    const expectedTutorials = filterTutorials(courseKey, showCodingTutorials) // an array of tutorial IDs
    cy.get('[data-cy=tutorial-card-title]').should('have.length', expectedTutorials.length) // displaying # of tutorials in tutorials.json
    for (let i = 0; i < expectedTutorials.length; i++) {
      cy.get('[data-cy=tutorial-card-title]').eq(i).should('contain', tutorials[expectedTutorials[i].formattedId].title)
    }
  }

  it(`homepage shows featured tutorials in correct order`, function () {
    cy.visit(`/#/`)
    cy.get('[data-cy=tutorial-card-title]').should('have.length', courses.featured.length)
    for (let i = 0; i < courses.featured.length; i++) {
      cy.get('[data-cy=tutorial-card-title]').eq(i).should('contain', tutorials[courses.featured[i]].title)
    }
  })

  it(`tutorials page shows all tutorials in correct order`, function () {
    cy.visit(`/#/tutorials/`)
    assertTutorialsAreNotFiltered()
  })

  it(`course select displays correct options`, function () {
    // starts with coding ones displayed
    cy.get('[data-cy=course-select]').should('not.have.class', 'vs--open') // dropdown closed
    cy.get('[data-cy=course-select]').find('ul#vs1__listbox').should('be.hidden') // selections hidden
    cy.get('[data-cy=course-select]').find('span.vs__selected').contains('All') // 'All' selected
    cy.get('[data-cy=course-select]').find('.vs__actions').click() // click to see options
    cy.get('[data-cy=course-select]').should('have.class', 'vs--open') // dropdown open
      .find('ul#vs1__listbox').should('not.be.hidden') // selections visible
      .find('li').should(($lis) => {
        expect($lis, `${Object.keys(courseList).length}`).to.have.length(Object.keys(courseList).length)
        Object.keys(courseList).forEach(function (courseKey, i) {
          expect($lis.eq(i), 'i').to.contain(courseList[courseKey].name)
        })
      })
  })

  it(`toggle hides coding tutorials via click and url`, function () {
    cy.visit(`/#/tutorials/`)
    assertTutorialsAreNotFiltered()
    cy.get('[data-cy=toggle-coding-tutorials]').click()
    assertTutorialsAreFiltered('all', false)
    cy.reload()
    assertTutorialsAreFiltered('all', false)
    cy.visit(`/#/tutorials?code=true`)
    cy.reload()
    assertTutorialsAreNotFiltered()
    cy.visit(`/#/tutorials?code=false`)
    cy.reload()
    assertTutorialsAreFiltered('all', false)
  })

  it(`course filter displays correct tutorials with and without code`, function () {
    // starts with coding ones hidden

    Object.keys(courseList).forEach(function (courseKey, i) {
      cy.get('[data-cy=course-select]').find('.vs__actions').click()
      cy.get('[data-cy=course-select]').find(`li#vs1__option-${i}`).contains(courseList[courseKey].name).click()
      assertTutorialsAreFiltered(courseKey, false)
    })

    cy.get('[data-cy=toggle-coding-tutorials]').click() // show coding tutorials

    Object.keys(courseList).forEach(function (courseKey, i) {
      cy.get('[data-cy=course-select]').find('.vs__actions').click()
      cy.get('[data-cy=course-select]').find(`li#vs1__option-${i}`).contains(courseList[courseKey].name).click()
      assertTutorialsAreFiltered(courseKey, true)
    })
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

// ensures multiple choice options display correct content and passing status
describe(`NAVIGATES MULTIPLE CHOICE OPTIONS SUCCESSFULLY`, function () {
  testMultipleChoiceOptions(testLessons.multipleChoice.tutorialId, testLessons.multipleChoice.lessonNr)
})

// for tutorials with standard code challenges, ensure solution code passes lessons
describe(`ADVANCES THROUGH ALL LESSONS IN ALL TUTORIALS`, function () {
  Object.keys(tutorials).forEach(tutorialId => {
    describe(`TUTORIAL ${tutorialId} (${tutorials[tutorialId].url})`, function () {
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
    cy.get(`[data-cy=progress-not-yet-started]`).should('be.visible')
    cy.get(`[data-cy=progress-icon-not-yet-started]`).should('be.visible')
    cy.get('[data-cy=clear-default-code]').click({ force: true })
    cy.get(`[data-cy=progress-in-progress]`).should('be.visible')
    cy.get(`[data-cy=progress-icon-in-progress]`).should('be.visible')
    cy.get('[data-cy=reset-code]').click()
    cy.get('[data-cy=reset-code]').should('not.exist')
    cy.get(`[data-cy=progress-not-yet-started]`).should('be.visible')
    cy.get(`[data-cy=progress-icon-not-yet-started]`).should('be.visible')
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

function testMultipleChoiceOptions (tutorialId, lessonNr) {
  const tutorialName = tutorials[tutorialId].url
  const lesson = tutorials[tutorialId].lessons[parseInt(lessonNr) - 1]
  const choices = lesson.logic.choices
  const correctChoiceIndex = choices.findIndex(choice => choice.correct === true)
  it(`displays right number of choices lesson ${lessonNr} and displays as not yet started`, function () {
    cy.visit(`/#/${tutorialName}/${lessonNr}`)
    cy.get('[data-cy=choice]').should('have.length', choices.length)
    cy.get('[data-cy=output-success]').should('not.exist')
    cy.get('[data-cy=output-fail]').should('not.exist')
    cy.get(`[data-cy=progress-not-yet-started]`).should('be.visible')
    cy.get(`[data-cy=progress-icon-not-yet-started]`).should('be.visible')
  })
  function testChoice (choice, index) {
    let choiceType = index === correctChoiceIndex ? 'RIGHT' : 'WRONG'
    let correctOutput = index === correctChoiceIndex ? 'output-success' : 'output-fail'
    let incorrectOutput = index === correctChoiceIndex ? 'output-fail' : 'output-success'
    let correctButton = index === correctChoiceIndex ? 'not.be.disabled' : 'be.disabled'
    let correctProgress = index === correctChoiceIndex ? 'passed' : 'in-progress'
    describe(`${choiceType} choice ${index}`, function () {
      it(`shows correct completion status and button state`, function () {
        cy.get('[data-cy=choice]').eq(index).click()
        cy.get(`[data-cy=progress-${correctProgress}]`).should('be.visible')
        cy.get(`[data-cy=progress-icon-${correctProgress}]`).should('be.visible')
        cy.get('[data-cy=next-lesson-mult-choice]').should(correctButton)
      })
      it(`displays answer correctly`, function () {
        cy.get('[data-cy=choice]').eq(index).should('contain', parseTextForMarkdown(choice.answer))
      })
      it(`displays feedback correctly`, function () {
        cy.get(`[data-cy=${incorrectOutput}]`).should('not.exist')
        cy.get(`[data-cy=${correctOutput}]`).should('contain', parseTextForMarkdown(choice.feedback))
      })
    })
  }
  //  test correct answer first to ensure passed status will be cleared afterward
  testChoice(choices[correctChoiceIndex], correctChoiceIndex)
  //  test all incorrect answers
  choices.forEach(function (choice, index) {
    if (index !== correctChoiceIndex) {
      testChoice(choice, index)
    }
  })
  //  test correct answer again to ensure progress status flips back
  testChoice(choices[correctChoiceIndex], correctChoiceIndex)
}

function parseTextForMarkdown (text) {
  return text.replace(/`/g, '')
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
  let firstFileUploadIndex = lessons.findIndex(lesson => lesson.type === 'file-upload')
  lessons.push(resourcesLesson) // index of resourcesLesson = lessonCount

  it(`finds ${tutorialTitle} landing page with links to correct ${lessonCount} lessons plus resources`, function () {
    cy.visit(`/#/${tutorialName}/`)
    cy.contains('h2', tutorialTitle)
    cy.get(`[data-cy=lesson-link-standard]`).should('have.length', lessonCount)
    cy.get(`[data-cy=lesson-link-resources]`).should('have.length', 1)
    // show that correct links are in correct order, but don't click through to test them
    // (instead test a single case of linking below and test render when clicking through lessons in order)
    for (let i = 0; i < lessonCount; i++) {
      cy.get('[data-cy=lesson-link-standard]').eq(i)
        .should('contain', lessons[i].title)
        .and('have.attr', 'href', `#/${tutorialName}/${lessons[i].formattedId}`)
    }

    cy.get(`[data-cy=lesson-link-resources]`).eq(0)
      .should('contain', 'More to explore')
      .and('have.attr', 'href', `#/${tutorialName}/resources`)
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

  // ALL TUTORIAL TYPES - loop through all lessons incl resources by clicking through lessons
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
          cy.url().should('include', `#/tutorials`)
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

      // MULTIPLE CHOICE LESSONS

      function passMultipleChoice (correctChoiceIndex) {
        cy.get('[data-cy=choice]').eq(correctChoiceIndex).click()
        cy.get('[data-cy=next-lesson-mult-choice]').should('be.visible')
      }

      if (lessonType === 'multiple-choice') {
        let choices = lesson.logic.choices
        let correctChoiceIndex = choices.findIndex(choice => choice.correct === true)
        it(`passes multiple choice lesson and enables next button`, function () {
          passMultipleChoice(correctChoiceIndex)
        })
        advanceToNextLesson()
      } // end mult choice

      // CODE CHALLENGES ONLY (code and file upload)

      function pasteSolutionCode () {
        cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
        cy.get(`[data-cy=next-lesson-code]`).should('not.be.visible')
        cy.get('[data-cy=replace-with-solution]').click({ force: true })
        cy.get(`[data-cy=progress-in-progress]`).should('be.visible')
        cy.get(`[data-cy=progress-icon-in-progress]`).should('be.visible')
      }

      function passCodeChallenge (prePassed) {
        if (!prePassed) {
          cy.get(`[data-cy=progress-in-progress]`).should('be.visible')
          cy.get(`[data-cy=progress-icon-in-progress]`).should('be.visible')
          cy.get('[data-cy=submit-answer]').click()
        } else {
          cy.get(`[data-cy=progress-passed]`).should('be.visible')
          cy.get(`[data-cy=progress-icon-passed]`).should('be.visible')
          cy.get('[data-cy=submit-needs-new-files]').click()
        }
        cy.get('[data-cy=output-success]', {timeout: 30000}).should('be.visible')
        cy.get(`[data-cy=progress-passed]`, {timeout: 30000}).should('be.visible')
        cy.get(`[data-cy=progress-icon-passed]`, {timeout: 30000}).should('be.visible')
        cy.get(`[data-cy=next-lesson-code]`, {timeout: 30000}).should('be.visible').and('not.be.disabled')
      }

      if (lessonType === 'code') {
        it(`passes code challenge and enables next button`, function () {
          pasteSolutionCode()
          passCodeChallenge()
        })
        advanceToNextLesson()
      }

      function uploadSingleFile () {
        it(`uploads a single file`, function () {
          const fileName = 'favicon.png'
          cy.fixture(fileName).then(fileContent => {
            cy.get('[data-cy=file-upload]').upload({ fileContent, fileName, mimeType: 'image/png' })
          })
        })
      }
      function uploadMultipleFiles () {
        it(`uploads 2 files`, function () {
          cy.fixture('example.json', 'base64').then(exampleJson => {
            cy.fixture('favicon.png', 'base64').then(faviconPng => {
              const files = [
                { fileName: 'example.json', fileContent: exampleJson, mimeType: 'application/json' },
                { fileName: 'favicon.png', fileContent: faviconPng, mimeType: 'image/png' }
              ]
              cy.get('[data-cy=file-upload]').upload(files, { uploadType: 'input' })
            })
          })
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
          cy.get(`[data-cy=reset-files]`).click()
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
            advance.msg = `should PASS multiple choice lesson and advance to lesson ${nextLessonNr}`
            advance.method = 'click'
            advance.buttonData = 'next-lesson-mult-choice'
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
} // end advanceThroughLessons
