import _ from 'lodash'
import courses from '../../src/static/courses.json'
import { correctedCases } from '../../src/utils/tutorials'
import translations from '../../src/static/translations'

const namedCourses = _.omit(courses, ['all', 'featured'])

function courseName (courseKey) {
  return courseKey.split('-').map(word => (
    correctedCases[word] ? correctedCases[word] : (word.charAt(0).toUpperCase() + word.slice(1))
  )).join(' ')
}

function courseDescription (courseKey) {
  return translations.courses[courseKey].description
}

// renders all tutorial pages
describe(`DISPLAYS ALL COURSE PAGES CORRECTLY`, function () {
  for (const courseKey of Object.keys(namedCourses)) {
    it(`renders ${courseName(courseKey)} course landing page`, function () {
      cy.visit(`/course/${courseKey}`) // loads page
      cy.get('h1').contains(courseName(courseKey)) // includes course name in H1
      cy.get('[data-cy=tutorial-card-title]').should('have.length', namedCourses[courseKey].length) // has corrected number of tutorials
      cy.get('p').first().contains(courseDescription(courseKey)) // 1st para matches course description
    })
  }
})
