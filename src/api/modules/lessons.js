const fs = require('fs').promises
const path = require('path')

const errorCode = require('err-code')
const marked = require('meta-marked')

const config = require('../config')

function getFormattedId (id) {
  return id.toString().padStart(2, 0)
}

function getId (formattedId) {
  return parseInt(formattedId, 10)
}

function getNextLessonId (tutorial) {
  return tutorial.lessons.length > 0
    ? (parseInt(tutorial.lessons.map(lesson => lesson.formattedId).sort().reverse()[0]) + 1).toString().padStart(2, 0)
    : '01'
}

async function get (tutorial, lessonId) {
  const formattedId = getFormattedId(lessonId)
  const lessonFilePrefix = `${tutorial.folderName}/${formattedId}`

  let lessonMd
  let lesson

  try {
    lessonMd = await fs.readFile(files.getMarkdownPath(tutorial, lessonId), 'utf8')
    lesson = {
      id: lessonId,
      formattedId: formattedId,
      tutorialId: tutorial.id,
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
 * Creates a new lesson in the specificed tutorial
 *
 * `data.type` can be one of `text`, `multiple-choice`, `code` or `file-upload`.
 *
 * @param {String} tutorial Tutorial object
 * @param {Object} data Lesson data (mandatory: `title`, `type`)
 *
 * @returns The newly created lesson
 *
 * @example
 * await api.lessons.create(tutorial, { title: 'Lesson title', type: 'text' })
 */
async function create (tutorial, data) {
  const lessonId = getNextLessonId(tutorial)

  let lessonMarkdown = await fs.readFile(config.boilerplates.markdownPath, 'utf8')

  lessonMarkdown = lessonMarkdown.replace(`title: "Lesson title"`, `title: "${data.title}"`)
  lessonMarkdown = lessonMarkdown.replace(`type: "text"`, `type: "${data.type || 'text'}"`)

  if (data.type !== 'text') {
    await fs.copyFile(`${config.boilerplates.path}/boilerplate-${data.type}.js`, files.getJsPath(tutorial, lessonId))

    if (data.type !== 'multiple-choice') {
      await fs.copyFile(config.boilerplates.challengeMarkdownPath, files.getChallengeMarkdownPath(tutorial, lessonId))
    }
  }

  await fs.writeFile(files.getMarkdownPath(tutorial, lessonId), lessonMarkdown)

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
  files
}
