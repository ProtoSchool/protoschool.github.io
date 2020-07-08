import moment from 'moment'

// TODO: Fix existing tests to check against a tutorial landing page, not the tutorials page
// TODO: Add test for appropriate icon on card on tutorials page

describe(`DISPLAY TUTORIAL MESSAGES`, function () {
  const mockTutorial = {
    formattedId: '0001',
    id: 1,
    url: 'data-structures',
    redirectUrls: [],
    project: 'ipfs',
    title: 'Decentralized Data Structures',
    description: 'The decentralized web relies on unique data structures and linking strategies. Learn about the benefits of hashing, content addressing, DAG and Merkle Trees!',
    resources: [
      {
        title: 'Understanding How IPFS Deals with Files',
        link: 'https://youtu.be/Z5zNPwMDYGg',
        type: 'video',
        description: 'This course from IPFS Camp 2019 offers a deep exploration of how IPFS deals with files, including key concepts like immutability, content addressing, hashing, the anatomy of CIDs, what the heck a Merkle DAG is, and how chunk size affects file imports.'
      }
    ],
    newMessage: '',
    updateMessage: '',
    createdAt: '2019-01-01T00:00:00.000Z',
    updatedAt: '2019-01-01T00:00:00.000Z'
  }

  function visitTutorialsWithDates ({
    createdAt = mockTutorial.createdAt,
    updatedAt = mockTutorial.updatedAt,
    newMessage = mockTutorial.newMessage,
    updateMessage = mockTutorial.updateMessage,
    passedAt,
    lessons = []
  }) {
    cy.visit('#/tutorials', { // CHANGE TO LANDING PAGE OF MOCK? BUT IT 404s THAT WAY
      onBeforeLoad (window) {
        window.__DATA__ = {
          tutorials: {
            [mockTutorial.formattedId]: {
              ...mockTutorial,
              createdAt: createdAt && createdAt.toISOString(),
              updatedAt: updatedAt && updatedAt.toISOString(),
              newMessage,
              updateMessage
            }
          }
        }

        window.localStorage.clear()

        passedAt &&
          window.localStorage.setItem(
            `passed/${mockTutorial.url}`,
            passedAt === 'passed' ? passedAt : passedAt.toISOString()
          )

        lessons.forEach((lessonPassedAt, index) => {
          window.localStorage.setItem(
            `passed/${mockTutorial.url}/${(index + 1).toString().padStart(2, 0)}`,
            lessonPassedAt === 'passed' ? lessonPassedAt : lessonPassedAt.toISOString()
          )
        })
      }
    })
  }

  describe('new tutorial messages', () => {
    it(`should show new message for new tutorials published less than a month ago`, function () {
      const date = moment().add(-2, 'weeks')

      visitTutorialsWithDates({
        createdAt: date,
        updatedAt: date,
        newMessage: 'new message'
      })

      cy.get('.tutorial-message--new').should('exist')
      cy.get('.tutorial-message--updated').should('not.exist')
      cy.get('.tutorial-message--new .tutorial-message-text').should('contain', 'new message')
    })

    it(`should show new message for tutorials published less than a month ago that already have an update but don't yet have any lessons completed by user`, function () {
      const createdAt = moment().add(-2, 'weeks')
      const updatedAt = moment().add(-1, 'weeks')

      visitTutorialsWithDates({
        createdAt,
        updatedAt,
        newMessage: 'new message',
        updateMessage: 'update message'
      })

      cy.get('.tutorial-message--new').should('exist')
      cy.get('.tutorial-message--updated').should('not.exist')
      cy.get('.tutorial-message--new .tutorial-message-text').should('contain', 'new message')
    })

    it(`should not show new message for tutorials published less than a month ago in which the user has completed some lessons`, function () {
      const date = moment().add(-2, 'weeks')
      const lessons = [
        moment().add(-2, 'days')
      ]

      visitTutorialsWithDates({
        createdAt: date,
        updatedAt: date,
        newMessage: 'new message',
        lessons
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('not.exist')
      cy.get('.tutorial-message--new .tutorial-message-text').should('not.contain', 'new message')
    })

    it(`should not show new message for recently published tutorials that were completed by user before this feature was implemented`, function () {
      const date = moment().add(-2, 'weeks')

      visitTutorialsWithDates({
        createdAt: date,
        updatedAt: date,
        passedAt: 'passed'
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('not.exist')
    })

    it(`should not show new message for new tutorials published more than 1 month ago`, function () {
      const date = moment().add(-5, 'weeks')

      visitTutorialsWithDates({
        createdAt: date,
        updatedAt: date
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('not.exist')
    })

    it(`should not show new message for recently published tutorials that have already been completed`, function () {
      const date = moment().add(-2, 'weeks')

      visitTutorialsWithDates({
        createdAt: date,
        updatedAt: date,
        passedAt: moment().add(-1, 'weeks')
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('not.exist')
    })

    it(`should not show new message for tutorials published more than a month ago that have been completed before this feature was implemented`, function () {
      const date = moment().add(-5, 'weeks')

      visitTutorialsWithDates({
        createdAt: date,
        updatedAt: date,
        passedAt: 'passed'
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('not.exist')
    })
  })

  describe('update tutorial messages', () => {
    it(`should show update message for tutorial completed before the this feature was implemented`, () => {
      const createdAt = moment().add(-10, 'months')
      const updatedAt = moment().add(-2, 'weeks')

      visitTutorialsWithDates({
        createdAt,
        updatedAt,
        passedAt: 'passed',
        updateMessage: 'update'
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('exist')
      cy.get('.tutorial-message--updated .tutorial-message-text').should('contain', 'update')
    })

    it(`should show update message for tutorial completed before update`, () => {
      const createdAt = moment().add(-10, 'months')
      const updatedAt = moment().add(-2, 'weeks')
      const passedAt = moment().add(-3, 'weeks')

      visitTutorialsWithDates({
        createdAt,
        updatedAt,
        passedAt,
        updateMessage: 'update message'
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('exist')
      cy.get('.tutorial-message--updated .tutorial-message-text').should('contain', 'update message')
    })
    it(`should show update message for unfinished tutorial if some lessons were passed before the update`, () => {
      const createdAt = moment().add(-10, 'months')
      const updatedAt = moment().add(-2, 'weeks')
      const lessons = [
        moment().add(-3, 'weeks'),
        moment().add(-1, 'weeks')
      ]

      visitTutorialsWithDates({
        createdAt,
        updatedAt,
        lessons
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('exist')
    })
    it(`should show update message for unfinished tutorial if some lessons were passed before this feature was implemented`, () => {
      const createdAt = moment().add(-10, 'months')
      const updatedAt = moment().add(-2, 'weeks')
      const lessons = [
        'passed',
        moment().add(-1, 'weeks')
      ]

      visitTutorialsWithDates({
        createdAt,
        updatedAt,
        lessons
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('exist')
    })
    it(`should not show update message for unfinished tutorial if any lesson was passed after the update`, () => {
      const createdAt = moment().add(-10, 'months')
      const updatedAt = moment().add(-2, 'weeks')
      const lessons = [
        moment().add(-1, 'weeks'),
        moment().add(-1, 'days')
      ]

      visitTutorialsWithDates({
        createdAt,
        updatedAt,
        lessons
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('not.exist')
    })
    it(`should not show update message if no updates were published`, () => {
      const date = moment().add(-5, 'weeks')

      visitTutorialsWithDates({
        createdAt: date,
        updatedAt: date
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('not.exist')
    })
    it(`should not show update message if no lessons are completed`, () => {
      const createdAt = moment().add(-5, 'weeks')
      const updatedAt = moment().add(-1, 'weeks')

      visitTutorialsWithDates({
        createdAt,
        updatedAt,
        updateMessage: 'Tutorial Updates!'
      })

      cy.get('.tutorial-message--new').should('not.exist')
      cy.get('.tutorial-message--updated').should('not.exist')
    })
  })
})
