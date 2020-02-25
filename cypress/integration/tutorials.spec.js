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
  multipleChoice: {
    tutorialId: '0006',
    lessonNr: '03'
  },
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

// ensures multiple choice options display correct content and passing status
describe(`NAVIGATES MULTIPLE CHOICE OPTIONS SUCCESSFULLY`, function () {
  testMultipleChoiceOptions(testLessons.multipleChoice.tutorialId, testLessons.multipleChoice.lessonNr)
})

// for tutorials with standard code challenges, ensure solution code passes lessons
describe(`ADVANCES THROUGH ALL LESSONS IN ALL TUTORIALS`, function () {
  Object.keys(tutorials).forEach(tutorialId => {
    describe(`tutorial ${tutorialId} (${tutorials[tutorialId].url})`, function () {
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
    cy.get(`[data-cy=progress-not-yet-started]`).should('exist')
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
      } // end mult choice

      // CODE CHALLENGES ONLY (code and file upload)

      function pasteSolutionCode () {
        cy.get('[data-cy=code-editor-ready]').should('be.visible') // wait for editor to be updated
        cy.get(`[data-cy=next-lesson-code]`).should('not.be.visible')
        cy.get('[data-cy=replace-with-solution]').click({ force: true })
      }

      function passCodeChallenge () {
        cy.get('[data-cy=submit-answer]').click()
        cy.get('[data-cy=output-success]').should('be.visible')
        cy.get(`[data-cy=next-lesson-code]`).should('be.visible').and('not.be.disabled')
      }

      // function uploadFile () {
      //   cy.log(`Can't yet test file upload`)
      // }

      if (lessonType === 'code') {
        it(`passes code challenge and enables next button`, function () {
          pasteSolutionCode()
          passCodeChallenge()
        })
      }

      if (lessonType === 'file-upload') {
        it(`pastes solution`, function () {
          pasteSolutionCode()
          cy.log(`can't yet test file upload or submit code for file upload lesson`)
          // uploadFile()
          // passCodeChallenge()
        })
      }

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
          advance.msg = `advances to lesson ${nextLessonNr}`
          advance.method = 'click'
          advance.buttonData = 'next-lesson-mult-choice'
          break
        case 'file-upload':
          advance.msg = `CHEATS to advance to ${nextLessonNr}`
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
          cy.get(`[data-cy=${advance.buttonData}]`).should('be.visible').and('not.be.disabled')
          cy.get(`[data-cy=${advance.buttonData}]`).click()
        }
        cy.url().should('include', `#/${tutorialName}/${nextLessonNr}`)
        cy.contains('h1', lessons[index + 1].title)
      })
    }) // end this lesson
  }) // end loop through standard lessons, landing on resources page
}
