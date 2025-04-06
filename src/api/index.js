/**
 * API for ProtoSchool.
 *
 * TODO: Make API universal https://github.com/ProtoSchool/protoschool.github.io/issues/589
 *  - make all scripts use this API
 *  - change it to be universal so the website can also use it
 *   - ATM we have deps on fs.readFile etc
 *
 * @module api
*/
export * as courses from './modules/courses.js'
export * as lessons from './modules/lessons.js'
export * as projects from './modules/projects.js'
export * as resources from './modules/resources.js'
export * as tutorials from './modules/tutorials.js'
export * as config from './config.js'
