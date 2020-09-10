describe('REDIRECTS', () => {
  function assertHashRouteRedirect (path, redirect) {
    cy.visit(`/#${path}`)
    cy.location('pathname').should('eq', redirect || path)
  }

  it('should redirect the old hash urls to the new paths', () => {
    assertHashRouteRedirect('/tutorials')
    assertHashRouteRedirect('/news')
    assertHashRouteRedirect('/host')
    assertHashRouteRedirect('/events')
    assertHashRouteRedirect('/chapters', '/events')
    assertHashRouteRedirect('/build')
    assertHashRouteRedirect('/contribute')
    assertHashRouteRedirect('/data-structures')
    assertHashRouteRedirect('/data-structures/resources')
    assertHashRouteRedirect('/data-structures/01')
    assertHashRouteRedirect('/basics')
    assertHashRouteRedirect('/basics/', '/basics')
    assertHashRouteRedirect('/basics/resources')
    assertHashRouteRedirect('/basics/02')
    assertHashRouteRedirect('/unknown-route', '/404')
    assertHashRouteRedirect('/unknown-route/01', '/404')
    assertHashRouteRedirect('/news/01', '/404')
  })
})
