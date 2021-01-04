import _ from 'lodash'
import courses from '../../src/static/courses.json'
import { correctedCases } from '../../src/utils/tutorials'

const namedCourses = _.omit(courses, ['all', 'featured'])

function courseName (courseKey) {
  return courseKey.split('-').map(word => (
    correctedCases[word] ? correctedCases[word] : (word.charAt(0).toUpperCase() + word.slice(1))
  )).join(' ')
}

// renders all tutorial pages
describe(`DISPLAYS ALL COURSE PAGES CORRECTLY`, function () {
  for (const courseKey of Object.keys(namedCourses)) {
    it(`renders ${courseName(courseKey)} course landing page`, function () {
      cy.visit(`/course/${courseKey}`) // loads page
      cy.get('h1').contains(courseName(courseKey)) // includes course name in H1
      cy.get('[data-cy=tutorial-card-title]').should('have.length', namedCourses[courseKey].length) // has corrected number of tutorials
      cy.get('[data-cy=course-content-description]') // loads content description
      cy.get('[data-cy=course-format-description]') // loads format description
    })
  }
})
