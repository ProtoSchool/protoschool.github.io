/**
 * API for ProtoSchool.
 *
 * TODO:
 *  - make all scripts use this API
 *  - change it to be universal so the website can also use it
 *   - ATM we have deps on fs.readFile etc
 */

module.exports = {
  tutorials: require('./modules/tutorials'),
  resources: require('./modules/resources'),
  courses: require('./modules/courses'),
  projects: require('./modules/projects')
}
