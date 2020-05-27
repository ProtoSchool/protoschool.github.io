/**
 * API for ProtoSchool.
 *
 * TODO:
 *  - make all scripts use this API
 *  - change it to be universal so the website can also use it
 *   - ATM we have deps on fs.readFile etc
 *
 * @module api
 */
module.exports = {
  projects: require('./modules/projects'),
  lessons: require('./modules/lessons'),
  courses: require('./modules/courses'),
  resources: require('./modules/resources'),
  tutorials: require('./modules/tutorials')
}
