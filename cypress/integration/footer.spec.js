const pages = ['/', '/events', '/content-addressing', 'content-addressing/02']

// renders footer on all sample pages
describe(`DISPLAYS FOOTER ON EACH PAGE TYPE`, function () {
  for (const page of pages) {
    it(`renders footer at ${page}`, function () {
      cy.visit(`${page}`) // loads specified page
      cy.get('[data-cy="footer-component"]') // loads footer component
    })
  }
})

describe(`OPENS LINKS IN CORRECT WINDOWS`, function () {
  it(`opens internal link`, function () {
    cy.visit('/')
    cy.get('[data-cy="footer-link-internal"]').contains('News').click() // click internal News link
    cy.get('h1').contains('Newsletter') // because Cypress can't switch to new window, this proves correct page was opened in current window
  })
  it(`opens new window for external link`, function () {
    // we're on news page now but header is still there so don't need to visit '/'
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen')
    })
    cy.get('[data-cy="footer-link-external"]').first().click() // click first external link
    cy.get('@windowOpen').should('be.called') // confirm window.open happened
  })
})
