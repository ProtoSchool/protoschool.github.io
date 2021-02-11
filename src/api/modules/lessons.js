const fs = require('fs')

const errorCode = require('err-code')
const marked = require('meta-marked')

const log = require('../logger')
const debug = require('../debug')
const config = require('../config')

const logGroup = log.createLogGroup('lessons')

function getFormattedId (id) {
  return id.toString().padStart(2, 0)
}

function getId (formattedId) {
  return parseInt(formattedId, 10)
}

function getNextLessonId (tutorial) {
  return tutorial.lessons.length > 0
    ? tutorial.lessons.map(lesson => lesson.id).sort().reverse()[0] + 1
    : 1
}

function get (tutorial, lessonId) {
  const formattedId = getFormattedId(lessonId)
  const lessonFilePrefix = `${tutorial.folderName}/${formattedId}`

  let lessonMd
  let lesson

  debug && log.debug(logGroup('get'), tutorial.id, lessonId, formattedId)

  try {
    lessonMd = fs.readFileSync(files.getMarkdownPath(tutorial, lessonId), 'utf8')
    lesson = {
      id: lessonId,
      formattedId: formattedId,
      tutorialId: tutorial.id,
      url: `${tutorial.url}/${formattedId}`,
      ...marked(lessonMd).meta
    }

    lesson.files = {
      markdown: files.getMarkdownPath(tutorial, lessonId)
    }

    if (lesson.type !== 'text') {
      lesson.files.js = files.getJsPath(tutorial, lessonId)

      if (lesson.type !== 'multiple-choice') {
        lesson.files.challengeMarkdown = files.getChallengeMarkdownPath(tutorial, lessonId)
      }
    }
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'ENOENT') {
      throw errorCode(new Error(`NOT FOUND: Lesson with id "${lessonId}" not found.`), 'NOT_FOUND')
    }

    // data not well formatted
    if (error.name === 'YAMLException') {
      console.error(
        new Error(`Data improperly formatted in the lesson markdown file "${lessonFilePrefix}.md". Check that the YAML syntax is correct.`)
      )
    }
  }

  return lesson
}

/**
 * overwrites the JS file for a multiple-choice lesson with new quiz content &
 * removes boilerplate's #PRISTINE# tag (if present) to show edits have been made
 */

function updateQuiz (tutorial, lesson, data) {
  const lessonId = lesson.formattedId
  const newFileContent = `
/* eslint quotes: ["error", "double"]  */

// Question must be a string
const question = "${data.question}"

// Choices must be an array of objects, each with the properties:
// \`answer\` (string), \`correct\` (boolean), and \`feedback\` (string)
// Only one answer can be correct.
const choices = ${JSON.stringify(data.choices, null, 2)}

export default {
  question,
  choices
}
`
  fs.writeFileSync(files.getJsPath(tutorial, lessonId), newFileContent)
  return get(tutorial, lessonId)
}

/**
 * returns true if the quiz was created from the boilerplate and still has
 * #PRISTINE# tag because either:
 * a) it's never been edited, manually or via ProtoWizard
 * b) user edited manually and failed to remove #PRISTINE# tag as instructed
*/

function isQuizPristine (tutorial, lesson) {
  let quizContent = fs.readFileSync(files.getJsPath(tutorial, lesson.formattedId), 'utf8')
  return quizContent.includes('#PRISTINE#')
}

/**
 * Creates a new lesson in the specified tutorial
 *
 * `data.type` can be one of `text`, `multiple-choice`, `code` or `file-upload`.
 *
 * @param {String} tutorial Tutorial object
 * @param {Object} data Lesson data (mandatory: `title`, `type`)
 *
 * @returns The newly created lesson
 *
 * @example
 * api.lessons.create(tutorial, { title: 'Lesson title', type: 'text' })
 */

function create (tutorial, data) {
  const lessonId = getNextLessonId(tutorial)

  let lessonMarkdown = fs.readFileSync(config.boilerplates.markdownPath, 'utf8')

  lessonMarkdown = lessonMarkdown.replace(`title: "Lesson title"`, `title: "${data.title}"`)
  lessonMarkdown = lessonMarkdown.replace(`type: "text"`, `type: "${data.type || 'text'}"`)

  if (data.type !== 'text') {
    fs.copyFileSync(`${config.boilerplates.path}/boilerplate-${data.type}.js`, files.getJsPath(tutorial, lessonId))

    if (data.type !== 'multiple-choice') {
      fs.copyFileSync(config.boilerplates.challengeMarkdownPath, files.getChallengeMarkdownPath(tutorial, lessonId))
    }
  }

  fs.writeFileSync(files.getMarkdownPath(tutorial, lessonId), lessonMarkdown)

  return get(tutorial, lessonId)
}

const files = {}

files.getMarkdownPath = (tutorial, lessonId) => (
  `${tutorial.fullPath}/${getFormattedId(lessonId)}.md`
)

files.getJsPath = (tutorial, lessonId) => (
  `${tutorial.fullPath}/${getFormattedId(lessonId)}.js`
)

files.getChallengeMarkdownPath = (tutorial, lessonId) => (
  `${tutorial.fullPath}/${getFormattedId(lessonId)}-challenge.md`
)

module.exports = {
  getNextLessonId,
  getFormattedId,
  getId,
  get,
  create,
  files,
  updateQuiz,
  isQuizPristine
}
