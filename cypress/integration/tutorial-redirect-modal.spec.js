import tutorialsList, { getTutorialType } from '../../src/utils/tutorials'

function visit (url, { referrer, clearStorage = true } = {}) {
  cy.visit(url, {
    onBeforeLoad (window) {
      referrer &&
        Object.defineProperty(window.document, 'referrer', { get () { return referrer } })

      clearStorage &&
        window.localStorage.clear()
    }
  })
}

// Asserts

function assertModalShows () {
  cy.get('.modal-overlay', { timeout: 5e3 }).should('exist')
  cy.get('[data-cy="tutorial-redirect-modal"', { timeout: 5e3 }).should('be.visible')
  cy.get('.home', { timeout: 5e3 }).should('be.visible') // still visible behind the overlay
}

function assertModalContent ({ tutorial, lessonId, context = 'start' }) {
  const lesson = tutorial && tutorial.lessons.find(lesson => lesson.id === lessonId)

  cy.get('.modal-content')
    .should('contain.text', tutorial.title)
    .should('contain.text', lesson.title)

  if (context === 'start') {
    // check content matches the start context
    cy.get('.modal-content', { timeout: 5e3 }).should('contain', 'start this tutorial')
  } else if (context === 'resume') {
    cy.get('.modal-content', { timeout: 5e3 }).should('contain', 'resume the tutorial')
  }
}

function assertModalActions ({ action = 'start' } = {}) {
  if (action === 'start') {
    cy.get('[data-cy="tutorial-redirect-modal-action-start"]', { timeout: 5e3 }).should('exist')
  } else if (action === 'resume') {
    cy.get('[data-cy="tutorial-redirect-modal-action-resume"]', { timeout: 5e3 }).should('exist')
  }
}

function assertModalDoesNotShow () {
  cy.get('[data-cy="tutorial-redirect-modal"', { timeout: 5e3 }).should('not.exist')
  cy.get('.modal-overlay', { timeout: 5e3 }).should('not.exist')
  cy.get('.home', { timeout: 5e3 }).should('be.visible')
}

describe('TUTORIAL REDIRECT MODAL', () => {
  let tutorial

  before(() => {
    // get first text based tutorial
    tutorial = tutorialsList[Object.keys(tutorialsList).find(tutorialFormattedId => getTutorialType(tutorialFormattedId) === 'text')]
  })

  it('should show when landing in the middle of a tutorial from a search engine', () => {
    visit(`/${tutorial.url}/03`, { referrer: 'https://google.com/' })
    assertModalShows()
    assertModalContent({ tutorial, lessonId: 3 })

    visit(`/${tutorial.url}/04/`, { referrer: 'https://bing.com/' })
    assertModalShows()
    assertModalContent({ tutorial, lessonId: 4 })
  })

  it('should show when landing in the middle of a tutorial from a search engine and show the resume option when some past lessons have been passed', () => {
    visit(`/${tutorial.url}/01`, { referrer: '' })
    cy.get('button[data-cy="next-lesson-text"]').click()
    cy.get('button[data-cy="next-lesson-text"]').click()
    visit(`/${tutorial.url}/05`, { referrer: 'https://google.com', clearStorage: false })
    assertModalShows()
    assertModalContent({ tutorial, lessonId: 5, context: 'resume' })
    assertModalActions({ action: 'resume' })
  })

  it('should close when using close button', () => {
    visit(`/${tutorial.url}/02`, { referrer: 'https://google.com' })
    assertModalShows()
    assertModalContent({ tutorial, lessonId: 2 })
    cy.get('button.close').click()
    assertModalDoesNotShow()
  })

  it('should close when using view lesson button', () => {
    visit(`/${tutorial.url}/02`, { referrer: 'https://google.com' })
    assertModalShows()
    assertModalContent({ tutorial, lessonId: 2 })
    cy.get('button[data-cy="tutorial-redirect-modal-view-lesson"').click()
    assertModalDoesNotShow()
  })

  it('should not show when referrer is empty', () => {
    visit(`/${tutorial.url}/02`, { referrer: '' })
    assertModalDoesNotShow()
  })

  it('should not show when opening lesson and the referrer is not one of the configured search engines', () => {
    visit(`/${tutorial.url}/03`, { referrer: 'https://searchengine.com/' })
    assertModalDoesNotShow()
  })

  it('should not show when opening lesson from app link', () => {
    visit(`/${tutorial.url}`, { referrer: 'http://localhost:3000/' })
    cy.get(`a[href="/${tutorial.url}/02"][data-cy="lesson-link-standard"]`).click()
    assertModalDoesNotShow()
  })

  it('should not show when opening the first lesson', () => {
    visit(`/${tutorial.url}/01`, { referrer: 'https://google.com/' })
    assertModalDoesNotShow()
  })

  it('should not show when opening resources lesson', () => {
    visit(`/${tutorial.url}/resources`, { referrer: 'https://google.com/' })
    assertModalDoesNotShow()
  })

  it('should not show when opening a lesson the user already passed', () => {
    visit(`/${tutorial.url}/02`, { referrer: 'https://google.com' })
    assertModalShows()
    assertModalContent({ tutorial, lessonId: 2 })
    cy.get('button.close').click()
    cy.get('button[data-cy="next-lesson-text"]').click()
    visit(`/${tutorial.url}/02`, { referrer: 'https://google.com', clearStorage: false })
    assertModalDoesNotShow()
  })

  it('should not show a second time after starting a tutorial and passing the lesson', () => {
    visit(`/${tutorial.url}/01`, { referrer: 'https://google.com' })
    assertModalDoesNotShow()
    cy.get('button[data-cy="next-lesson-text"]').click()
    visit(`/${tutorial.url}/03`, { referrer: 'https://google.com', clearStorage: false })
    assertModalShows()
    assertModalContent({ tutorial, lessonId: 3, context: 'resume' })
    assertModalActions({ action: 'resume' })
    cy.get(`[data-cy="tutorial-redirect-modal-action-resume"]`).click()
    cy.location('pathname').should('eq', `/${tutorial.url}/02`)
    assertModalDoesNotShow()
    cy.get('button[data-cy="next-lesson-text"]').click()
    cy.location('pathname').should('eq', `/${tutorial.url}/03`)
    assertModalDoesNotShow()
  })

  it('should always show when using the query parameter _forceShowRedirectModal=true', () => {
    visit(`/${tutorial.url}/01?_forceShowRedirectModal=true`)
    assertModalShows()
    assertModalContent({ tutorial, lessonId: 1, context: 'start' })
    assertModalActions({ action: 'start' })
  })
})
